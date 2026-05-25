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

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a2a6c' }}>Class:</label>
                        <select 
                            value={selectedClass} 
                            onChange={(e) => { setSelectedClass(e.target.value); fetchStudents(e.target.value, selectedMedium, selectedStream); }}
                            style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', minWidth: '120px' }}
                        >
                            <option value="">Select Class</option>
                            {CLASS_LIST.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a2a6c' }}>Medium:</label>
                        <select 
                            value={selectedMedium} 
                            onChange={(e) => { setSelectedMedium(e.target.value); fetchStudents(selectedClass, e.target.value, selectedStream); }}
                            style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', minWidth: '150px' }}
                        >
                            <option value="">All Mediums</option>
                            <option value="Hindi">Hindi</option>
                            <option value="English">English</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a2a6c' }}>Stream:</label>
                        <select 
                            value={selectedStream} 
                            onChange={(e) => { setSelectedStream(e.target.value); fetchStudents(selectedClass, selectedMedium, e.target.value); }}
                            style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', minWidth: '150px' }}
                        >
                            <option value="">All Streams</option>
                            <option value="Science">Science</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Arts">Arts</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button onClick={() => fetchStudents()} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Refresh</button>
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
                    <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '320px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
                        
                        {/* Student List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <h3 style={{ color: '#1a2a6c', marginBottom: '0.5rem' }}>Class {selectedClass} — {students.length} Students</h3>
                            {students.map(s => {
                                const statusColor = getStatusColor(s.feeRecord);
                                const pend = s.feeRecord ? (s.feeRecord.totalFees + s.feeRecord.fine + s.feeRecord.otherCharges) - s.feeRecord.depositedFees : null;
                                return (
                                    <div key={s._id} onClick={() => selectStudent(s)}
                                        style={{
                                            padding: '1rem 1.2rem', borderRadius: '12px', cursor: 'pointer',
                                            background: selectedStudent?._id === s._id ? '#eff6ff' : 'white',
                                            border: `2px solid ${selectedStudent?._id === s._id ? '#1a2a6c' : '#e2e8f0'}`,
                                            transition: 'all 0.2s ease',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                        <div>
                                            <p style={{ fontWeight: '700', color: '#1a2a6c', margin: 0 }}>{s.studentName}</p>
                                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Father: {s.fatherName}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusColor, marginLeft: 'auto', marginBottom: '4px' }} />
                                            {pend !== null && (
                                                <p style={{ color: pend > 0 ? '#ef4444' : '#22c55e', fontWeight: '700', fontSize: '0.85rem', margin: 0 }}>
                                                    {pend > 0 ? `₹${pend} due` : 'Paid'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Fee Detail Panel */}
                        {selectedStudent && (
                            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h2 style={{ color: '#1a2a6c', margin: 0 }}>{selectedStudent.studentName}</h2>
                                        <p style={{ color: '#64748b', margin: '0.3rem 0 0 0' }}>Class {selectedStudent.className} • Father: {selectedStudent.fatherName}</p>
                                    </div>
                                    {/* Live pending preview */}
                                    <div style={{ textAlign: 'right', background: pending() > 0 ? '#fef2f2' : '#f0fdf4', padding: '0.8rem 1.2rem', borderRadius: '12px' }}>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Pending Amount</p>
                                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: pending() > 0 ? '#ef4444' : '#22c55e' }}>
                                            ₹{pending().toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {msg && <div style={{ padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', background: msg.includes('✅') ? '#f0fdf4' : '#fef2f2', color: msg.includes('✅') ? '#16a34a' : '#dc2626', fontWeight: '600' }}>{msg}</div>}

                                {/* Tabs */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                    {['details', 'payment', 'history'].map(t => (
                                        <button key={t} onClick={() => setTab(t)} style={{
                                            padding: '0.5rem 1.2rem', border: 'none', borderRadius: '8px 8px 0 0',
                                            background: tab === t ? '#1a2a6c' : 'transparent',
                                            color: tab === t ? 'white' : '#64748b',
                                            fontWeight: '700', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s'
                                        }}>{t === 'details' ? '📋 Fee Details' : t === 'payment' ? '💳 Add Payment' : '📜 History'}</button>
                                    ))}
                                </div>

                                {/* Fee Details Form */}
                                {tab === 'details' && (
                                    <form onSubmit={handleSaveFee}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                                            {[
                                                { label: '💰 Total Fees (₹)', key: 'totalFees', type: 'number' },
                                                { label: '✅ Deposited Fees (₹)', key: 'depositedFees', type: 'number' },
                                                { label: '⚠️ Fine Amount (₹)', key: 'fine', type: 'number' },
                                                { label: '📝 Fine Description', key: 'fineDescription', type: 'text' },
                                                { label: '📦 Other Charges (₹)', key: 'otherCharges', type: 'number' },
                                                { label: '📝 Other Charges Description', key: 'otherChargesDescription', type: 'text' },
                                            ].map(f => (
                                                <div key={f.key}>
                                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>{f.label}</label>
                                                    <input type={f.type} value={feeForm[f.key]} onChange={e => setFeeForm({ ...feeForm, [f.key]: e.target.value })}
                                                        style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }} />
                                                </div>
                                            ))}
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>📅 Due Date</label>
                                                <input type="date" value={feeForm.dueDate} onChange={e => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                                                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }} />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>📌 Remarks</label>
                                                <textarea value={feeForm.remarks} onChange={e => setFeeForm({ ...feeForm, remarks: e.target.value })} rows="2"
                                                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical' }} />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={saving}
                                            style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #1a2a6c, #2563eb)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                                            {saving ? '⏳ Saving...' : '💾 Save Fee Details'}
                                        </button>
                                    </form>
                                )}

                                {/* Add Payment */}
                                {tab === 'payment' && (
                                    <form onSubmit={handleAddPayment}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>Amount (₹)</label>
                                                <input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} required
                                                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>Payment Mode</label>
                                                <select value={paymentForm.mode} onChange={e => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                                                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}>
                                                    {['Cash', 'Online', 'Cheque', 'DD'].map(m => <option key={m}>{m}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>Note</label>
                                                <input type="text" value={paymentForm.note} onChange={e => setPaymentForm({ ...paymentForm, note: e.target.value })} placeholder="Optional note"
                                                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }} />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={saving}
                                            style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                                            {saving ? '⏳ Processing...' : '💳 Add Payment'}
                                        </button>
                                    </form>
                                )}

                                {/* Payment History */}
                                {tab === 'history' && (
                                    <div>
                                        {!selectedStudent.feeRecord?.paymentHistory?.length ? (
                                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No payment history yet.</p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                {[...selectedStudent.feeRecord.paymentHistory].reverse().map((p, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.2rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                        <div>
                                                            <p style={{ margin: 0, fontWeight: '700', color: '#1a2a6c' }}>₹{p.amount}</p>
                                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{p.note || '—'}</p>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>{p.mode}</span>
                                                            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>{new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
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
