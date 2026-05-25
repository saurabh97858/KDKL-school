import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Trophy, Trash2, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalToppers = () => {
    const [toppers, setToppers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ studentName: '', className: '', percentage: '' });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchToppers();
    }, []);

    const fetchToppers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/toppers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setToppers(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('topperPic', file);

        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/toppers', data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setShowAdd(false);
            setFormData({ studentName: '', className: '', percentage: '' });
            setFile(null);
            fetchToppers();
        } catch (err) { alert(err.response?.data?.message || 'Error occurred'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this topper?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/toppers/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchToppers();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ color: '#1a2a6c', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Trophy color="#fdbb2d" size={32} /> Academic Toppers
                        </h1>
                        <p style={{ color: '#64748b' }}>Manage students who secured top positions.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
                        {showAdd ? 'Close' : 'Add New Topper'}
                    </button>
                </div>

                {showAdd && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'white' }}>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Student Name</label>
                                <input type="text" className="form-input" required value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Class</label>
                                <input type="text" className="form-input" required value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Percentage (%)</label>
                                <input type="text" className="form-input" required value={formData.percentage} onChange={(e) => setFormData({ ...formData, percentage: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Student Pic</label>
                                <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ height: '45px' }}>Save Topper</button>
                        </form>
                    </motion.div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {toppers.map(t => (
                        <motion.div key={t._id} whileHover={{ y: -5 }} className="glass-card" style={{ padding: '1.5rem', background: 'white', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                <button onClick={() => handleDelete(t._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={20} /></button>
                            </div>
                            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                <img src={t.imageUrl} alt={t.studentName} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fdbb2d' }} />
                                <div>
                                    <h3 style={{ margin: 0, color: '#1a2a6c' }}>{t.studentName}</h3>
                                    <p style={{ margin: '3px 0', color: '#64748b', fontSize: '0.9rem' }}>Class: {t.className}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#b21f1f', fontWeight: '800' }}>
                                        <Star size={16} fill="#b21f1f" /> {t.percentage}%
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {toppers.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                        <Trophy size={60} style={{ marginBottom: '1rem' }} />
                        <p>No toppers added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrincipalToppers;
