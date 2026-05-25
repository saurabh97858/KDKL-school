import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { Spinner } from '../../components/GlobalUI';

const StudentFees = () => {
    const { user } = useContext(AuthContext);
    const [fees, setFees] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/my-fees', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => { setFees(res.data); setLoading(false); })
          .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="dashboard-container"><Sidebar role="student" /><div className="dashboard-content"><Spinner text="Loading fee details..." /></div></div>;

    const pending = fees ? (fees.totalFees + fees.fine + fees.otherCharges) - fees.depositedFees : 0;

    const StatCard = ({ label, value, color, bg, emoji }) => (
        <div style={{ background: bg, borderRadius: '16px', padding: '1.5rem', borderLeft: `5px solid ${color}`, boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>{emoji} {label}</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', fontWeight: '800', color }}>{value}</p>
        </div>
    );

    return (
        <div className="dashboard-container">
            <Sidebar role="student" />
            <div className="dashboard-content">
                <h1 style={{ color: '#1a2a6c', marginBottom: '0.3rem' }}>💰 My Fee Details</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Welcome, {user?.name} — Fee Summary for the current session</p>

                {!fees || !fees.totalFees ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <p style={{ fontSize: '4rem' }}>📋</p>
                        <h3 style={{ color: '#64748b' }}>No fee record found</h3>
                        <p style={{ color: '#94a3b8' }}>Your fee details will appear here once updated by the administration.</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
                            <StatCard label="Total Fees" value={`₹${fees.totalFees}`} color="#1a2a6c" bg="#eff6ff" emoji="📚" />
                            <StatCard label="Deposited" value={`₹${fees.depositedFees}`} color="#16a34a" bg="#f0fdf4" emoji="✅" />
                            <StatCard label="Pending" value={`₹${Math.max(0, pending)}`} color={pending > 0 ? '#dc2626' : '#16a34a'} bg={pending > 0 ? '#fef2f2' : '#f0fdf4'} emoji={pending > 0 ? '⚠️' : '🎉'} />
                            {fees.fine > 0 && <StatCard label="Fine" value={`₹${fees.fine}`} color="#b45309" bg="#fffbeb" emoji="🔔" />}
                            {fees.otherCharges > 0 && <StatCard label="Other Charges" value={`₹${fees.otherCharges}`} color="#7c3aed" bg="#faf5ff" emoji="📦" />}
                        </div>

                        {/* Fee Details Card */}
                        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                            <h3 style={{ color: '#1a2a6c', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>📋 Fee Breakdown</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    { label: 'Total Session Fees', val: `₹${fees.totalFees}`, highlight: false },
                                    { label: 'Amount Deposited', val: `₹${fees.depositedFees}`, highlight: false },
                                    { label: 'Fine', val: fees.fine > 0 ? `₹${fees.fine} (${fees.fineDescription || 'N/A'})` : 'None', highlight: fees.fine > 0 },
                                    { label: 'Other Charges', val: fees.otherCharges > 0 ? `₹${fees.otherCharges} (${fees.otherChargesDescription || 'N/A'})` : 'None', highlight: fees.otherCharges > 0 },
                                    { label: 'Due Date', val: fees.dueDate ? new Date(fees.dueDate).toLocaleDateString('en-IN') : 'Not set', highlight: false },
                                    { label: 'Last Payment', val: fees.lastPaymentDate ? new Date(fees.lastPaymentDate).toLocaleDateString('en-IN') : 'None', highlight: false },
                                ].map((item, i) => (
                                    <div key={i} style={{ padding: '0.8rem', background: item.highlight ? '#fffbeb' : '#f8fafc', borderRadius: '10px' }}>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{item.label}</p>
                                        <p style={{ margin: '0.3rem 0 0', fontWeight: '700', color: item.highlight ? '#b45309' : '#1a2a6c' }}>{item.val}</p>
                                    </div>
                                ))}
                            </div>
                            {fees.remarks && (
                                <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#f0f9ff', borderRadius: '10px', borderLeft: '4px solid #0ea5e9' }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#0369a1' }}><strong>📌 Remarks:</strong> {fees.remarks}</p>
                                </div>
                            )}
                        </div>

                        {/* Payment History */}
                        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ color: '#1a2a6c', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>📜 Payment History</h3>
                            {!fees.paymentHistory?.length ? (
                                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1.5rem' }}>No payments recorded yet.</p>
                            ) : (
                                [...fees.paymentHistory].reverse().map((p, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.2rem', marginBottom: '0.6rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '700', color: '#16a34a', fontSize: '1.1rem' }}>₹{p.amount}</p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{p.note || 'Payment received'}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.7rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>{p.mode}</span>
                                            <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>{new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentFees;
