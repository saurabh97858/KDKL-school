import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, SearchX } from 'lucide-react';
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

    const categories = ['All', 'Events', 'Activities', 'Campus', 'Achievements'];
    
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

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const activeFilteredImages = getFilteredImages();

    return (
        <div style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease, color 0.3s ease', fontFamily: "'Outfit', sans-serif" }}>
            <Navbar />
            
            {loading ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                    <div style={{ border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: '700' }}>Loading School Memories...</p>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                    
                    {/* Header Banner */}
                    <section style={{ padding: '5rem 10% 4rem', textAlign: 'center', position: 'relative' }}>
                        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                            <div style={{ display: 'inline-block', background: 'rgba(26,42,108,0.08)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                                School Chronicles
                            </div>
                            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', margin: '0 0 1rem 0', letterSpacing: '-1px' }}>Discover Our Campus</h1>
                            <div style={{ height: '4px', width: '60px', background: 'var(--secondary)', margin: '1rem auto', borderRadius: '2px' }}></div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.65' }}>
                                Explore the vibrant environments, student activities, festivals, and key scholastic milestones that represent the life at KDKL.
                            </p>
                        </motion.div>
                    </section>

                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 6rem', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        
                        {/* Filter tabs */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}
                        >
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    style={{
                                        padding: '0.65rem 1.6rem',
                                        borderRadius: '50px',
                                        fontWeight: '700',
                                        fontSize: '0.92rem',
                                        cursor: 'pointer',
                                        border: '1.5px solid var(--border-color)',
                                        backgroundColor: filter === cat ? 'var(--primary)' : 'var(--card-bg)',
                                        color: filter === cat ? 'white' : 'var(--text-primary)',
                                        boxShadow: filter === cat ? '0 6px 15px rgba(0,0,0,0.15)' : 'none',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </motion.div>

                        {/* Photos Grid */}
                        {activeFilteredImages.length > 0 ? (
                            <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '2rem' }}>
                                <AnimatePresence mode="popLayout">
                                    {activeFilteredImages.map((img, idx) => (
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
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '24px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            className="gallery-grid-card"
                                        >
                                            <div style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden' }}>
                                                <img 
                                                    src={getPicUrl(img.imageUrl)} 
                                                    alt={img.title} 
                                                    loading="lazy"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                    className="gallery-card-img"
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 60%)',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    padding: '1.5rem',
                                                    opacity: 1
                                                }}>
                                                    <span style={{
                                                        background: 'rgba(255,255,255,0.2)',
                                                        backdropFilter: 'blur(8px)',
                                                        color: 'white',
                                                        padding: '0.4rem 1rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: '700',
                                                        letterSpacing: '0.5px',
                                                        textTransform: 'uppercase',
                                                        border: '1px solid rgba(255,255,255,0.3)'
                                                    }}>{img.category || 'General'}</span>
                                                </div>
                                            </div>
                                            <div style={{ padding: '1.5rem', textAlign: 'left', backgroundColor: 'var(--card-bg)', transition: 'background-color 0.3s' }}>
                                                <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.title}</h3>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>{img.category || 'School Legacy'}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
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
                    transform: translateY(-8px);
                    box-shadow: 0 20px 45px rgba(0,0,0,0.12) !important;
                }
                .gallery-grid-card:hover .gallery-card-img {
                    transform: scale(1.08);
                }
                body.dark .gallery-grid-card:hover {
                    box-shadow: 0 20px 45px rgba(0,0,0,0.3) !important;
                }
            `}</style>
        </div>
    );
};

export default Gallery;
