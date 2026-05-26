import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { CreditCard, CheckCircle, AlertCircle, Clock, Receipt, Info, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

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

    if (loading) return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="student" />
            <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div style={{ border: '4px solid var(--border-color)', borderTop: '4px solid #8b5cf6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
            </div>
        </div>
    );

    const pending = fees ? Math.max(0, (fees.totalFees + fees.fine + fees.otherCharges) - fees.depositedFees) : 0;
    const isPaid = fees && pending === 0;

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="student" />
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>My Fee Details</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>
                        Fee summary for {user?.name} — current academic session
                    </p>
                </div>

                {!fees || !fees.totalFees ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '5rem 2rem', textAlign: 'center',
                            backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--border-color)',
                            borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
                        }}
                    >
                        <div style={{ background: '#faf5ff', color: '#8b5cf6', padding: '1.2rem', borderRadius: '50%' }}>
                            <Receipt size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>No Fee Record Found</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0, maxWidth: '400px' }}>
                            Your fee details will appear here once updated by the administration.
                        </p>
                    </motion.div>
                ) : (
                    <>
                        {/* Status Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '1.2rem 1.5rem',
                                borderRadius: '16px',
                                background: isPaid ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                display: 'flex', alignItems: 'center', gap: '12px'
                            }}
                        >
                            {isPaid ? <CheckCircle size={22} color="white" /> : <AlertCircle size={22} color="white" />}
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ margin: 0, color: 'white', fontWeight: '800', fontSize: '1rem' }}>
                                    {isPaid ? 'All fees are paid!' : `₹${pending.toLocaleString('en-IN')} due`}
                                </p>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontWeight: '500' }}>
                                    {isPaid ? 'Congratulations, your account is clear.' : 'Please clear your dues before the due date.'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
                            {[
                                { label: 'Total Fees', value: `₹${fees.totalFees?.toLocaleString('en-IN')}`, icon: CreditCard, color: '#8b5cf6', bg: '#faf5ff' },
                                { label: 'Deposited', value: `₹${fees.depositedFees?.toLocaleString('en-IN')}`, icon: CheckCircle, color: '#16a34a', bg: '#dcfce7' },
                                { label: 'Pending', value: `₹${pending.toLocaleString('en-IN')}`, icon: AlertCircle, color: pending > 0 ? '#dc2626' : '#16a34a', bg: pending > 0 ? '#fee2e2' : '#dcfce7' },
                                ...(fees.fine > 0 ? [{ label: 'Fine', value: `₹${fees.fine?.toLocaleString('en-IN')}`, icon: TrendingDown, color: '#b45309', bg: '#fffbeb' }] : []),
                                ...(fees.otherCharges > 0 ? [{ label: 'Other Charges', value: `₹${fees.otherCharges?.toLocaleString('en-IN')}`, icon: Receipt, color: '#7c3aed', bg: '#faf5ff' }] : []),
                            ].map((card, i) => (
                                <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                                    <div style={{ background: card.bg, color: card.color, padding: '0.65rem', borderRadius: '12px' }}>
                                        <card.icon size={20} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>{card.label}</span>
                                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: card.color, margin: '0.1rem 0 0' }}>{card.value}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Fee Breakdown */}
                        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem', textAlign: 'left' }}>
                                <div style={{ background: '#faf5ff', color: '#8b5cf6', padding: '7px', borderRadius: '10px' }}>
                                    <Receipt size={16} />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Fee Breakdown</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                {[
                                    { label: 'Total Session Fees', val: `₹${fees.totalFees?.toLocaleString('en-IN')}`, highlight: false },
                                    { label: 'Amount Deposited', val: `₹${fees.depositedFees?.toLocaleString('en-IN')}`, highlight: false },
                                    { label: 'Fine', val: fees.fine > 0 ? `₹${fees.fine} (${fees.fineDescription || 'N/A'})` : 'None', highlight: fees.fine > 0 },
                                    { label: 'Other Charges', val: fees.otherCharges > 0 ? `₹${fees.otherCharges} (${fees.otherChargesDescription || 'N/A'})` : 'None', highlight: fees.otherCharges > 0 },
                                    { label: 'Due Date', val: fees.dueDate ? new Date(fees.dueDate).toLocaleDateString('en-IN') : 'Not set', highlight: false },
                                    { label: 'Last Payment', val: fees.lastPaymentDate ? new Date(fees.lastPaymentDate).toLocaleDateString('en-IN') : 'None', highlight: false },
                                ].map((item, i) => (
                                    <div key={i} style={{ padding: '1rem', background: item.highlight ? '#fffbeb' : 'var(--bg-light)', borderRadius: '12px', border: `1.5px solid ${item.highlight ? '#d97706' : 'var(--border-color)'}`, textAlign: 'left' }}>
                                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{item.label}</p>
                                        <p style={{ margin: '0.3rem 0 0', fontWeight: '800', color: item.highlight ? '#b45309' : 'var(--text-primary)', fontSize: '0.95rem' }}>{item.val}</p>
                                    </div>
                                ))}
                            </div>
                            {fees.remarks && (
                                <div style={{ marginTop: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6', textAlign: 'left' }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#1d4ed8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Info size={14} /> <strong>Remarks:</strong> {fees.remarks}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Payment History */}
                        <div className="glass-card" style={{ border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden' }}>
                            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                                <div style={{ background: '#dcfce7', color: '#16a34a', padding: '7px', borderRadius: '10px' }}>
                                    <Clock size={16} />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Payment History</h3>
                            </div>
                            <div style={{ padding: '1rem 1.5rem' }}>
                                {!fees.paymentHistory?.length ? (
                                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem', fontWeight: '600', margin: 0 }}>No payments recorded yet.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        {[...fees.paymentHistory].reverse().map((p, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.2rem', background: 'var(--bg-light)', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                <div style={{ textAlign: 'left' }}>
                                                    <p style={{ margin: 0, fontWeight: '800', color: '#16a34a', fontSize: '1.1rem' }}>₹{p.amount?.toLocaleString('en-IN')}</p>
                                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{p.note || 'Payment received'}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>{p.mode}</span>
                                                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default StudentFees;
