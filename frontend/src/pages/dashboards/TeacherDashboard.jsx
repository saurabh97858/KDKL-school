import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { BookOpen, CalendarClock, Users, GraduationCap, Search, Filter, ClipboardList, FileText, CalendarDays, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ classStudents: 0, pendingLeaves: 0 });
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedium, setSelectedMedium] = useState('');
    const [selectedStream, setSelectedStream] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStats();
        if (user?.assignedClass) {
            fetchClassStudents();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/stats', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStats(data);
        } catch (err) { console.error(err); }
    };

    const fetchClassStudents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/students/${user.assignedClass}`, {
                params: { medium: selectedMedium, stream: selectedStream },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        !searchTerm || (s.studentName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ icon: Icon, label, value, color, bg, sub }) => (
        <div className="glass-card" style={{
            display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem',
            border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)'
        }}>
            <div style={{ backgroundColor: bg, color: color, padding: '0.7rem', borderRadius: '12px' }}>
                <Icon size={22} />
            </div>
            <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>{label}</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{value}</h2>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{sub}</span>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="teacher" />
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                            Hello, {user?.name || 'Teacher'} 👋
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem', margin: 0 }}>
                            You are managing <span style={{ fontWeight: '800', color: '#8b5cf6' }}>Class {user?.assignedClass}</span> today.
                        </p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                    <StatCard icon={Users} label="Class Strength" value={stats.classStudents} color="#8b5cf6" bg="#faf5ff" sub="Enrolled Students" />
                    <StatCard icon={CalendarClock} label="Pending Leaves" value={stats.pendingLeaves} color="#ea580c" bg="#fff3eb" sub="Awaiting Review" />
                    <StatCard icon={GraduationCap} label="My Class" value={`Class ${user?.assignedClass || '—'}`} color="#0284c7" bg="#e0f2fe" sub="Assigned Class" />
                    <StatCard icon={BookOpen} label="Subject" value={user?.subject || '—'} color="#16a34a" bg="#dcfce7" sub="Teaching Subject" />
                </div>

                {/* Quick Actions */}
                <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 1rem 0', textAlign: 'left' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                        {[
                            { label: 'Daily Attendance', icon: ClipboardList, color: '#8b5cf6', bg: '#faf5ff', path: '/teacher/attendance' },
                            { label: 'Upload Results', icon: FileText, color: '#0284c7', bg: '#e0f2fe', path: '/teacher/results' },
                            { label: 'Review Leaves', icon: CalendarDays, color: '#ea580c', bg: '#fff3eb', path: '/teacher/leaves' },
                        ].map(action => (
                            <button
                                key={action.label}
                                onClick={() => window.location.href = action.path}
                                className="teacher-quick-btn"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '0.65rem 1.2rem',
                                    background: action.bg, color: action.color,
                                    border: `1.5px solid ${action.color}25`,
                                    borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <action.icon size={15} />
                                {action.label}
                                <ChevronRight size={14} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Student List */}
                <div className="glass-card" style={{ border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1.5px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '7px', borderRadius: '10px' }}>
                                <GraduationCap size={18} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                Class {user?.assignedClass} Students
                            </h3>
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ padding: '0.45rem 1rem 0.45rem 2rem', border: '1.5px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: '500', width: '170px' }}
                                />
                            </div>
                            <select
                                value={selectedMedium}
                                onChange={e => setSelectedMedium(e.target.value)}
                                style={{ padding: '0.45rem 0.8rem', border: '1.5px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                <option value="">All Mediums</option>
                                <option value="Hindi">Hindi</option>
                                <option value="English">English</option>
                            </select>
                            <select
                                value={selectedStream}
                                onChange={e => setSelectedStream(e.target.value)}
                                style={{ padding: '0.45rem 0.8rem', border: '1.5px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                <option value="">All Streams</option>
                                <option value="Science">Science</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Arts">Arts</option>
                                <option value="None">None</option>
                            </select>
                            <button
                                onClick={fetchClassStudents}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.45rem 0.9rem', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                <Filter size={13} />
                                Filter
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                    {['#', 'Student Name', 'Medium', 'Stream', 'Contact', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Loading students...</td></tr>
                                ) : filteredStudents.length > 0 ? (
                                    filteredStudents.map((s, idx) => (
                                        <motion.tr
                                            key={s._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="teacher-tr-hover"
                                            style={{ borderBottom: '1px solid var(--border-color)' }}
                                        >
                                            <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{String(idx + 1).padStart(2, '0')}</td>
                                            <td style={{ padding: '0.9rem 1rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>{s.studentName}</td>
                                            <td style={{ padding: '0.9rem 1rem' }}>
                                                <span style={{ background: s.medium === 'Hindi' ? '#fff3eb' : '#e0f2fe', color: s.medium === 'Hindi' ? '#ea580c' : '#0284c7', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                                                    {s.medium || '—'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)' }}>{s.stream || '—'}</td>
                                            <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{s.mobileNumber || '—'}</td>
                                            <td style={{ padding: '0.9rem 1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => window.location.href = '/teacher/attendance'} style={{ padding: '0.35rem 0.7rem', background: '#faf5ff', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Attendance</button>
                                                    <button onClick={() => window.location.href = '/teacher/results'} style={{ padding: '0.35rem 0.7rem', background: '#e0f2fe', color: '#0284c7', border: '1px solid rgba(2,132,199,0.2)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Results</button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontWeight: '600' }}>No students found in this class.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length > 0 && (
                        <div style={{ padding: '0.8rem 1.5rem', borderTop: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                Showing {filteredStudents.length} of {students.length} students
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .teacher-tr-hover:hover { background-color: var(--bg-light) !important; }
                .teacher-quick-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
            `}</style>
        </div>
    );
};

export default TeacherDashboard;
