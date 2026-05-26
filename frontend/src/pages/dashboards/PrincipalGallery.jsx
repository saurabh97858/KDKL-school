import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { 
    Upload, 
    Trash2, 
    Edit2, 
    Camera, 
    Search, 
    ChevronDown, 
    Calendar, 
    User, 
    ChevronLeft, 
    ChevronRight,
    X,
    Info,
    CloudLightning,
    ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PrincipalGallery = () => {
    const [gallery, setGallery] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Slider');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Newest First');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/gallery');
            setGallery(data);
        } catch (err) { 
            console.error('Error fetching gallery:', err); 
        } finally {
            setLoading(false);
        }
    };

    const getPicUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setTitle(item.title);
        setCategory(item.category);
        setShowAdd(true);
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
                alert('Moment updated successfully');
            } else {
                if (!file) return alert('Photo is required for new upload');
                await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/gallery', formData, config);
                alert('Moment uploaded successfully');
            }
            setTitle('');
            setFile(null);
            setEditingId(null);
            setShowAdd(false);
            fetchGallery();
        } catch (err) { 
            alert('Upload failed'); 
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this memory?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/gallery/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchGallery();
        } catch (err) { 
            alert('Delete failed'); 
        }
    };

    const [showAdd, setShowAdd] = useState(false);

    // Dynamic Category Formatting
    const getCategoryDetails = (cat) => {
        const c = cat?.toLowerCase() || '';
        if (c === 'slider') {
            return { label: 'Home Page Slider', bg: '#faf5ff', text: '#8b5cf6' };
        } else if (c === 'environment' || c === 'campus') {
            return { label: 'Campus Life', bg: '#f0fdf4', text: '#16a34a' };
        } else if (c === 'functions' || c === 'events') {
            return { label: 'Events', bg: '#fff3eb', text: '#ea580c' };
        }
        return { label: cat || 'General', bg: '#f1f5f9', text: '#64748b' };
    };

    // Client-side filtering & sorting
    const filteredGallery = gallery.filter(img => 
        (img.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'Newest First') {
        filteredGallery.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Oldest First') {
        filteredGallery.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredGallery.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredGallery.length / itemsPerPage) || 1;

    const paginate = (num) => setCurrentPage(num);

    const formatShortDate = (dateStr) => {
        if (!dateStr) return '26 May 2026';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
            return '26 May 2026';
        }
    };

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="principal" />
            
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
                
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                            Gallery Management
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem', margin: 0 }}>
                            Curate the visual story of KDKL - Home Slider & Campus Life.
                        </p>
                    </div>

                    <button 
                        onClick={() => { setShowAdd(!showAdd); if(showAdd) setEditingId(null); }}
                        style={{ 
                            background: showAdd ? 'var(--text-secondary)' : 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                            color: 'white', 
                            borderRadius: '10px', 
                            padding: '0.65rem 1.4rem', 
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: showAdd ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.2)'
                        }}
                    >
                        <Camera size={16} />
                        {showAdd ? 'View Captured moments' : 'Capture New Moment'}
                    </button>
                </div>

                {/* Capture New Moment Form Panel */}
                {showAdd && (
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Camera size={18} color="#8b5cf6" />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                    {editingId ? 'Refine Moment' : 'Capture New Moment'}
                                </h3>
                            </div>
                            {editingId && (
                                <button 
                                    onClick={() => { setEditingId(null); setTitle(''); setFile(null); setShowAdd(false); }} 
                                    style={{ 
                                        border: '1.5px solid var(--border-color)', 
                                        borderRadius: '8px', 
                                        padding: '0.35rem 0.8rem', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '750', 
                                        backgroundColor: 'transparent',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                        
                        <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', alignItems: 'end' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Image Caption</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Annual Sports Day 2025" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.65rem 1rem', 
                                        borderRadius: '10px', 
                                        border: '1.5px solid var(--border-color)', 
                                        backgroundColor: 'var(--card-bg)', 
                                        color: 'var(--text-primary)',
                                        fontSize: '0.85rem',
                                        fontWeight: '500'
                                    }} 
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Display Category</label>
                                <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.65rem 1rem', 
                                        borderRadius: '10px', 
                                        border: '1.5px solid var(--border-color)', 
                                        backgroundColor: 'var(--card-bg)', 
                                        color: 'var(--text-primary)',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="Slider">Home Page Slider</option>
                                    <option value="Environment">Campus Environment</option>
                                    <option value="Functions">Events & Functions</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Image</label>
                                <label htmlFor="gallery-file-upload" style={{ 
                                    display: 'inline-flex', 
                                    gap: '6px', 
                                    cursor: 'pointer', 
                                    padding: '0.6rem 1rem', 
                                    border: '1.5px dashed var(--border-color)', 
                                    borderRadius: '10px', 
                                    fontSize: '0.82rem', 
                                    fontWeight: '700', 
                                    color: 'var(--text-secondary)',
                                    backgroundColor: 'var(--card-bg)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '42px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <Upload size={14} />
                                    {file ? file.name : 'Choose Photo'}
                                    <input id="gallery-file-upload" type="file" onChange={(e) => setFile(e.target.files[0])} required={!editingId} style={{ display: 'none' }} accept="image/*" />
                                </label>
                            </div>
                            <button 
                                type="submit" 
                                style={{ 
                                    height: '42px', 
                                    background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '10px', 
                                    fontWeight: '700', 
                                    fontSize: '0.85rem', 
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Upload size={15} />
                                {editingId ? 'Update Moment' : 'Upload to Cloud'}
                            </button>
                        </form>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '0.8rem', marginBottom: 0 }}>
                            <Info size={12} /> Supported formats: JPG, PNG, WEBP (Max. 5MB)
                        </p>
                    </div>
                )}

                {/* Gallery List Area */}
                <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                    
                    {/* Visions captured title + filters */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                            <ImageIcon size={18} color="#8b5cf6" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                Visions Captured ({filteredGallery.length})
                            </h3>
                        </div>

                        {/* Search and Sort Dropdown */}
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end', maxWidth: '500px' }}>
                            <div style={{ position: 'relative', width: '200px' }}>
                                <Search size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search in gallery..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.45rem 1rem 0.45rem 2rem', 
                                        borderRadius: '8px', 
                                        border: '1.5px solid var(--border-color)', 
                                        backgroundColor: 'var(--card-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.8rem',
                                        fontWeight: '500'
                                    }} 
                                />
                            </div>

                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ 
                                    border: '1.5px solid var(--border-color)', 
                                    borderRadius: '8px', 
                                    padding: '0.45rem 0.8rem', 
                                    fontSize: '0.8rem', 
                                    fontWeight: '600', 
                                    backgroundColor: 'var(--card-bg)', 
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <option>Newest First</option>
                                <option>Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Moments Cards Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <div style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }}></div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Refining memories...</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.2rem' }}>
                                <AnimatePresence>
                                    {currentItems.map((img, idx) => {
                                        const catDetail = getCategoryDetails(img.category);
                                        return (
                                            <motion.div 
                                                key={img._id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: idx * 0.03 }}
                                                style={{ 
                                                    padding: '0', 
                                                    position: 'relative', 
                                                    overflow: 'hidden', 
                                                    borderRadius: '20px',
                                                    border: '1.5px solid var(--border-color)',
                                                    backgroundColor: 'var(--card-bg)',
                                                    boxShadow: '0 8px 20px rgba(0,0,0,0.01)'
                                                }}
                                                className="captured-moment-card"
                                            >
                                                <div style={{ height: '190px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                                    <img 
                                                        src={getPicUrl(img.imageUrl)} 
                                                        alt={img.title} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                                                        className="moment-img"
                                                    />

                                                    {/* Floating buttons matching Screenshot 5 */}
                                                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                                                        <button 
                                                            onClick={() => handleEdit(img)} 
                                                            style={{ 
                                                                background: 'white', 
                                                                color: '#2563eb', 
                                                                border: 'none', 
                                                                borderRadius: '50%', 
                                                                width: '32px', 
                                                                height: '32px', 
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                justifyContent: 'center', 
                                                                cursor: 'pointer', 
                                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
                                                            }}
                                                        >
                                                            <Edit2 size={13} strokeWidth={2.5} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(img._id)} 
                                                            style={{ 
                                                                background: 'white', 
                                                                color: '#ef4444', 
                                                                border: 'none', 
                                                                borderRadius: '50%', 
                                                                width: '32px', 
                                                                height: '32px', 
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                justifyContent: 'center', 
                                                                cursor: 'pointer', 
                                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
                                                            }}
                                                        >
                                                            <Trash2 size={13} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{ padding: '1.2rem', textAlign: 'left' }}>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.6rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {img.title}
                                                    </h3>
                                                    <span style={{ 
                                                        display: 'inline-block', 
                                                        backgroundColor: catDetail.bg, 
                                                        color: catDetail.text, 
                                                        fontSize: '0.72rem', 
                                                        padding: '0.25rem 0.65rem', 
                                                        borderRadius: '6px', 
                                                        fontWeight: '800',
                                                        marginBottom: '0.8rem' 
                                                    }}>
                                                        {catDetail.label}
                                                    </span>

                                                    {/* Card Meta Date & Admin info */}
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        gap: '12px', 
                                                        fontSize: '0.75rem', 
                                                        color: 'var(--text-secondary)',
                                                        borderTop: '1px solid var(--border-color)',
                                                        paddingTop: '0.8rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Calendar size={12} style={{ opacity: 0.8 }} />
                                                            {formatShortDate(img.createdAt)}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <User size={12} style={{ opacity: 0.8 }} />
                                                            By Admin
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Pagination */}
                            {filteredGallery.length > 0 && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    paddingTop: '1rem', 
                                    borderTop: '1.5px solid var(--border-color)',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredGallery.length)} of {filteredGallery.length} moments
                                    </span>

                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button 
                                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            style={{ 
                                                border: '1.5px solid var(--border-color)', 
                                                backgroundColor: 'var(--card-bg)', 
                                                color: 'var(--text-secondary)',
                                                padding: '5px 10px', 
                                                borderRadius: '8px', 
                                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                opacity: currentPage === 1 ? 0.5 : 1
                                            }}
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button 
                                                key={i + 1}
                                                onClick={() => paginate(i + 1)}
                                                style={{ 
                                                    border: '1.5px solid var(--border-color)', 
                                                    backgroundColor: currentPage === i + 1 ? '#8b5cf6' : 'var(--card-bg)', 
                                                    color: currentPage === i + 1 ? 'white' : 'var(--text-primary)',
                                                    padding: '5px 10px', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer',
                                                    fontWeight: '700',
                                                    fontSize: '0.78rem'
                                                }}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button 
                                            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            style={{ 
                                                border: '1.5px solid var(--border-color)', 
                                                backgroundColor: 'var(--card-bg)', 
                                                color: 'var(--text-secondary)',
                                                padding: '5px 10px', 
                                                borderRadius: '8px', 
                                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                opacity: currentPage === totalPages ? 0.5 : 1
                                            }}
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .captured-moment-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                }
                .captured-moment-card:hover .moment-img {
                    transform: scale(1.05);
                }
                body.dark .captured-moment-card:hover {
                    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
                }
            `}</style>
        </div>
    );
};

export default PrincipalGallery;
