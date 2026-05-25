import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Upload, Trash2, Edit2, Camera, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PrincipalGallery = () => {
    const [gallery, setGallery] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Slider');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/gallery');
            setGallery(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const getPicUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setTitle(item.title);
        setCategory(item.category);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (file) formData.append('galleryPic', file);
        formData.append('title', title);
        formData.append('category', category);

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/gallery/${editingId}`, formData, config);
            } else {
                if (!file) return alert('Photo is required for new upload');
                await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/gallery', formData, config);
            }
            setTitle('');
            setFile(null);
            setEditingId(null);
            fetchGallery();
        } catch (err) { alert('Action failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this memory?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/gallery/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchGallery();
        } catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="dashboard-content"
            >
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 className="premium-text" style={{ fontSize: '2.5rem', color: '#1a2a6c' }}>Gallery Management</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Curate the visual story of KDKL - Home Slider & Campus Life.</p>
                </header>

                <motion.div 
                    layout
                    className="glass-card" 
                    style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--glass)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Camera size={20} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>{editingId ? 'Refine Moment' : 'Capture New Moment'}</h3>
                        </div>
                        {editingId && (
                            <button onClick={() => {setEditingId(null); setTitle(''); setFile(null);}} className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Image Caption</label>
                            <input type="text" placeholder="e.g. Annual Sports Day 2026" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Display Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input" style={{ width: '100%' }}>
                                <option value="Slider">Home Page Slider</option>
                                <option value="Environment">Campus Environment</option>
                                <option value="Functions">Events & Functions</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Image</label>
                            <label htmlFor="gallery-file-upload" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem', cursor: 'pointer', padding: '0.55rem 1rem', width: '100%', justifyContent: 'center', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                <Upload size={16} />
                                {file ? file.name : 'Choose Photo'}
                                <input id="gallery-file-upload" type="file" onChange={(e) => setFile(e.target.files[0])} required={!editingId} style={{ display: 'none' }} accept="image/*" />
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '36px', width: '100%', fontWeight: '800' }}>
                            {editingId ? 'Update Moment' : 'Upload to Cloud'}
                        </button>
                    </form>
                </motion.div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <Filter size={20} color="#1a2a6c" />
                    <h3 style={{ fontSize: '1.4rem', color: '#1a2a6c', margin: 0 }}>Visions Captured ({gallery.length})</h3>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>Refining memories...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        <AnimatePresence>
                            {gallery.map((img, idx) => (
                                <motion.div 
                                    key={img._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="glass-card" 
                                    style={{ padding: '0', position: 'relative', overflow: 'hidden', minHeight: '300px' }}
                                >
                                    <div style={{ height: '200px', width: '100%' }}>
                                        <img 
                                            src={getPicUrl(img.imageUrl)} 
                                            alt={img.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ background: '#b21f1f', color: 'white', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.5rem', fontWeight: '800' }}>
                                            {img.category.toUpperCase()}
                                        </div>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a2a6c', margin: 0 }}>{img.title}</p>
                                    </div>
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEdit(img)} style={{ background: 'rgba(255,255,255,0.9)', color: '#1a2a6c', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                            <Edit2 size={16} />
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(img._id)} style={{ background: 'rgba(255,255,255,0.9)', color: '#ef4444', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PrincipalGallery;
