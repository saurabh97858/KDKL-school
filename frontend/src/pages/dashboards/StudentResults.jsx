import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { FileText, Download, GraduationCap, CalendarDays, User, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/results', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setResults(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const examTypeColors = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('half') || t.includes('mid')) return { color: '#0284c7', bg: '#e0f2fe', border: '#0284c7' };
        if (t.includes('annual') || t.includes('final')) return { color: '#8b5cf6', bg: '#faf5ff', border: '#8b5cf6' };
        if (t.includes('unit')) return { color: '#ea580c', bg: '#fff3eb', border: '#ea580c' };
        return { color: '#16a34a', bg: '#dcfce7', border: '#16a34a' };
    };

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="student" />
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Examination Results</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>
                        View and download your academic performance reports
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                        <div style={{ border: '4px solid var(--border-color)', borderTop: '4px solid #8b5cf6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : results.length === 0 ? (
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
                            <SearchX size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>No Results Yet</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0, maxWidth: '380px' }}>
                            Your examination results will appear here once uploaded by your teacher.
                        </p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {results.map((r, idx) => {
                            const style = examTypeColors(r.examType);
                            return (
                                <motion.div
                                    key={r._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card result-card"
                                    style={{
                                        padding: '1.5rem',
                                        border: '1.5px solid var(--border-color)',
                                        backgroundColor: 'var(--card-bg)',
                                        borderRadius: '20px',
                                        borderTop: `4px solid ${style.border}`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: style.bg, borderRadius: '0 20px 0 100%', opacity: 0.5 }} />

                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1rem', textAlign: 'left' }}>
                                        <div style={{ background: style.bg, color: style.color, padding: '10px', borderRadius: '12px', flexShrink: 0 }}>
                                            <GraduationCap size={22} />
                                        </div>
                                        <div>
                                            <span style={{ background: style.bg, color: style.color, padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.3px' }}>
                                                {r.examType?.toUpperCase() || 'EXAM'}
                                            </span>
                                            <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                                {r.examType || 'Examination'} Report
                                            </h3>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem', textAlign: 'left' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                            <CalendarDays size={13} />
                                            <span>{r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                            <User size={13} />
                                            <span>Uploaded by: {r.teacher?.name || 'Teacher'}</span>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${r.pdfUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                width: '100%', padding: '0.65rem',
                                                background: `linear-gradient(to right, ${style.border}, ${style.border}dd)`,
                                                color: 'white', borderRadius: '10px', textDecoration: 'none',
                                                fontWeight: '700', fontSize: '0.85rem',
                                                boxShadow: `0 4px 12px ${style.border}30`,
                                                transition: 'all 0.2s ease'
                                            }}
                                            className="result-download-btn"
                                        >
                                            <Download size={15} />
                                            View / Download PDF
                                        </a>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .result-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
                body.dark .result-card:hover { box-shadow: 0 12px 30px rgba(0,0,0,0.25); }
                .result-download-btn:hover { opacity: 0.9; transform: translateY(-1px); }
            `}</style>
        </div>
    );
};

export default StudentResults;
