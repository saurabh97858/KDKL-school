import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { User, Award, Briefcase, Camera, Save, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalFounder = () => {
    const [activeTab, setActiveTab] = useState('founder');
    const [founder, setFounder] = useState({ name: '', message: '', imageUrl: '' });
    const [principals, setPrincipals] = useState([]);
    const [founderFile, setFounderFile] = useState(null);
    const [leaderForm, setLeaderForm] = useState({ name: '', role: '', experience: '', id: null });
    const [leaderFile, setLeaderFile] = useState(null);
    const [showLeaderForm, setShowLeaderForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const [founderRes, principalRes] = await Promise.all([
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/founder', config),
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/principal-info', config)
            ]);
            if (founderRes.data) setFounder(founderRes.data);
            if (principalRes.data) setPrincipals(principalRes.data);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleFounderSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', founder.name);
        formData.append('message', founder.message);
        if (founderFile) formData.append('founderPic', founderFile);

        try {
            await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/founder', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            });
            alert('Founder information updated successfully');
            setFounderFile(null);
            fetchData();
        } catch (err) { 
            alert('Update failed'); 
        }
    };

    const handleLeaderSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', leaderForm.name);
        formData.append('role', leaderForm.role);
        formData.append('experience', leaderForm.experience);
        if (leaderFile) formData.append('founderPic', leaderFile);

        try {
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            };
            if (leaderForm.id) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/principal-info/${leaderForm.id}`, formData, config);
            } else {
                await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/principal-info', formData, config);
            }
            alert('Leader saved successfully');
            setLeaderFile(null);
            setShowLeaderForm(false);
            fetchData();
        } catch (err) { 
            alert('Save failed'); 
        }
    };

    const handleDeleteLeader = async (id) => {
        if (!window.confirm('Delete this leader?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/principal-info/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchData();
        } catch (err) { 
            alert('Delete failed'); 
        }
    };

    const editLeader = (ldr) => {
        setLeaderForm({ name: ldr.name, role: ldr.role, experience: ldr.experience, id: ldr._id });
        setLeaderFile(null);
        setShowLeaderForm(true);
    };

    const getPicUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    if (loading) {
        return (
            <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Sidebar role="principal" />
                <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                    <div style={{ border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="principal" />
            
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
                
                {/* Header Title Row with tab triggers */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.2rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                            Leadership Management
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem', margin: 0 }}>
                            Manage information about school leadership.
                        </p>
                    </div>

                    {/* Styled tab triggers */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '6px', 
                        backgroundColor: 'var(--card-bg)', 
                        border: '1.5px solid var(--border-color)', 
                        padding: '0.4rem', 
                        borderRadius: '12px' 
                    }}>
                        <button 
                            onClick={() => setActiveTab('founder')}
                            style={{ 
                                background: activeTab === 'founder' ? 'linear-gradient(to right, #8b5cf6, #ec4899)' : 'transparent', 
                                color: activeTab === 'founder' ? 'white' : 'var(--text-secondary)', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '0.55rem 1.2rem', 
                                fontSize: '0.85rem', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Founder Info
                        </button>
                        <button 
                            onClick={() => setActiveTab('principal')}
                            style={{ 
                                background: activeTab === 'principal' ? 'linear-gradient(to right, #8b5cf6, #ec4899)' : 'transparent', 
                                color: activeTab === 'principal' ? 'white' : 'var(--text-secondary)', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '0.55rem 1.2rem', 
                                fontSize: '0.85rem', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Principal Info
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="glass-card" style={{ 
                    padding: '2rem', 
                    marginTop: '0.5rem', 
                    maxWidth: '800px', 
                    backgroundColor: 'var(--card-bg)', 
                    border: '1.5px solid var(--border-color)',
                    alignSelf: 'flex-start',
                    width: '100%'
                }}>
                    {activeTab === 'founder' ? (
                        <form onSubmit={handleFounderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'left' }}>
                                <div style={{ backgroundColor: '#faf5ff', color: '#8b5cf6', padding: '0.45rem', borderRadius: '8px', display: 'flex' }}>
                                    <User size={18} />
                                </div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                    School Founder Details
                                </h3>
                            </div>

                            {/* Image Avatar Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                                    <img 
                                        src={getPicUrl(founder.imageUrl)} 
                                        alt="Founder" 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            borderRadius: '50%', 
                                            objectFit: 'cover', 
                                            border: '4px solid #8b5cf6', 
                                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)' 
                                        }} 
                                    />
                                    {/* Upload Camera icon badge */}
                                    <label htmlFor="founder-pic-upload" style={{ 
                                        position: 'absolute', 
                                        bottom: '4px', 
                                        right: '4px', 
                                        backgroundColor: '#8b5cf6', 
                                        color: 'white', 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '50%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                                        border: '2px solid white'
                                    }}>
                                        <Camera size={14} />
                                    </label>
                                </div>
                                
                                <label htmlFor="founder-pic-upload" style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    cursor: 'pointer', 
                                    padding: '0.5rem 1.2rem', 
                                    border: '1.5px dashed var(--border-color)', 
                                    borderRadius: '8px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: '700', 
                                    color: 'var(--text-secondary)' 
                                }}>
                                    <Camera size={15} />
                                    {founderFile ? founderFile.name : 'Change Founder Photo'}
                                    <input id="founder-pic-upload" type="file" onChange={(e) => setFounderFile(e.target.files[0])} accept="image/*" style={{ display: 'none' }} />
                                </label>
                            </div>

                            {/* Name Input */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Founder Name</label>
                                <input 
                                    type="text" 
                                    value={founder.name} 
                                    onChange={(e) => setFounder({ ...founder, name: e.target.value })} 
                                    required 
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.65rem 1rem', 
                                        borderRadius: '10px', 
                                        border: '1.5px solid var(--border-color)', 
                                        backgroundColor: 'var(--card-bg)', 
                                        color: 'var(--text-primary)',
                                        fontSize: '0.88rem',
                                        fontWeight: '500'
                                    }} 
                                />
                            </div>

                            {/* Message / Legacy Textarea */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', position: 'relative' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Message / Legacy</label>
                                <textarea 
                                    value={founder.message} 
                                    onChange={(e) => setFounder({ ...founder, message: e.target.value })} 
                                    rows="4" 
                                    maxLength="500"
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.65rem 1rem', 
                                        borderRadius: '10px', 
                                        border: '1.5px solid var(--border-color)', 
                                        backgroundColor: 'var(--card-bg)', 
                                        color: 'var(--text-primary)',
                                        fontSize: '0.88rem',
                                        fontWeight: '500',
                                        lineHeight: '1.5',
                                        resize: 'vertical'
                                    }}
                                ></textarea>
                                <span style={{ position: 'absolute', bottom: '-20px', right: '5px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                    {founder.message?.length || 0}/500 characters
                                </span>
                            </div>

                            {/* Submit Button */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.2rem' }}>
                                <button 
                                    type="submit" 
                                    style={{ 
                                        background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                                        color: 'white', 
                                        borderRadius: '10px', 
                                        padding: '0.7rem 2.2rem', 
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.25)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'left' }}>
                                    <div style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.45rem', borderRadius: '8px', display: 'flex' }}>
                                        <Award size={18} />
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                        School Leadership
                                    </h3>
                                </div>
                                <button 
                                    className="btn" 
                                    onClick={() => { setLeaderForm({ name: '', role: '', experience: '', id: null }); setShowLeaderForm(true); }}
                                    style={{ 
                                        background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                                        color: 'white', 
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.82rem',
                                        padding: '0.55rem 1.2rem',
                                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                                    }}
                                >
                                    <Plus size={16} />
                                    Add New Leader
                                </button>
                            </div>

                            {/* Leader Form Modal-like layout */}
                            {showLeaderForm && (
                                <form onSubmit={handleLeaderSubmit} style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '1.2rem', 
                                    background: 'var(--bg-light)', 
                                    padding: '1.5rem', 
                                    borderRadius: '16px', 
                                    border: '1.5px solid var(--border-color)', 
                                    transition: 'all 0.3s ease',
                                    textAlign: 'left'
                                }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, fontWeight: '800' }}>
                                        {leaderForm.id ? 'Edit Leader Details' : 'Add New Leader'}
                                    </h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Leader Photo</label>
                                        <label htmlFor="leader-pic-upload" style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '6px', 
                                            cursor: 'pointer', 
                                            padding: '0.5rem 1.2rem', 
                                            border: '1.5px dashed var(--border-color)', 
                                            borderRadius: '8px', 
                                            fontSize: '0.8rem', 
                                            fontWeight: '700', 
                                            color: 'var(--text-secondary)' 
                                        }}>
                                            <Camera size={15} />
                                            {leaderFile ? leaderFile.name : 'Choose Photo'}
                                            <input id="leader-pic-upload" type="file" onChange={(e) => setLeaderFile(e.target.files[0])} accept="image/*" style={{ display: 'none' }} />
                                        </label>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Name</label>
                                            <input 
                                                type="text" 
                                                value={leaderForm.name} 
                                                onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })} 
                                                required 
                                                placeholder="e.g. R.K. Sharma" 
                                                style={{ 
                                                    width: '100%', 
                                                    padding: '0.6rem 1rem', 
                                                    borderRadius: '8px', 
                                                    border: '1.5px solid var(--border-color)', 
                                                    backgroundColor: 'var(--card-bg)', 
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.85rem'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Role</label>
                                            <input 
                                                type="text" 
                                                value={leaderForm.role} 
                                                onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })} 
                                                required 
                                                placeholder="e.g. Manager / Principal" 
                                                style={{ 
                                                    width: '100%', 
                                                    padding: '0.6rem 1rem', 
                                                    borderRadius: '8px', 
                                                    border: '1.5px solid var(--border-color)', 
                                                    backgroundColor: 'var(--card-bg)', 
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.85rem'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Experience Details</label>
                                        <input 
                                            type="text" 
                                            value={leaderForm.experience} 
                                            onChange={(e) => setLeaderForm({ ...leaderForm, experience: e.target.value })} 
                                            required 
                                            placeholder="e.g. 15+ years of teaching excellence" 
                                            style={{ 
                                                width: '100%', 
                                                padding: '0.6rem 1rem', 
                                                borderRadius: '8px', 
                                                border: '1.5px solid var(--border-color)', 
                                                backgroundColor: 'var(--card-bg)', 
                                                color: 'var(--text-primary)',
                                                fontSize: '0.85rem'
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                                        <button type="submit" style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>Save Leader</button>
                                        <button type="button" onClick={() => setShowLeaderForm(false)} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                                    </div>
                                </form>
                            )}

                            {/* Leadership cards list */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                {principals.map(ldr => (
                                    <div key={ldr._id} style={{ border: '1.5px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--card-bg)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} className="leader-profile-card">
                                        <img 
                                            src={getPicUrl(ldr.imageUrl)} 
                                            alt={ldr.name} 
                                            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #8b5cf6', marginBottom: '0.8rem' }} 
                                        />
                                        <h3 style={{ margin: '0 0 0.3rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '800' }}>{ldr.name}</h3>
                                        <div style={{ background: '#faf5ff', color: '#8b5cf6', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '800', marginBottom: '0.6rem', border: '1px solid rgba(139, 92, 246, 0.15)' }}>{ldr.role}</div>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.2rem', fontWeight: '500', height: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{ldr.experience}</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                            <button 
                                                onClick={() => editLeader(ldr)} 
                                                style={{ 
                                                    flex: 1, 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: '700',
                                                    padding: '0.45rem', 
                                                    borderRadius: '8px', 
                                                    backgroundColor: 'var(--bg-light)', 
                                                    color: 'var(--text-primary)', 
                                                    border: '1.5px solid var(--border-color)', 
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <Edit2 size={12} />
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteLeader(ldr._id)} 
                                                style={{ 
                                                    flex: 1, 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: '700',
                                                    padding: '0.45rem', 
                                                    borderRadius: '8px', 
                                                    backgroundColor: '#fee2e2', 
                                                    color: '#ef4444', 
                                                    border: 'none', 
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <Trash2 size={12} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {principals.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1', padding: '1.5rem', fontWeight: '600' }}>No leadership profiles added yet.</p>}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .leader-profile-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.04);
                }
                body.dark .leader-profile-card:hover {
                    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
                }
            `}</style>
        </div>
    );
};

export default PrincipalFounder;
