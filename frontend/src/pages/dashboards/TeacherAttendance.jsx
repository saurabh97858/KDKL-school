import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { ClipboardList, CheckCircle, XCircle, Clock, CalendarDays, Trash2, History, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherAttendance = () => {
    const [students, setStudents] = useState([]);
    const [history, setHistory] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [className, setClassName] = useState('1');
    const [viewMode, setViewMode] = useState('mark');
    const [marking, setMarking] = useState({});

    useEffect(() => {
        if (viewMode === 'mark') fetchStudents();
        else fetchHistory();
    }, [className, date, viewMode]);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/students/${className}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(data);
        } catch (err) { console.error(err); }
    };

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/attendance-history?className=${className}&date=${date}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setHistory(data);
        } catch (err) { console.error(err); }
    };

    const handleAttendance = async (studentId, studentName, status) => {
        setMarking(prev => ({ ...prev, [studentId]: status }));
        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/attendance',
                { studentId, date, status, className },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setTimeout(() => setMarking(prev => ({ ...prev, [studentId]: null })), 2000);
        } catch (err) {
            alert('Error marking attendance');
            setMarking(prev => ({ ...prev, [studentId]: null }));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/attendance/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchHistory();
        } catch (err) { alert('Delete failed'); }
    };

    const presentCount = history.filter(h => h.status === 'Present').length;
    const absentCount = history.filter(h => h.status === 'Absent').length;
    const leaveCount = history.filter(h => h.status === 'Leave').length;

    const getStatusStyle = (status) => {
        if (status === 'Present') return { bg: '#dcfce7', color: '#15803d', icon: CheckCircle };
        if (status === 'Absent') return { bg: '#fee2e2', color: '#b91c1c', icon: XCircle };
        return { bg: '#fef9c3', color: '#a16207', icon: Clock };
    };

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="teacher" />
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Attendance Management</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>Mark or review daily student attendance</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', padding: '0.35rem', borderRadius: '12px' }}>
                        <button
                            onClick={() => setViewMode('mark')}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: viewMode === 'mark' ? 'linear-gradient(to right, #8b5cf6, #ec4899)' : 'transparent', color: viewMode === 'mark' ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                            <ClipboardList size={14} /> Mark Attendance
                        </button>
                        <button
                            onClick={() => setViewMode('history')}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: viewMode === 'history' ? 'linear-gradient(to right, #8b5cf6, #ec4899)' : 'transparent', color: viewMode === 'history' ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                            <History size={14} /> View History
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-card" style={{ padding: '1rem 1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarDays size={15} color="var(--text-secondary)" />
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            style={{ padding: '0.5rem 0.8rem', border: '1.5px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Class:</span>
                        <input
                            type="text"
                            placeholder="e.g. 10"
                            value={className}
                            onChange={e => setClassName(e.target.value)}
                            style={{ width: '80px', padding: '0.5rem 0.8rem', border: '1.5px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600' }}
                        />
                    </div>
                    <button
                        onClick={() => viewMode === 'mark' ? fetchStudents() : fetchHistory()}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', background: 'var(--bg-light)', border: '1.5px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                        <RotateCcw size={13} /> Refresh
                    </button>
                </div>

                {/* History Stats (only in history mode) */}
                {viewMode === 'history' && history.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        {[
                            { label: 'Present', value: presentCount, icon: CheckCircle, color: '#15803d', bg: '#dcfce7' },
                            { label: 'Absent', value: absentCount, icon: XCircle, color: '#b91c1c', bg: '#fee2e2' },
                            { label: 'On Leave', value: leaveCount, icon: Clock, color: '#a16207', bg: '#fef9c3' },
                            { label: 'Total', value: history.length, icon: ClipboardList, color: '#8b5cf6', bg: '#faf5ff' },
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
                )}

                {/* Mark Attendance View */}
                {viewMode === 'mark' ? (
                    <div className="glass-card" style={{ border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                            <div style={{ background: '#faf5ff', color: '#8b5cf6', padding: '7px', borderRadius: '10px' }}>
                                <ClipboardList size={16} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                Class {className} — {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                            </h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                        <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>#</th>
                                        <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Student Name</th>
                                        <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Last Status</th>
                                        <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Mark Attendance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontWeight: '600' }}>No students found in Class {className}.</td></tr>
                                    ) : (
                                        students.map((s, idx) => {
                                            const currentMark = marking[s._id];
                                            return (
                                                <tr key={s._id} className="att-tr-hover" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}>
                                                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{String(idx + 1).padStart(2, '0')}</td>
                                                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>{s.studentName}</td>
                                                    <td style={{ padding: '0.9rem 1rem' }}>
                                                        {currentMark ? (
                                                            <span style={{ background: getStatusStyle(currentMark).bg, color: getStatusStyle(currentMark).color, padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                                                                ✓ {currentMark}
                                                            </span>
                                                        ) : (
                                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '500' }}>—</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                            <button onClick={() => handleAttendance(s._id, s.studentName, 'Present')} style={{ background: '#dcfce7', color: '#15803d', border: '1px solid rgba(21,128,61,0.2)', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.15s' }} className="att-present-btn">Present</button>
                                                            <button onClick={() => handleAttendance(s._id, s.studentName, 'Absent')} style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.2)', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.15s' }} className="att-absent-btn">Absent</button>
                                                            <button onClick={() => handleAttendance(s._id, s.studentName, 'Leave')} style={{ background: '#fef9c3', color: '#a16207', border: '1px solid rgba(161,98,7,0.2)', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.15s' }} className="att-leave-btn">Leave</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* History View */
                    <div className="glass-card" style={{ border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '7px', borderRadius: '10px' }}>
                                <History size={16} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                Attendance Record — {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '450px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                        <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>#</th>
                                        <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Student Name</th>
                                        <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontWeight: '600' }}>No attendance records for this date.</td></tr>
                                    ) : (
                                        history.map((h, idx) => {
                                            const st = getStatusStyle(h.status);
                                            const StatusIcon = st.icon;
                                            return (
                                                <motion.tr
                                                    key={h._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    className="att-tr-hover"
                                                    style={{ borderBottom: '1px solid var(--border-color)' }}
                                                >
                                                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{String(idx + 1).padStart(2, '0')}</td>
                                                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>{h.student?.studentName || '—'}</td>
                                                    <td style={{ padding: '0.9rem 1rem' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: st.bg, color: st.color, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                                                            <StatusIcon size={11} />
                                                            {h.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                                                        <button onClick={() => handleDelete(h._id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                            <Trash2 size={11} /> Delete
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .att-tr-hover:hover { background-color: var(--bg-light) !important; }
                .att-present-btn:hover { background: #bbf7d0 !important; }
                .att-absent-btn:hover { background: #fecaca !important; }
                .att-leave-btn:hover { background: #fde68a !important; }
            `}</style>
        </div>
    );
};

export default TeacherAttendance;
