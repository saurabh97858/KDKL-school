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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Leadership Management</h1>
                    <div className="tab-container" style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            className={`btn ${activeTab === 'founder' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('founder')}
                        >
                            Founder Info
                        </button>
                        <button 
                            className={`btn ${activeTab === 'principal' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('principal')}
                        >
                            Principal Info
                        </button>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', maxWidth: '800px', backgroundColor: 'white' }}>
                    {activeTab === 'founder' ? (
                        <form onSubmit={handleFounderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h2>School Founder Details</h2>
                            <div style={{ textAlign: 'center' }}>
                                <img 
                                    src={founder.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${founder.imageUrl}` : 'https://via.placeholder.com/150'} 
                                    alt="Founder" 
                                    style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '6px solid #1a2a6c' }} 
                                />
                                <div style={{ marginTop: '1rem' }}>
                                    <input type="file" onChange={(e) => setFounderFile(e.target.files[0])} accept="image/*" />
                                </div>
                            </div>
                            <div>
                                <label>Founder Name</label>
                                <input type="text" value={founder.name} onChange={(e) => setFounder({ ...founder, name: e.target.value })} required className="form-input" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label>Message/Legacy</label>
                                <textarea value={founder.message} onChange={(e) => setFounder({ ...founder, message: e.target.value })} rows="6" className="form-input" style={{ width: '100%' }}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Save Founder Info</button>
                        </form>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2>School Leadership (Principals & Managers)</h2>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => { setLeaderForm({ name: '', role: '', experience: '', id: null }); setShowLeaderForm(true); }}
                                    style={{ background: '#b21f1f', border: 'none' }}
                                >
                                    + Add New Leader
                                </button>
                            </div>

                            {showLeaderForm && (
                                <form onSubmit={handleLeaderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                                    <h3>{leaderForm.id ? 'Edit Leader' : 'Add New Leader'}</h3>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ marginTop: '1rem' }}>
                                            <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Upload Photo:</label>
                                            <input type="file" onChange={(e) => setLeaderFile(e.target.files[0])} accept="image/*" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label>Name</label>
                                            <input type="text" value={leaderForm.name} onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })} required className="form-input" style={{ width: '100%' }} placeholder="e.g. R.K. Sharma" />
                                        </div>
                                        <div>
                                            <label>Role</label>
                                            <input type="text" value={leaderForm.role} onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })} required className="form-input" style={{ width: '100%' }} placeholder="e.g. Manager (Hindi Medium)" />
                                        </div>
                                    </div>
                                    <div>
                                        <label>Experience Details</label>
                                        <input type="text" value={leaderForm.experience} onChange={(e) => setLeaderForm({ ...leaderForm, experience: e.target.value })} required className="form-input" style={{ width: '100%' }} placeholder="e.g. 15+ years of teaching excellence" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className="btn" style={{ background: '#1a2a6c', color: 'white', flex: 1, padding: '0.8rem' }}>Save Leader</button>
                                        <button type="button" onClick={() => setShowLeaderForm(false)} className="btn btn-outline" style={{ flex: 1, padding: '0.8rem' }}>Cancel</button>
                                    </div>
                                </form>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {principals.map(ldr => (
                                    <div key={ldr._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
                                        <img 
                                            src={ldr.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${ldr.imageUrl}` : 'https://via.placeholder.com/100'} 
                                            alt={ldr.name} 
                                            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1a2a6c', marginBottom: '1rem' }} 
                                        />
                                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a2a6c' }}>{ldr.name}</h3>
                                        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{ldr.role}</div>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', marginBottom: '1.5rem' }}>{ldr.experience}</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                            <button onClick={() => editLeader(ldr)} className="btn btn-outline" style={{ flex: 1, fontSize: '0.85rem' }}>Edit</button>
                                            <button onClick={() => handleDeleteLeader(ldr._id)} className="btn" style={{ flex: 1, fontSize: '0.85rem', background: '#ef4444', color: 'white', border: 'none' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {principals.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', gridColumn: '1 / -1' }}>No leadership profiles added yet.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .form-input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; margin-top: 5px; }
                .tab-container { margin-bottom: 20px; }
                .btn-outline { border: 1px solid #1a2a6c; color: #1a2a6c; background: transparent; }
                .btn-danger { background: #b21f1f; color: white; border: none; padding: 1rem; border-radius: 6px; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default PrincipalFounder;
