import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Camera, Trash2, Plus, Image as ImageIcon, X, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PrincipalMoments = () => {
    const [moments, setMoments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    useEffect(() => {
        fetchMoments();
    }, []);

    const showToast = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
    };

    const fetchMoments = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/moments', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMoments(data);
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch school moments', 'error');
        }
        setLoading(false);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('momentPic', file);

        setLoading(true);
        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/moments', data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setShowAdd(false);
            setFormData({ title: '', description: '' });
            setFile(null);
            setPreviewUrl('');
            showToast('School moment published successfully!', 'success');
            fetchMoments();
        } catch (err) {
            showToast(err.response?.data?.message || 'Error occurred while saving', 'error');
        }
        setLoading(false);
    };

    const confirmDelete = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const handleDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ show: false, id: null });
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/moments/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            showToast('School moment deleted successfully!', 'success');
            fetchMoments();
        } catch (err) {
            console.error(err);
            showToast('Failed to delete moment', 'error');
        }
    };

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="principal" />
            
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '2rem', fontWeight: '800', margin: 0 }}>
                            <Camera color="var(--primary)" size={32} /> School Moments
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.3rem', margin: 0 }}>
                            Capture, post, and manage memorable campus life achievements and historic milestones.
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowAdd(!showAdd)}
                        style={{
                            background: showAdd ? 'var(--bg-light)' : 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)',
                            color: showAdd ? 'var(--text-primary)' : 'white',
                            border: showAdd ? '1.5px solid var(--border-color)' : 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: showAdd ? 'none' : '0 4px 15px rgba(236, 72, 153, 0.25)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {showAdd ? <X size={16} /> : <Plus size={16} />}
                        {showAdd ? 'Close Editor' : 'Publish Moment'}
                    </button>
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                    {notification.show && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            style={{
                                position: 'fixed',
                                top: '24px',
                                right: '24px',
                                zIndex: 10000,
                                background: notification.type === 'success' ? '#10b981' : '#ef4444',
                                color: 'white',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}
                        >
                            {notification.type === 'success' ? <Sparkles size={18} /> : <AlertCircle size={18} />}
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Dialog */}
                <AnimatePresence>
                    {deleteConfirm.show && (
                        <div style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '1rem'
                        }}>
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                style={{
                                    background: 'var(--card-bg)',
                                    border: '1.5px solid var(--border-color)',
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    maxWidth: '400px',
                                    width: '100%',
                                    textAlign: 'center',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                                }}
                            >
                                <div style={{ color: '#ef4444', display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', marginBottom: '1.5rem' }}>
                                    <Trash2 size={32} />
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '800' }}>Delete School Moment</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1.8rem 0' }}>
                                    Are you sure you want to permanently delete this moment? This action cannot be undone.
                                </p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        onClick={() => setDeleteConfirm({ show: false, id: null })}
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Add Moment Form Editor */}
                <AnimatePresence>
                    {showAdd && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div className="glass-card" style={{ padding: '2rem', border: '1.5px solid var(--border-color)', borderRadius: '20px', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Sparkles size={18} color="var(--primary)" /> Draft New School Moment
                                </h3>
                                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="responsive-form-grid">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Moment Title</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={formData.title} 
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                                            placeholder="Enter descriptive title for this moment..."
                                            style={{
                                                padding: '0.8rem 1rem',
                                                borderRadius: '12px',
                                                border: '1.5px solid var(--border-color)',
                                                backgroundColor: 'var(--bg-light)',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="full-width-mobile">
                                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Select Banner Photo</label>
                                        <div style={{
                                            border: '2px dashed var(--border-color)',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            backgroundColor: 'var(--bg-light)',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            height: '140px'
                                        }}>
                                            <input 
                                                type="file" 
                                                required={!file} 
                                                onChange={handleFileChange} 
                                                accept="image/*"
                                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                            />
                                            <ImageIcon size={28} color="var(--text-secondary)" />
                                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                {file ? file.name : 'Upload Moment Image'}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>PNG, JPG or WEBP up to 5MB</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="full-width-mobile">
                                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Photo Preview</label>
                                        <div style={{
                                            border: '1.5px solid var(--border-color)',
                                            borderRadius: '16px',
                                            height: '140px',
                                            backgroundColor: 'var(--bg-light)',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative'
                                        }}>
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>No image selected</span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Brief Event Description</label>
                                        <textarea 
                                            required 
                                            rows="3" 
                                            value={formData.description} 
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                                            placeholder="Write an engaging description describing the context and achievement of this moment..."
                                            style={{
                                                padding: '0.8rem 1rem',
                                                borderRadius: '12px',
                                                border: '1.5px solid var(--border-color)',
                                                backgroundColor: 'var(--bg-light)',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                outline: 'none',
                                                resize: 'vertical',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        style={{
                                            gridColumn: 'span 2',
                                            background: 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.9rem',
                                            borderRadius: '12px',
                                            fontWeight: '700',
                                            fontSize: '0.95rem',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : 'Publish Moment To Website'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Moments Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {moments.map(m => (
                        <motion.div 
                            key={m._id} 
                            whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }} 
                            className="glass-card" 
                            style={{ 
                                padding: '0', 
                                backgroundColor: 'var(--card-bg)', 
                                border: '1.5px solid var(--border-color)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'left',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                                <img src={m.imageUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="moment-hover-zoom" />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)'
                                }}></div>
                                <button 
                                    onClick={() => confirmDelete(m._id)} 
                                    style={{ 
                                        position: 'absolute', 
                                        top: '12px', 
                                        right: '12px', 
                                        background: 'rgba(255,255,255,0.95)', 
                                        border: 'none', 
                                        borderRadius: '50%', 
                                        color: '#ef4444', 
                                        cursor: 'pointer', 
                                        width: '36px', 
                                        height: '36px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                    className="trash-btn"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.6rem 0', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '800', lineHeight: '1.3' }}>{m.title}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', fontWeight: '500' }}>{m.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {moments.length === 0 && !loading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ 
                            textAlign: 'center', 
                            padding: '5rem 2rem', 
                            backgroundColor: 'var(--card-bg)', 
                            border: '1.5px solid var(--border-color)', 
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <div style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                            <ImageIcon size={64} strokeWidth={1.5} />
                        </div>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>No moments posted yet</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 1rem 0', maxWidth: '400px' }}>
                            You haven't uploaded any memorable school moments. Hit the publish button above to create your first event!
                        </p>
                    </motion.div>
                )}

                {/* Loader State */}
                {loading && moments.length === 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrincipalMoments;
