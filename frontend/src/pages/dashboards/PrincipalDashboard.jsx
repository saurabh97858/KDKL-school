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
                <header style={{ marginBottom: '1.5rem' }}>
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#b21f1f', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem' }}
                    >
                        <TrendingUp size={16} />
                        <span>ADMINISTRATIVE CONSOLE</span>
                    </motion.div>
                    <h1 className="premium-text" style={{ fontSize: '1.85rem', color: '#1a2a6c' }}>Welcome, {user?.name}</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Experience the future of school management today.</p>
                </header>

                <div className="stat-grid">
                    <motion.div whileHover={{ scale: 1.03 }} className="stat-card" style={{ borderTop: '3px solid #1a2a6c' }}>
                        <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '12px' }}><Users color="#4338ca" size={24} /></div>
                        <div>
                            <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Faculty Members</p>
                            <h2 style={{ fontSize: '1.6rem' }}>{stats.teachers}</h2>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} className="stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
                        <div style={{ background: '#fef3c7', padding: '0.8rem', borderRadius: '12px' }}><GraduationCap color="#b45309" size={24} /></div>
                        <div>
                            <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Total Students</p>
                            <h2 style={{ fontSize: '1.6rem' }}>{stats.students}</h2>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} className="stat-card" style={{ borderTop: '3px solid #10b981' }}>
                        <div style={{ background: '#d1fae5', padding: '0.8rem', borderRadius: '12px' }}><FileText color="#047857" size={24} /></div>
                        <div>
                            <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Active Apps</p>
                            <h2 style={{ fontSize: '1.6rem' }}>{stats.applications}</h2>
                        </div>
                    </motion.div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                        <LayoutDashboard size={20} color="#1a2a6c" />
                        <h3 style={{ fontSize: '1.2rem', color: '#1a2a6c' }}>Master Control Center</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        <motion.button whileHover={{ scale: 1.02 }} className="btn btn-primary" style={{ padding: '0.75rem' }} onClick={() => window.location.href='/principal/teachers'}>Manage Teachers</motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} className="btn btn-primary" style={{ padding: '0.75rem', background: '#b21f1f' }} onClick={() => window.location.href='/principal/add-student'}>Enroll Students</motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} className="btn btn-primary" style={{ padding: '0.75rem', background: '#475569' }} onClick={() => window.location.href='/principal/notifications'}>Broadcast Alerts</motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} className="btn btn-primary" style={{ padding: '0.75rem', background: '#1a2a6c' }} onClick={() => window.location.href='/principal/fees'}>Fee Ledger</motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrincipalDashboard;
