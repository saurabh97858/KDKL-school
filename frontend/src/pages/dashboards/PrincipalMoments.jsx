import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Camera, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalMoments = () => {
    const [moments, setMoments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchMoments();
    }, []);

    const fetchMoments = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/moments', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMoments(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('momentPic', file);

        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/moments', data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setShowAdd(false);
            setFormData({ title: '', description: '' });
            setFile(null);
            fetchMoments();
        } catch (err) { alert(err.response?.data?.message || 'Error occurred'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this school moment?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/moments/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchMoments();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ color: '#1a2a6c', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Camera color="#b21f1f" size={32} /> School Moments
                        </h1>
                        <p style={{ color: '#64748b' }}>Post and manage memorable events and their descriptions.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
                        {showAdd ? 'Close' : 'Add New Moment'}
                    </button>
                </div>

                {showAdd && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'white' }}>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Moment Title</label>
                                <input type="text" className="form-input" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Photo (Cloudinary)</label>
                                <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Brief Description</label>
                                <textarea className="form-input" required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Tell us about this moment..." />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ height: '45px', gridColumn: 'span 2' }}>Publish Moment</button>
                        </form>
                    </motion.div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {moments.map(m => (
                        <motion.div key={m._id} whileHover={{ y: -5 }} className="glass-card" style={{ padding: '0', background: 'white', overflow: 'hidden' }}>
                            <div style={{ height: '200px', position: 'relative' }}>
                                <img src={m.imageUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button onClick={() => handleDelete(m._id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', pading: '5px', color: '#ef4444', cursor: 'pointer', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={18} /></button>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a2a6c' }}>{m.title}</h3>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>{m.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {moments.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                        <ImageIcon size={60} style={{ marginBottom: '1rem' }} />
                        <p>No moments posted yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrincipalMoments;
