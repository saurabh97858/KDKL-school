import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { CalendarDays, CheckCircle, XCircle, Clock, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionModal, setActionModal] = useState(null); // { leaveId, status }
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/leave-requests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setLeaves(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAction = async () => {
        if (!actionModal) return;
        setProcessing(true);
        try {
            await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/manage-leave',
                { leaveId: actionModal.leaveId, status: actionModal.status, teacherComment: comment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setActionModal(null);
            setComment('');
            fetchLeaves();
        } catch (err) { alert('Action failed'); }
        finally { setProcessing(false); }
    };

    const getStatusStyle = (status) => {
        if (status === 'Approved') return { bg: '#dcfce7', color: '#15803d', icon: CheckCircle };
        if (status === 'Rejected') return { bg: '#fee2e2', color: '#b91c1c', icon: XCircle };
        return { bg: '#fef9c3', color: '#a16207', icon: Clock };
    };

    const pending = leaves.filter(l => l.status === 'Pending').length;
    const approved = leaves.filter(l => l.status === 'Approved').length;
    const rejected = leaves.filter(l => l.status === 'Rejected').length;

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="teacher" />
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Leave Requests</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>
                        Review and manage student leave applications
                    </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {[
                        { label: 'Pending', value: pending, icon: Clock, color: '#a16207', bg: '#fef9c3' },
                        { label: 'Approved', value: approved, icon: CheckCircle, color: '#15803d', bg: '#dcfce7' },
                        { label: 'Rejected', value: rejected, icon: XCircle, color: '#b91c1c', bg: '#fee2e2' },
                        { label: 'Total', value: leaves.length, icon: CalendarDays, color: '#8b5cf6', bg: '#faf5ff' },
                    ].map(card => (
                        <div key={card.label} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                            <div style={{ background: card.bg, color: card.color, padding: '8px', borderRadius: '10px' }}>
                                <card.icon size={18} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>{card.label}</span>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0 0' }}>{card.value}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="glass-card" style={{ border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                    {['#', 'Student', 'Class', 'Period', 'Reason', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Loading leave requests...</td></tr>
                                ) : leaves.length === 0 ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontWeight: '600' }}>No leave requests found.</td></tr>
                                ) : (
                                    leaves.map((l, idx) => {
                                        const st = getStatusStyle(l.status);
                                        const StatusIcon = st.icon;
                                        return (
                                            <motion.tr
                                                key={l._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="leave-tr-hover"
                                                style={{ borderBottom: '1px solid var(--border-color)' }}
                                            >
                                                <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{String(idx + 1).padStart(2, '0')}</td>
                                                <td style={{ padding: '0.9rem 1rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ background: '#faf5ff', color: '#8b5cf6', padding: '5px', borderRadius: '8px' }}><User size={13} /></div>
                                                        {l.student?.studentName || '—'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.9rem 1rem' }}>
                                                    <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                                                        Class {l.student?.className || '—'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                                    {new Date(l.startDate).toLocaleDateString('en-IN')} – {new Date(l.endDate).toLocaleDateString('en-IN')}
                                                </td>
                                                <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: 'var(--text-primary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
                                                <td style={{ padding: '0.9rem 1rem' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: st.bg, color: st.color, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                                                        <StatusIcon size={11} />{l.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.9rem 1rem' }}>
                                                    {l.status === 'Pending' ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={() => setActionModal({ leaveId: l._id, status: 'Approved' })}
                                                                style={{ background: '#dcfce7', color: '#15803d', border: '1px solid rgba(21,128,61,0.2)', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                                            >Approve</button>
                                                            <button
                                                                onClick={() => setActionModal({ leaveId: l._id, status: 'Rejected' })}
                                                                style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.2)', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                                            >Reject</button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontWeight: '500' }}>{l.teacherComment || 'Decision made'}</span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Action Modal */}
            {actionModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '100%', border: '1.5px solid var(--border-color)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem', textAlign: 'left' }}>
                            <div style={{ background: actionModal.status === 'Approved' ? '#dcfce7' : '#fee2e2', color: actionModal.status === 'Approved' ? '#15803d' : '#b91c1c', padding: '8px', borderRadius: '10px' }}>
                                {actionModal.status === 'Approved' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                {actionModal.status === 'Approved' ? 'Approve Leave' : 'Reject Leave'}
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', marginBottom: '1.2rem' }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MessageSquare size={12} /> Comment (optional)
                            </label>
                            <textarea
                                placeholder="Add a comment for the student..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows="3"
                                style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.88rem', resize: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <button
                                onClick={handleAction}
                                disabled={processing}
                                style={{ flex: 1, padding: '0.65rem', background: actionModal.status === 'Approved' ? 'linear-gradient(to right, #16a34a, #15803d)' : 'linear-gradient(to right, #dc2626, #b91c1c)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', opacity: processing ? 0.7 : 1 }}
                            >
                                {processing ? 'Processing...' : `Confirm ${actionModal.status}`}
                            </button>
                            <button
                                onClick={() => { setActionModal(null); setComment(''); }}
                                style={{ flex: 1, padding: '0.65rem', background: 'transparent', border: '1.5px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <style>{`
                .leave-tr-hover:hover { background-color: var(--bg-light) !important; }
            `}</style>
        </div>
    );
};

export default TeacherLeaves;
