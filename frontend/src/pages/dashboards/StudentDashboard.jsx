import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { User, GraduationCap, MapPin, Phone, Mail, Camera, FileText, CalendarDays, Hash, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProfile(data);
        } catch (err) { console.error(err); }
    };

    const handlePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('profilePic', file);
        setUploading(true);
        try {
            await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/update-profile-pic', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            window.location.reload();
        } catch (err) { 
            alert('Upload failed');
            setUploading(false);
        }
    };

    const getProfilePicUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    const picUrl = getProfilePicUrl(user?.profilePic);

    const InfoRow = ({ icon: Icon, label, value, accent }) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '0.8rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ background: accent + '15', color: accent, padding: '6px', borderRadius: '8px', marginTop: '1px', flexShrink: 0 }}>
                <Icon size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', wordBreak: 'break-word' }}>{value || '—'}</p>
            </div>
        </div>
    );

    const QuickAction = ({ label, icon: Icon, color, bg, path }) => (
        <button 
            onClick={() => window.location.href = path}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '1rem 1.2rem',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                textAlign: 'left'
            }}
            className="student-action-btn"
        >
            <div style={{ background: bg, color: color, padding: '8px', borderRadius: '10px', flexShrink: 0 }}>
                <Icon size={18} />
            </div>
            <span style={{ flex: 1, fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)' }}>{label}</span>
            <ArrowRight size={14} color="var(--text-secondary)" />
        </button>
    );

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="student" />
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>My Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem', margin: 0 }}>
                        Welcome back! Here's your academic overview.
                    </p>
                </div>

                {/* Profile Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #4c1d95 100%)',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background decoration */}
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-50px', right: '100px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: picUrl ? 'transparent' : 'rgba(255,255,255,0.15)',
                            border: '3px solid rgba(255,255,255,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {picUrl ? (
                                <img src={picUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={44} color="rgba(255,255,255,0.7)" />
                            )}
                        </div>
                        <label htmlFor="pic-upload" style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            background: 'white',
                            color: '#8b5cf6',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            border: '2px solid rgba(255,255,255,0.6)'
                        }}>
                            <Camera size={12} />
                            <input type="file" id="pic-upload" hidden onChange={handlePicUpload} accept="image/*" />
                        </label>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, textAlign: 'left', minWidth: '180px' }}>
                        <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.4rem 0' }}>
                            {user?.name || '—'}
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            <span style={{ background: 'rgba(255,255,255,0.18)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                                Class {profile?.className || '—'}
                            </span>
                            <span style={{ background: 'rgba(255,255,255,0.18)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                                ID: {user?.username || '—'}
                            </span>
                            {profile?.rollNumber && (
                                <span style={{ background: 'rgba(255,255,255,0.18)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                                    Roll No: {profile.rollNumber}
                                </span>
                            )}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: '500', margin: '0.8rem 0 0' }}>
                            {uploading ? '⏳ Uploading photo...' : 'Click the camera icon above to update your photo'}
                        </p>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    
                    {/* Student Profile Card */}
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.2rem', textAlign: 'left' }}>
                            <div style={{ background: '#faf5ff', color: '#8b5cf6', padding: '7px', borderRadius: '10px' }}>
                                <User size={16} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Student Profile</h3>
                        </div>
                        <InfoRow icon={User} label="Father's Name" value={profile?.fatherName} accent="#8b5cf6" />
                        <InfoRow icon={User} label="Mother's Name" value={profile?.motherName} accent="#ec4899" />
                        <InfoRow icon={Phone} label="Parent Contact" value={profile?.contactNumber} accent="#06b6d4" />
                        <InfoRow icon={Mail} label="Email Address" value={profile?.emailId} accent="#f59e0b" />
                        <InfoRow icon={CalendarDays} label="Admission Date" value={profile?.admissionDate ? new Date(profile.admissionDate).toLocaleDateString('en-IN') : null} accent="#10b981" />
                    </div>

                    {/* Academic Status + Quick Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.2rem', textAlign: 'left' }}>
                                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '7px', borderRadius: '10px' }}>
                                    <GraduationCap size={16} />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Academic Info</h3>
                            </div>
                            <InfoRow icon={BookOpen} label="Medium" value={profile?.medium} accent="#8b5cf6" />
                            <InfoRow icon={Hash} label="Roll Number" value={profile?.rollNumber || 'Updating...'} accent="#ea580c" />
                            <InfoRow icon={MapPin} label="Current Address" value={profile?.currentAddress} accent="#ef4444" />
                            <InfoRow icon={MapPin} label="Permanent Address" value={profile?.permanentAddress} accent="#64748b" />
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '20px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 1rem 0', textAlign: 'left' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <QuickAction label="View My Results" icon={FileText} color="#8b5cf6" bg="#faf5ff" path="/student/results" />
                                <QuickAction label="My Fee Details" icon={FileText} color="#16a34a" bg="#dcfce7" path="/student/fees" />
                                <QuickAction label="Apply for Leave" icon={CalendarDays} color="#ea580c" bg="#fff3eb" path="/student/leaves" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .student-action-btn:hover {
                    border-color: #8b5cf6 !important;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.1);
                    transform: translateX(4px);
                }
            `}</style>
        </div>
    );
};

export default StudentDashboard;
