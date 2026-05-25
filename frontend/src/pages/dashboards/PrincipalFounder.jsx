import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { User, Award, Briefcase, Camera } from 'lucide-react';

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
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
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
        } catch (err) { alert('Update failed'); }
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
        } catch (err) { alert('Save failed'); }
    };

    const handleDeleteLeader = async (id) => {
        if (!window.confirm('Delete this leader?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/principal-info/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchData();
        } catch (err) { alert('Delete failed'); }
    };

    const editLeader = (ldr) => {
        setLeaderForm({ name: ldr.name, role: ldr.role, experience: ldr.experience, id: ldr._id });
        setLeaderFile(null);
        setShowLeaderForm(true);
    };

    if (loading) return <div className="dashboard-container"><Sidebar role="principal" /><div className="dashboard-content">Loading...</div></div>;

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ margin: 0 }}>Leadership Management</h1>
                    <div className="tab-container" style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            className={`btn ${activeTab === 'founder' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('founder')}
                        >
                            Founder Info
                        </button>
                        <button 
                            className={`btn ${activeTab === 'principal' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('principal')}
                        >
                            Principal Info
                        </button>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem', maxWidth: '800px', background: 'var(--glass)' }}>
                    {activeTab === 'founder' ? (
                        <form onSubmit={handleFounderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <h2 style={{ fontSize: '1.45rem', color: 'var(--primary)' }}>School Founder Details</h2>
                            <div style={{ textAlign: 'center' }}>
                                <img 
                                    src={founder.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${founder.imageUrl}` : 'https://via.placeholder.com/150'} 
                                    alt="Founder" 
                                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid var(--primary)', transition: 'border-color 0.3s ease' }} 
                                    className="fade-in"
                                />
                                <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'center' }}>
                                    <label htmlFor="founder-pic-upload" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem', cursor: 'pointer', padding: '0.55rem 1rem' }}>
                                        <Camera size={16} />
                                        {founderFile ? founderFile.name : 'Change Founder Photo'}
                                        <input id="founder-pic-upload" type="file" onChange={(e) => setFounderFile(e.target.files[0])} accept="image/*" style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Founder Name</label>
                                <input type="text" value={founder.name} onChange={(e) => setFounder({ ...founder, name: e.target.value })} required className="form-input" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Message/Legacy</label>
                                <textarea value={founder.message} onChange={(e) => setFounder({ ...founder, message: e.target.value })} rows="5" className="form-input" style={{ width: '100%' }}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem' }}>Save Founder Info</button>
                        </form>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h2 style={{ fontSize: '1.45rem', color: 'var(--primary)' }}>School Leadership</h2>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => { setLeaderForm({ name: '', role: '', experience: '', id: null }); setShowLeaderForm(true); }}
                                    style={{ background: 'var(--secondary)', border: 'none' }}
                                >
                                    + Add New Leader
                                </button>
                            </div>

                            {showLeaderForm && (
                                <form onSubmit={handleLeaderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'var(--bg-light)', padding: '1.2rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', marginBottom: '1.5rem', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{leaderForm.id ? 'Edit Leader Details' : 'Add New Leader'}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Leader Photo</label>
                                        <label htmlFor="leader-pic-upload" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem', cursor: 'pointer', padding: '0.55rem 1rem' }}>
                                            <Camera size={16} />
                                            {leaderFile ? leaderFile.name : 'Choose Photo'}
                                            <input id="leader-pic-upload" type="file" onChange={(e) => setLeaderFile(e.target.files[0])} accept="image/*" style={{ display: 'none' }} />
                                        </label>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Name</label>
                                            <input type="text" value={leaderForm.name} onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })} required className="form-input" style={{ width: '100%' }} placeholder="e.g. R.K. Sharma" />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Role</label>
                                            <input type="text" value={leaderForm.role} onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })} required className="form-input" style={{ width: '100%' }} placeholder="e.g. Manager / Principal" />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Experience Details</label>
                                        <input type="text" value={leaderForm.experience} onChange={(e) => setLeaderForm({ ...leaderForm, experience: e.target.value })} required className="form-input" style={{ width: '100%' }} placeholder="e.g. 15+ years of teaching excellence" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.6rem' }}>Save Leader</button>
                                        <button type="button" onClick={() => setShowLeaderForm(false)} className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem' }}>Cancel</button>
                                    </div>
                                </form>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                                {principals.map(ldr => (
                                    <div key={ldr._id} style={{ border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--card-bg)', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                                        <img 
                                            src={ldr.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${ldr.imageUrl}` : 'https://via.placeholder.com/100'} 
                                            alt={ldr.name} 
                                            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', marginBottom: '0.8rem', transition: 'border-color 0.3s ease' }} 
                                        />
                                        <h3 style={{ margin: '0 0 0.4rem 0', color: 'var(--primary)', fontSize: '1.15rem', transition: 'color 0.3s ease' }}>{ldr.name}</h3>
                                        <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--secondary)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', transition: 'color 0.3s ease' }}>{ldr.role}</div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.2rem', transition: 'color 0.3s ease' }}>{ldr.experience}</p>
                                        <div style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
                                            <button onClick={() => editLeader(ldr)} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}>Edit</button>
                                            <button onClick={() => handleDeleteLeader(ldr._id)} className="btn" style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem', background: '#ef4444', color: 'white', border: 'none' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {principals.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1', padding: '1.5rem' }}>No leadership profiles added yet.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .tab-container { margin-bottom: 20px; }
            `}</style>
        </div>
    );
};

export default PrincipalFounder;
