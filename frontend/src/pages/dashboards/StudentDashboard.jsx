import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { User, FileText, Upload, GraduationCap, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

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
        try {
            await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/update-profile-pic', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            });
            alert('Profile picture updated successfully!');
            window.location.reload();
        } catch (err) { alert('Upload failed'); }
    };

    const getProfilePicUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/150';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="student" />
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="dashboard-content"
            >
                <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <motion.div 
                        whileHover={{ scale: 1.03 }}
                        style={{ position: 'relative' }}
                    >
                        <img 
                            src={getProfilePicUrl(user?.profilePic)} 
                            alt="Profile" 
                            style={{ 
                                width: '110px', 
                                height: '110px', 
                                borderRadius: '50%', 
                                objectFit: 'cover', 
                                border: '4px solid white', 
                                boxShadow: '0 8px 20px rgba(0,0,0,0.1)' 
                            }} 
                        />
                        <label htmlFor="pic-upload" style={{ position: 'absolute', bottom: '4px', right: '4px', background: '#1a2a6c', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Upload size={14} />
                            <input type="file" id="pic-upload" hidden onChange={handlePicUpload} accept="image/*" />
                        </label>
                    </motion.div>
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="premium-text"
                            style={{ fontSize: '1.85rem', color: '#1a2a6c', marginBottom: '0.3rem' }}
                        >
                            Namaste, {user?.name} 🙏
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{ color: '#64748b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                        >
                            <span style={{ background: '#b21f1f', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800' }}>CLASS {profile?.className}</span>
                            <span style={{ fontWeight: '600' }}>ID: {user?.username}</span>
                        </motion.p>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <motion.div 
                        whileHover={{ y: -3 }}
                        className="glass-card" 
                        style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.8)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', borderBottom: '2px solid rgba(26, 42, 108, 0.1)', paddingBottom: '0.6rem' }}>
                            <User size={20} color="#1a2a6c" />
                            <h3 style={{ fontSize: '1.2rem', color: '#1a2a6c' }}>Student Profile</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                            <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Father's Name:</strong> <span style={{ color: '#475569' }}>{profile?.fatherName}</span></p>
                            <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Mother's Name:</strong> <span style={{ color: '#475569' }}>{profile?.motherName}</span></p>
                            <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>Parent Contact:</strong> 
                                <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={12} /> {profile?.contactNumber}</span>
                            </p>
                            <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>Registered Email:</strong> 
                                <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={12} /> {profile?.emailId}</span>
                            </p>
                            <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Admission Date:</strong> <span style={{ color: '#475569' }}>{profile?.admissionDate ? new Date(profile.admissionDate).toLocaleDateString() : 'N/A'}</span></p>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        whileHover={{ y: -3 }}
                        className="glass-card" 
                        style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.8)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', borderBottom: '2px solid rgba(26, 42, 108, 0.1)', paddingBottom: '0.6rem' }}>
                            <GraduationCap size={20} color="#1a2a6c" />
                            <h3 style={{ fontSize: '1.2rem', color: '#1a2a6c' }}>Academic Status</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                            <p style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                                <MapPin size={16} color="#b21f1f" style={{ marginTop: '2px' }} />
                                <span><strong>Current Address:</strong> <br/><span style={{ color: '#475569', fontSize: '0.85rem' }}>{profile?.currentAddress}</span></span>
                            </p>
                            <p style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                                <MapPin size={16} color="#b21f1f" style={{ marginTop: '2px' }} />
                                <span><strong>Permanent Address:</strong> <br/><span style={{ color: '#475569', fontSize: '0.85rem' }}>{profile?.permanentAddress}</span></span>
                            </p>
                            <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Assigned Roll No:</strong> <span style={{ background: '#1a2a6c', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem' }}>{profile?.rollNumber || 'UPDATING'}</span></p>
                            
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem' }}>
                                <motion.button whileHover={{ scale: 1.02 }} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => window.location.href='/student/results'}>Exam Reports</motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => window.location.href='/student/leaves'}>Request Leave</motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentDashboard;
