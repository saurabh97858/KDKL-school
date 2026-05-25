import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { Users, GraduationCap, FileText, LayoutDashboard, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ teachers: 0, students: 0, applications: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/stats', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStats(data);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="dashboard-content"
            >
                <header style={{ marginBottom: '2.5rem' }}>
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#b21f1f', fontWeight: '700', marginBottom: '0.5rem' }}
                    >
                        <TrendingUp size={18} />
                        <span>ADMINISTRATIVE CONSOLE</span>
                    </motion.div>
                    <h1 className="premium-text" style={{ fontSize: '2.8rem', color: '#1a2a6c' }}>Welcome, {user?.name}</h1>
                    <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Experience the future of school management today.</p>
                </header>

                <div className="stat-grid">
                    <motion.div whileHover={{ scale: 1.05 }} className="stat-card" style={{ borderTop: '4px solid #1a2a6c' }}>
                        <div style={{ background: '#e0e7ff', padding: '1.2rem', borderRadius: '16px' }}><Users color="#4338ca" size={28} /></div>
                        <div>
                            <p style={{ color: '#64748b', fontWeight: '600' }}>Faculty Members</p>
                            <h2 style={{ fontSize: '2.2rem' }}>{stats.teachers}</h2>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
                        <div style={{ background: '#fef3c7', padding: '1.2rem', borderRadius: '16px' }}><GraduationCap color="#b45309" size={28} /></div>
                        <div>
                            <p style={{ color: '#64748b', fontWeight: '600' }}>Total Students</p>
                            <h2 style={{ fontSize: '2.2rem' }}>{stats.students}</h2>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="stat-card" style={{ borderTop: '4px solid #10b981' }}>
                        <div style={{ background: '#d1fae5', padding: '1.2rem', borderRadius: '16px' }}><FileText color="#047857" size={28} /></div>
                        <div>
                            <p style={{ color: '#64748b', fontWeight: '600' }}>Active Apps</p>
                            <h2 style={{ fontSize: '2.2rem' }}>{stats.applications}</h2>
                        </div>
                    </motion.div>
                </div>

                <div className="glass-card" style={{ padding: '2.5rem', marginTop: '2.5rem', background: 'rgba(255, 255, 255, 0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                        <LayoutDashboard size={24} color="#1a2a6c" />
                        <h3 style={{ fontSize: '1.5rem', color: '#1a2a6c' }}>Master Control Center</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" style={{ padding: '1.2rem' }} onClick={() => window.location.href='/principal/teachers'}>Manage Teachers</motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" style={{ padding: '1.2rem', background: '#b21f1f' }} onClick={() => window.location.href='/principal/add-student'}>Enroll Students</motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" style={{ padding: '1.2rem', background: '#475569' }} onClick={() => window.location.href='/principal/notifications'}>Broadcast Alerts</motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" style={{ padding: '1.2rem', background: '#1a2a6c' }} onClick={() => window.location.href='/principal/fees'}>Fee Ledger</motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrincipalDashboard;
