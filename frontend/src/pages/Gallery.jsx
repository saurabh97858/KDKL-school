import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, SearchX, LayoutGrid, Calendar, Users, Building2, Trophy, Image as ImageIcon } from 'lucide-react';
import { Lightbox, ScrollToTop } from '../components/GlobalUI';
import Footer from '../components/Footer';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/gallery');
                setImages(data);
            } catch (err) { 
                console.error('Error fetching gallery:', err); 
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const categories = [
        { name: 'All', icon: LayoutGrid },
        { name: 'Events', icon: Calendar },
        { name: 'Activities', icon: Users },
        { name: 'Campus', icon: Building2 },
        { name: 'Achievements', icon: Trophy }
    ];
    
    const getFilteredImages = () => {
        if (filter === 'All') return images;
        return images.filter(img => {
            const cat = img.category?.toLowerCase() || '';
            if (filter === 'Events') return cat === 'events' || cat === 'functions';
            if (filter === 'Activities') return cat === 'activities';
            if (filter === 'Campus') return cat === 'campus' || cat === 'environment';
            if (filter === 'Achievements') return cat === 'achievements';
            return cat === filter.toLowerCase();
        });
    };

    const getPicUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    const getPhotoCount = (id) => {
        if (!id) return 12;
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 25) + 12; 
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '12 Jan, 2025';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return '12 Jan, 2025';
        }
    };

    const getCategoryStyles = (categoryName) => {
        const cat = categoryName?.toLowerCase() || '';
        if (cat === 'events' || cat === 'functions') {
            return {
                bg: 'rgba(234, 88, 12, 0.1)',
                text: '#ea580c',
                label: 'EVENT'
            };
        } else if (cat === 'campus' || cat === 'environment') {
            return {
                bg: 'rgba(2, 132, 199, 0.1)',
                text: '#0284c7',
                label: 'CAMPUS'
            };
        } else if (cat === 'activities') {
            return {
                bg: 'rgba(22, 163, 74, 0.1)',
                text: '#16a34a',
                label: 'ACTIVITY'
            };
        } else if (cat === 'achievements') {
            return {
                bg: 'rgba(147, 51, 234, 0.1)',
                text: '#9333ea',
                label: 'ACHIEVEMENT'
            };
        }
        return {
            bg: 'rgba(100, 116, 139, 0.1)',
            text: '#64748b',
            label: categoryName?.toUpperCase() || 'GALLERY'
        };
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const activeFilteredImages = getFilteredImages();

    return (
        <div className="gallery-page-root" style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease, color 0.3s ease', fontFamily: "'Outfit', sans-serif" }}>
            <Navbar />
            
            {loading ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                    <div style={{ border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: '700' }}>Loading School Memories...</p>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                    
                    {/* Header Banner */}
                    <section style={{ padding: '5rem 10% 3.5rem', textAlign: 'center', position: 'relative' }}>
                        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                            <div className="chronicles-badge" style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                background: '#fff3eb', 
                                color: '#d97706', 
                                padding: '0.5rem 1.2rem', 
                                borderRadius: '30px', 
                                fontWeight: '700', 
                                fontSize: '0.8rem', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.8px', 
                                marginBottom: '1.2rem',
                                border: '1px solid rgba(217, 119, 6, 0.15)'
                            }}>
                                🎓 School Chronicles
                            </div>
                            <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 1.2rem 0', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                                Discover Our <span style={{ color: '#ea580c' }}>Campus</span>
                            </h1>
                            <div className="title-divider" style={{ height: '4px', width: '45px', background: '#ea580c', margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
                                Explore the vibrant environments, student activities, festivals, and key scholastic milestones that represent the life at KDKL.
                            </p>
                        </motion.div>
                    </section>

                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 5rem', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        
                        {/* Filter Container Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="gallery-filter-card"
                            style={{ 
                                display: 'flex', 
                                gap: '0.6rem', 
                                justifyContent: 'center', 
                                flexWrap: 'wrap', 
                                marginBottom: '1.5rem',
                                backgroundColor: 'var(--card-bg)',
                                border: '1.5px solid var(--border-color)',
                                padding: '0.6rem',
                                borderRadius: '20px',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
                                alignSelf: 'center'
                            }}
                        >
                            {categories.map(cat => {
                                const IconComponent = cat.icon;
                                const isActive = filter === cat.name;
                                return (
                                    <button 
                                        key={cat.name}
                                        onClick={() => setFilter(cat.name)}
                                        className={`gallery-filter-btn ${isActive ? 'active' : ''}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '0.65rem 1.4rem',
                                            borderRadius: '12px',
                                            fontWeight: '700',
                                            fontSize: '0.92rem',
                                            cursor: 'pointer',
                                            border: 'none',
                                            backgroundColor: isActive ? '#ea580c' : 'transparent',
                                            color: isActive ? 'white' : 'var(--text-secondary)',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        <IconComponent size={16} />
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </motion.div>

                        {/* Photos Grid */}
                        {activeFilteredImages.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                                    <AnimatePresence mode="popLayout">
                                        {activeFilteredImages.map((img, idx) => {
                                            const catStyle = getCategoryStyles(img.category);
                                            return (
                                                <motion.div 
                                                    layout
                                                    key={img._id || idx}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.4 }}
                                                    onClick={() => setLightbox({ open: true, index: idx })}
                                                    style={{
                                                        backgroundColor: 'var(--card-bg)',
                                                        border: '1.5px solid var(--border-color)',
                                                        borderRadius: '24px',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                    }}
                                                    className="gallery-grid-card"
                                                >
                                                    <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                                                        <img 
                                                            src={getPicUrl(img.imageUrl)} 
                                                            alt={img.title} 
                                                            loading="lazy"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                            className="gallery-card-img"
                                                        />
                                                    </div>
                                                    <div style={{ padding: '1.5rem', textAlign: 'left', backgroundColor: 'var(--card-bg)' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            backgroundColor: catStyle.bg,
                                                            color: catStyle.text,
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '6px',
                                                            fontSize: '0.72rem',
                                                            fontWeight: '800',
                                                            letterSpacing: '0.5px',
                                                            marginBottom: '0.8rem'
                                                        }}>{catStyle.label}</span>
                                                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4' }}>{img.title}</h3>
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between', 
                                                            alignItems: 'center',
                                                            borderTop: '1px solid var(--border-color)',
                                                            paddingTop: '1rem',
                                                            fontSize: '0.82rem',
                                                            color: 'var(--text-secondary)'
                                                        }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                                                <Calendar size={14} style={{ opacity: 0.8 }} />
                                                                {formatDate(img.createdAt)}
                                                            </span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                                                <ImageIcon size={14} style={{ opacity: 0.8 }} />
                                                                {getPhotoCount(img._id)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </motion.div>

                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                    <button 
                                        className="view-more-photos-btn"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '0.8rem 2.2rem',
                                            borderRadius: '12px',
                                            border: '2px solid #ea580c',
                                            backgroundColor: 'transparent',
                                            color: '#ea580c',
                                            fontWeight: '700',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s ease'
                                        }}
                                    >
                                        <ImageIcon size={18} />
                                        View More Photos
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{
                                    padding: '5rem 2rem',
                                    textAlign: 'center',
                                    borderRadius: '24px',
                                    backgroundColor: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    margin: '0 auto',
                                    maxWidth: '500px',
                                    width: '100%',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                                }}
                            >
                                <SearchX size={50} color="var(--text-secondary)" />
                                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0, fontWeight: '800' }}>No Moments Found</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>There are currently no photos uploaded in the '{filter}' category.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Lightbox */}
            {lightbox.open && (
                <Lightbox
                    images={activeFilteredImages.map(img => getPicUrl(img.imageUrl))}
                    startIndex={lightbox.index}
                    onClose={() => setLightbox({ open: false, index: 0 })}
                />
            )}
            
            <ScrollToTop />
            <Footer />
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .gallery-grid-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 16px 36px rgba(0,0,0,0.08) !important;
                }
                .gallery-grid-card:hover .gallery-card-img {
                    transform: scale(1.06);
                }
                body.dark .gallery-grid-card:hover {
                    box-shadow: 0 16px 36px rgba(0,0,0,0.25) !important;
                }
                body:not(.dark) .gallery-filter-btn:not(.active):hover {
                    background-color: #f1f5f9 !important;
                    color: #0f172a !important;
                }
                body.dark .gallery-filter-btn:not(.active):hover {
                    background-color: #1e293b !important;
                    color: white !important;
                }
                .view-more-photos-btn:hover {
                    background-color: #ea580c !important;
                    color: white !important;
                    box-shadow: 0 6px 20px rgba(234, 88, 12, 0.25);
                }
                body.dark .chronicles-badge {
                    background: rgba(249, 115, 22, 0.1) !important;
                    color: #f97316 !important;
                    border-color: rgba(249, 115, 22, 0.2) !important;
                }
            `}</style>
        </div>
    );
};

export default Gallery;
