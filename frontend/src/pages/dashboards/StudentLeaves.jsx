import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { CalendarDays, Plus, CheckCircle, XCircle, Clock, Send, User, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ reason: '', startDate: '', endDate: '', teacherId: '' });
    const [teachers, setTeachers] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchLeaves();
        fetchTeachers();
    }, []);

    const fetchLeaves = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/my-leaves', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setLeaves(data);
        } catch (err) { console.error(err); }
    };

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/teachers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTeachers(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/request-leave', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Leave request sent successfully!');
            setShowForm(false);
            setFormData({ reason: '', startDate: '', endDate: '', teacherId: '' });
            fetchLeaves();
        } catch (err) {
            alert('Error sending request');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'Approved') return { bg: '#dcfce7', color: '#15803d', icon: CheckCircle };
        if (status === 'Rejected') return { bg: '#fee2e2', color: '#b91c1c', icon: XCircle };
        return { bg: '#fef9c3', color: '#a16207', icon: Clock };
    };

    const getDuration = (start, end) => {
        try {
            const s = new Date(start);
            const e = new Date(end);
            const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
            return `${diff} day${diff !== 1 ? 's' : ''}`;
        } catch { return '—'; }
    };

    const pendingCount = leaves.filter(l => l.status === 'Pending').length;
    const approvedCount = leaves.filter(l => l.status === 'Approved').length;
    const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="student" />
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        {showForm && (
                            <button onClick={() => setShowForm(false)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', marginBottom: '0.4rem', padding: 0 }}>
                                <ChevronLeft size={14} /> Back to list
                            </button>
                        )}
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>My Leave Requests</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>
                            {showForm ? 'Fill in the form to apply for a leave' : 'Track all your leave applications here'}
                        </p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(139,92,246,0.25)' }}
                        >
                            <Plus size={16} /> Apply for Leave
                        </button>
                    )}
                </div>

                {/* Stats Row */}
                {!showForm && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        {[
                            { label: 'Total Applied', value: leaves.length, icon: CalendarDays, color: '#8b5cf6', bg: '#faf5ff' },
                            { label: 'Pending', value: pendingCount, icon: Clock, color: '#a16207', bg: '#fef9c3' },
                            { label: 'Approved', value: approvedCount, icon: CheckCircle, color: '#15803d', bg: '#dcfce7' },
                            { label: 'Rejected', value: rejectedCount, icon: XCircle, color: '#b91c1c', bg: '#fee2e2' },
                        ].map(card => (
                            <div key={card.label} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.1rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
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
                )}

                <AnimatePresence mode="wait">
                    {showForm ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card"
                            style={{ padding: '2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', maxWidth: '640px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', textAlign: 'left' }}>
                                <div style={{ background: '#faf5ff', color: '#8b5cf6', padding: '8px', borderRadius: '10px' }}>
                                    <CalendarDays size={18} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Leave Application Form</h3>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Notify Teacher</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <select
                                            onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                                            required
                                            value={formData.teacherId}
                                            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.2rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            <option value="">Select Teacher to Notify</option>
                                            {teachers.map(t => (
                                                <option key={t._id} value={t.user?._id}>{t.teacherName} ({t.subject})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Start Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                            style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>End Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                            style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Reason for Leave</label>
                                    <textarea
                                        placeholder="Describe the reason for your leave application..."
                                        required
                                        rows="4"
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                        style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: '500', resize: 'vertical', lineHeight: '1.5' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem', fontWeight: '700', fontSize: '0.88rem', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 15px rgba(139,92,246,0.25)' }}
                                    >
                                        <Send size={15} />
                                        {submitting ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        style={{ flex: 1, padding: '0.7rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-card"
                            style={{ border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden' }}
                        >
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                            {['Period', 'Duration', 'Reason', 'Status', 'Teacher Comment'].map(h => (
                                                <th key={h} style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                                    No leave applications found. Click "Apply for Leave" to submit one.
                                                </td>
                                            </tr>
                                        ) : (
                                            leaves.map((l, i) => {
                                                const statusStyle = getStatusStyle(l.status);
                                                const StatusIcon = statusStyle.icon;
                                                return (
                                                    <tr key={l._id} className="leave-tr-hover" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                        <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                                            {new Date(l.startDate).toLocaleDateString('en-IN')} – {new Date(l.endDate).toLocaleDateString('en-IN')}
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                                                                {getDuration(l.startDate, l.endDate)}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-primary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: statusStyle.bg, color: statusStyle.color, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                                                                <StatusIcon size={11} />
                                                                {l.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: l.teacherComment ? 'normal' : 'italic' }}>
                                                            {l.teacherComment || '—'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <style>{`
                .leave-tr-hover:hover { background-color: var(--bg-light) !important; }
            `}</style>
        </div>
    );
};

export default StudentLeaves;
