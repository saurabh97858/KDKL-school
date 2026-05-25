import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { BookOpen, CalendarClock, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ classStudents: 0, pendingLeaves: 0 });
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedium, setSelectedMedium] = useState('');
    const [selectedStream, setSelectedStream] = useState('');

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

    return (
        <div className="dashboard-container">
            <Sidebar role="teacher" />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="dashboard-content"
            >
                <header style={{ marginBottom: '2.5rem' }}>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="premium-text"
                        style={{ fontSize: '2.5rem', color: '#1a2a6c' }}
                    >
                        Hello, {user?.name} 👋
                    </motion.h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        Welcome to your portal. You are managing <span style={{ fontWeight: '800', color: '#b21f1f' }}>Class {user?.assignedClass}</span> today.
                    </p>
                </header>

                <div className="stat-grid">
                    <motion.div whileHover={{ scale: 1.02 }} className="stat-card" style={{ borderLeft: '5px solid #10b981' }}>
                        <div style={{ background: '#d1fae5', padding: '1.2rem', borderRadius: '16px' }}><Users color="#059669" size={28} /></div>
                        <div>
                            <p style={{ color: '#64748b', fontWeight: '600' }}>Students Joined</p>
                            <h2 style={{ fontSize: '2rem' }}>{stats.classStudents}</h2>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="stat-card" style={{ borderLeft: '5px solid #ef4444' }}>
                        <div style={{ background: '#fee2e2', padding: '1.2rem', borderRadius: '16px' }}><CalendarClock color="#dc2626" size={28} /></div>
                        <div>
                            <p style={{ color: '#64748b', fontWeight: '600' }}>Pending Requests</p>
                            <h2 style={{ fontSize: '2rem' }}>{stats.pendingLeaves}</h2>
                        </div>
                    </motion.div>
                </div>

                <div className="glass-card" style={{ padding: '2.5rem', marginTop: '2.5rem', background: 'rgba(255, 255, 255, 0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <GraduationCap size={32} color="#1a2a6c" />
                            <h3 style={{ fontSize: '1.5rem', color: '#1a2a6c' }}>Class {user?.assignedClass} Student List</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <select 
                                value={selectedMedium} 
                                onChange={(e) => { setSelectedMedium(e.target.value); }}
                                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">All Mediums</option>
                                <option value="Hindi">Hindi</option>
                                <option value="English">English</option>
                            </select>
                            <select 
                                value={selectedStream} 
                                onChange={(e) => { setSelectedStream(e.target.value); }}
                                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">All Streams</option>
                                <option value="Science">Science</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Arts">Arts</option>
                                <option value="None">None</option>
                            </select>
                            <button className="btn btn-primary" onClick={fetchClassStudents} style={{ padding: '0.5rem 1rem' }}>Filter</button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr style={{ background: 'rgba(26, 42, 108, 0.05)' }}>
                                    <th>Roll No.</th>
                                    <th>Student Name</th>
                                    <th>Medium</th>
                                    <th>Stream</th>
                                    <th>Contact</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</td></tr>
                                ) : students.length > 0 ? (
                                    students.map((s, idx) => (
                                        <motion.tr 
                                            key={s._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <td style={{ fontWeight: '700', color: '#64748b' }}>{idx + 1}</td>
                                            <td style={{ fontWeight: '600' }}>{s.studentName}</td>
                                            <td>{s.medium}</td>
                                            <td>{s.stream}</td>
                                            <td>{s.mobileNumber}</td>
                                            <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => window.location.href='/teacher/attendance'}>Presence</button>
                                                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#475569' }} onClick={() => window.location.href='/teacher/results'}>Report</button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No students found in this class.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', marginTop: '2.5rem', background: 'rgba(255, 255, 255, 0.8)' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#1a2a6c' }}>Main Console</h3>
                    <div style={{ display: 'flex', wrap: 'wrap', gap: '1rem' }}>
                        <motion.button whileHover={{ scale: 1.05 }} className="btn btn-primary" onClick={() => window.location.href='/teacher/attendance'}>Daily Attendance</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} className="btn btn-primary" onClick={() => window.location.href='/teacher/results'}>Upload Results</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} className="btn btn-primary" onClick={() => window.location.href='/teacher/leaves'}>Review Leaves</motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TeacherDashboard;
