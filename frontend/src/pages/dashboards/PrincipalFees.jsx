import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Spinner } from '../../components/GlobalUI';

const CLASS_LIST = ['LKG','UKG','1','2','3','4','5','6','7','8','9','10','11','12'];
const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal';

const PrincipalFees = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedMedium, setSelectedMedium] = useState('');
    const [selectedStream, setSelectedStream] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feeForm, setFeeForm] = useState({ totalFees: '', depositedFees: '', fine: '', fineDescription: '', otherCharges: '', otherChargesDescription: '', dueDate: '', remarks: '' });
    const [paymentForm, setPaymentForm] = useState({ amount: '', mode: 'Cash', note: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [tab, setTab] = useState('details'); // 'details' | 'history'

    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

    const fetchStudents = async (cls = selectedClass, med = selectedMedium, str = selectedStream) => {
        if (!cls) return;
        setLoading(true);
        setSelectedStudent(null);
        try {
            const res = await axios.get(`${API}/fees/class/${cls}`, {
                params: { medium: med, stream: str },
                headers: config.headers
            });
            setStudents(res.data);
        } catch { setStudents([]); }
        setLoading(false);
    };

    const selectStudent = (s) => {
        setSelectedStudent(s);
        setTab('details');
        setMsg('');
        const f = s.feeRecord;
        setFeeForm({
            totalFees: f?.totalFees ?? '',
            depositedFees: f?.depositedFees ?? '',
            fine: f?.fine ?? '',
            fineDescription: f?.fineDescription ?? '',
            otherCharges: f?.otherCharges ?? '',
            otherChargesDescription: f?.otherChargesDescription ?? '',
            dueDate: f?.dueDate ? f.dueDate.substring(0, 10) : '',
            remarks: f?.remarks ?? ''
        });
        setPaymentForm({ amount: '', mode: 'Cash', note: '' });
    };

    const handleSaveFee = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        try {
            await axios.post(`${API}/fees/student/${selectedStudent._id}`, feeForm, config);
            setMsg('✅ Fee details saved successfully!');
            fetchStudents(selectedClass);
        } catch { setMsg('❌ Save failed'); }
        setSaving(false);
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        if (!paymentForm.amount) return;
        setSaving(true);
        setMsg('');
        try {
            await axios.post(`${API}/fees/student/${selectedStudent._id}/payment`, paymentForm, config);
            setMsg('✅ Payment added!');
            fetchStudents(selectedClass);
        } catch { setMsg('❌ Payment failed'); }
        setSaving(false);
    };

    const pending = () => {
        const t = parseFloat(feeForm.totalFees) || 0;
        const d = parseFloat(feeForm.depositedFees) || 0;
        const f = parseFloat(feeForm.fine) || 0;
        const o = parseFloat(feeForm.otherCharges) || 0;
        return t + f + o - d;
    };

    const getStatusColor = (feeRecord) => {
        if (!feeRecord) return '#94a3b8';
        const p = (feeRecord.totalFees + feeRecord.fine + feeRecord.otherCharges) - feeRecord.depositedFees;
        if (p <= 0) return '#22c55e';
        if (p < feeRecord.totalFees * 0.5) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content" style={{ padding: '2rem' }}>
                <h1 style={{ color: '#1a2a6c', marginBottom: '0.3rem' }}>💰 Fee Management</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Class-wise student fee tracking & management</p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', background: 'var(--card-bg)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', alignItems: 'flex-end', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Class:</label>
                        <select 
                            value={selectedClass} 
                            onChange={(e) => { setSelectedClass(e.target.value); fetchStudents(e.target.value, selectedMedium, selectedStream); }}
                            className="form-input"
                            style={{ minWidth: '120px' }}
                        >
                            <option value="">Select Class</option>
                            {CLASS_LIST.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Medium:</label>
                        <select 
                            value={selectedMedium} 
                            onChange={(e) => { setSelectedMedium(e.target.value); fetchStudents(selectedClass, e.target.value, selectedStream); }}
                            className="form-input"
                            style={{ minWidth: '150px' }}
                        >
                            <option value="">All Mediums</option>
                            <option value="Hindi">Hindi</option>
                            <option value="English">English</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Stream:</label>
                        <select 
                            value={selectedStream} 
                            onChange={(e) => { setSelectedStream(e.target.value); fetchStudents(selectedClass, selectedMedium, e.target.value); }}
                            className="form-input"
                            style={{ minWidth: '150px' }}
                        >
                            <option value="">All Streams</option>
                            <option value="Science">Science</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Arts">Arts</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', marginLeft: 'auto' }}>
                        <button onClick={() => fetchStudents()} className="btn btn-primary" style={{ height: '36px' }}>Refresh</button>
                    </div>
                </div>

                {loading && <Spinner text="Loading students..." />}

                {!loading && selectedClass && students.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <p style={{ fontSize: '3rem' }}>🎒</p>
                        <p>No students found in Class {selectedClass}</p>
                    </div>
                )}

                {!loading && students.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '300px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
                        
                        {/* Student List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.25rem', transition: 'color 0.3s ease' }}>Class {selectedClass} — {students.length} Students</h3>
                            {students.map(s => {
                                const statusColor = getStatusColor(s.feeRecord);
                                const pend = s.feeRecord ? (s.feeRecord.totalFees + s.feeRecord.fine + s.feeRecord.otherCharges) - s.feeRecord.depositedFees : null;
                                const isSelected = selectedStudent?._id === s._id;
                                return (
                                    <div key={s._id} onClick={() => selectStudent(s)}
                                        style={{
                                            padding: '0.8rem 1rem', borderRadius: '10px', cursor: 'pointer',
                                            background: isSelected ? 'rgba(253, 187, 45, 0.15)' : 'var(--card-bg)',
                                            border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                                            transition: 'all 0.2s ease',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                        <div>
                                            <p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{s.studentName}</p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Father: {s.fatherName}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusColor, marginLeft: 'auto', marginBottom: '4px' }} />
                                            {pend !== null && (
                                                <p style={{ color: pend > 0 ? '#ef4444' : '#22c55e', fontWeight: '700', fontSize: '0.85rem', margin: 0 }}>
                                                    {pend > 0 ? `₹${pend}` : 'Paid'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Fee Detail Panel */}
                        {selectedStudent && (
                            <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h2 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.45rem', transition: 'color 0.3s ease' }}>{selectedStudent.studentName}</h2>
                                        <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>Class {selectedStudent.className} • Father: {selectedStudent.fatherName}</p>
                                    </div>
                                    {/* Live pending preview */}
                                    <div style={{ textAlign: 'right', background: pending() > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', padding: '0.6rem 1rem', borderRadius: '10px', transition: 'background 0.3s ease' }}>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending Amount</p>
                                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: pending() > 0 ? '#ef4444' : '#22c55e' }}>
                                            ₹{pending().toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {msg && <div style={{ padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', background: msg.includes('✅') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.includes('✅') ? '#16a34a' : '#dc2626', fontWeight: '600', fontSize: '0.9rem' }}>{msg}</div>}

                                {/* Tabs */}
                                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.4rem', transition: 'border-color 0.3s ease' }}>
                                    {['details', 'payment', 'history'].map(t => (
                                        <button key={t} onClick={() => setTab(t)} style={{
                                            padding: '0.4rem 1rem', border: 'none', borderRadius: '6px 6px 0 0',
                                            background: tab === t ? 'var(--primary)' : 'transparent',
                                            color: tab === t ? 'white' : 'var(--text-secondary)',
                                            fontWeight: '700', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
                                            fontSize: '0.85rem'
                                        }}>{t === 'details' ? '📋 Fee Details' : t === 'payment' ? '💳 Add Payment' : '📜 History'}</button>
                                    ))}
                                </div>

                                {/* Fee Details Form */}
                                {tab === 'details' && (
                                    <form onSubmit={handleSaveFee}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            {[
                                                { label: 'Total Fees (₹)', key: 'totalFees', type: 'number' },
                                                { label: 'Deposited Fees (₹)', key: 'depositedFees', type: 'number' },
                                                { label: 'Fine Amount (₹)', key: 'fine', type: 'number' },
                                                { label: 'Fine Description', key: 'fineDescription', type: 'text' },
                                                { label: 'Other Charges (₹)', key: 'otherCharges', type: 'number' },
                                                { label: 'Other Charges Description', key: 'otherChargesDescription', type: 'text' },
                                            ].map(f => (
                                                <div key={f.key}>
                                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{f.label}</label>
                                                    <input type={f.type} value={feeForm[f.key]} onChange={e => setFeeForm({ ...feeForm, [f.key]: e.target.value })}
                                                        className="form-input" />
                                                </div>
                                            ))}
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Due Date</label>
                                                <input type="date" value={feeForm.dueDate} onChange={e => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                                                    className="form-input" />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Remarks</label>
                                                <textarea value={feeForm.remarks} onChange={e => setFeeForm({ ...feeForm, remarks: e.target.value })} rows="2"
                                                    className="form-input" style={{ resize: 'vertical' }} />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={saving} className="btn btn-primary"
                                            style={{ marginTop: '1.2rem', width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}>
                                            {saving ? '⏳ Saving...' : '💾 Save Fee Details'}
                                        </button>
                                    </form>
                                )}

                                {/* Add Payment */}
                                {tab === 'payment' && (
                                    <form onSubmit={handleAddPayment}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Amount (₹)</label>
                                                <input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} required
                                                    className="form-input" />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Payment Mode</label>
                                                <select value={paymentForm.mode} onChange={e => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                                                    className="form-input">
                                                    {['Cash', 'Online', 'Cheque', 'DD'].map(m => <option key={m}>{m}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Note</label>
                                                <input type="text" value={paymentForm.note} onChange={e => setPaymentForm({ ...paymentForm, note: e.target.value })} placeholder="Optional note"
                                                    className="form-input" />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={saving} className="btn"
                                            style={{ marginTop: '1.2rem', width: '100%', padding: '0.8rem', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}>
                                            {saving ? '⏳ Processing...' : '💳 Add Payment'}
                                        </button>
                                    </form>
                                )}

                                {/* Payment History */}
                                {tab === 'history' && (
                                    <div>
                                        {!selectedStudent.feeRecord?.paymentHistory?.length ? (
                                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No payment history yet.</p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                {[...selectedStudent.feeRecord.paymentHistory].reverse().map((p, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'var(--bg-light)', borderRadius: '10px', border: '1px solid var(--border-color)', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                                                        <div>
                                                            <p style={{ margin: 0, fontWeight: '700', color: 'var(--primary)', transition: 'color 0.3s ease' }}>₹{p.amount}</p>
                                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', transition: 'color 0.3s ease' }}>{p.note || '—'}</p>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span style={{ background: 'rgba(29, 78, 216, 0.15)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '600', transition: 'color 0.3s ease' }}>{p.mode}</span>
                                                            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', transition: 'color 0.3s ease' }}>{new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrincipalFees;
