import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, SearchX } from 'lucide-react';
import { Lightbox, ScrollToTop, WhatsAppButton } from '../components/GlobalUI';

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
                console.error(err); 
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const categories = ['All', 'Slider', 'Environment', 'Functions'];
    const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

    const getPicUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="premium-light-page" style={{ backgroundColor: '#fdf6b2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            {loading ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: '#1a2a6c', fontWeight: '600' }}>Loading School Memories...</p>
                </div>
            ) : (
                <>
                {/* Aesthetic Background Blobs */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>

            <div className="gallery-wrapper">
                {/* Intro Segment */}
                <div className="intro-section light-glass-panel">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <Camera size={40} color="#1a2a6c" />
                        </div>
                        <h1 className="main-title text-navy">Discover Our Campus</h1>
                        <div className="divider-line crimson-bg"></div>
                        <p className="intro-subtitle text-slate">
                            Explore the vibrant environment, state-of-the-art facilities, and the unforgettable moments that make up life at KDKL.
                        </p>
                    </motion.div>
                </div>

                {/* Filter Controls */}
                <motion.div 
                    className="filter-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`filter-btn ${filter === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Gallery Grid */}
                {filteredImages.length > 0 ? (
                    <motion.div layout className="gallery-grid">
                        <AnimatePresence>
                            {filteredImages.map((img, idx) => (
                                <motion.div 
                                    layout
                                    key={img._id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                    className="gallery-card light-glass-panel"
                                    onClick={() => setLightbox({ open: true, index: idx })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-top-accent theme-gradient"></div>
                                    <div className="image-wrapper">
                                        <img 
                                            src={getPicUrl(img.imageUrl)} 
                                            alt={img.title} 
                                            loading="lazy"
                                        />
                                        <div className="image-overlay">
                                            <span className="overlay-badge">{img.category}</span>
                                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '2rem', opacity: 0, transition: 'opacity 0.3s' }} className="zoom-icon">🔍</span>
                                        </div>
                                    </div>
                                    <div className="card-info light-info">
                                        <h3 className="text-navy">{img.title}</h3>
                                        <span className="category-tag">{img.category}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="empty-state light-glass-panel"
                    >
                        <SearchX size={50} color="#94a3b8" />
                        <h3 className="text-navy">No Moments Found</h3>
                        <p className="text-slate">There are currently no photos in the '{filter}' category.</p>
                    </motion.div>
                )}
            </div>
            
            {/* Lightbox */}
            {lightbox.open && (
                <Lightbox
                    images={filteredImages.map(img => getPicUrl(img.imageUrl))}
                    startIndex={lightbox.index}
                    onClose={() => setLightbox({ open: false, index: 0 })}
                />
            )}
            <ScrollToTop />
            <WhatsAppButton phone="919999999999" message="Hello! I want to know about KDKL School." />

            <footer className="elegant-footer">
                <h2>KDKL SHASTRI INTER COLLEGE</h2>
                <p>Empowering the next generation with knowledge, morality, and ambition.</p>
                <div className="footer-bottom">
                    <p>&copy; 2026 KDKL. All Rights Reserved.</p>
                </div>
            </footer>

                </>
            )}
            <style>{`
                .premium-light-page {
                    background-color: #fdf6b2;
                    min-height: 100vh;
                    font-family: 'Inter', system-ui, sans-serif;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .loading-state {
                    display: flex; justify-content: center; align-items: center; height: 100vh;
                    background: #fdf6b2; color: #1a2a6c; font-size: 1.5rem; font-weight: bold;
                }

                /* Aesthetic Light Blobs */
                .bg-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    z-index: 0;
                    opacity: 0.35;
                    animation: floatLight 15s infinite ease-in-out alternate;
                }
                .blob-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(26,42,108,0.15) 0%, transparent 70%); top: 0; left: -200px; }
                .blob-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(178,31,31,0.1) 0%, transparent 70%); bottom: 10%; right: -150px; animation-delay: -5s; }
                
                @keyframes floatLight {
                    0% { transform: translateY(0) scale(1) rotate(0deg); }
                    100% { transform: translateY(-30px) scale(1.05) rotate(5deg); }
                }

                /* Light Glassmorphism */
                .light-glass-panel {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
                }

                /* Text Colors */
                .text-navy { color: #1a2a6c; }
                .text-slate { color: #475569; }
                .crimson-bg { background: #b21f1f; }

                /* Intro Section */
                .gallery-wrapper {
                    flex: 1;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 5%;
                    position: relative;
                    z-index: 10;
                    width: 100%;
                }
                .intro-section {
                    margin: 2rem auto 2rem;
                    max-width: 700px;
                    padding: 2rem 1.5rem;
                    text-align: center;
                    border-radius: 24px;
                }
                .main-title { font-size: 3.2rem; font-weight: 800; letter-spacing: -1px; margin: 0; line-height: 1.1; }
                .intro-subtitle { font-size: 1.15rem; line-height: 1.6; max-width: 550px; margin: 0 auto; }
                .divider-line { height: 4px; width: 60px; margin: 1.2rem auto; border-radius: 2px; }

                /* Filter Controls */
                .filter-container {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                }
                .filter-btn {
                    padding: 0.6rem 1.5rem;
                    border-radius: 30px;
                    border: 1px solid rgba(255,255,255,0.6);
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(10px);
                    color: #475569;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .filter-btn:hover {
                    background: rgba(255, 255, 255, 0.9);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
                }
                .filter-btn.active {
                    background: linear-gradient(135deg, #1a2a6c 0%, #3b5998 100%);
                    color: white;
                    border-color: transparent;
                    box-shadow: 0 10px 20px rgba(26, 42, 108, 0.25);
                }

                /* Gallery Grid */
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 2.5rem;
                    margin-bottom: 6rem;
                }
                .gallery-card {
                    padding: 0;
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .card-top-accent {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 5px;
                    transform: scaleX(0);
                    transition: transform 0.4s ease;
                    transform-origin: left;
                    z-index: 5;
                }
                .theme-gradient { background: linear-gradient(90deg, #1a2a6c, #b21f1f); }
                .gallery-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 25px 50px rgba(26,42,108,0.15);
                }
                .gallery-card:hover .card-top-accent { transform: scaleX(1); }
                
                .image-wrapper {
                    position: relative;
                    width: 100%;
                    height: 260px;
                    overflow: hidden;
                }
                .image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .gallery-card:hover .image-wrapper img {
                    transform: scale(1.08);
                }
                
                .image-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 50%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    display: flex;
                    align-items: flex-end;
                    padding: 1.5rem;
                }
                .gallery-card:hover .image-overlay { opacity: 1; }
                
                .overlay-badge {
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(8px);
                    color: white;
                    padding: 0.4rem 1rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    border: 1px solid rgba(255,255,255,0.3);
                }

                .card-info.light-info { padding: 1.5rem; background: white; }
                .card-info h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .category-tag { font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }

                /* Empty State */
                .empty-state {
                    padding: 5rem 2rem;
                    text-align: center;
                    border-radius: 24px;
                    margin-bottom: 6rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .empty-state h3 { font-size: 1.8rem; margin: 0; }
                .empty-state p { font-size: 1.1rem; margin: 0; }

                /* Elegant Footer */
                .elegant-footer { background: linear-gradient(to right, #0f172a, #1a2a6c); color: white; padding: 5rem 10% 2rem; text-align: center; position: relative; z-index: 10; margin-top: auto;}
                .elegant-footer h2 { margin: 0 0 1rem 0; font-size: 2rem; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .elegant-footer p { opacity: 0.9; font-size: 1.1rem; max-width: 600px; margin: 0 auto 3rem; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
                .footer-bottom { border-top: 1px solid rgba(255,255,255,0.3); padding-top: 2rem; }
                .footer-bottom p { font-size: 0.9rem; margin: 0; opacity: 0.8; }

                @media (max-width: 768px) {
                    .intro-section { margin-top: 6rem; padding: 3rem 1.5rem; }
                    .main-title { font-size: 2.8rem; }
                    .filter-container { flex-direction: column; align-items: stretch; padding: 0 2rem; }
                    .filter-btn { text-align: center; }
                }
            `}</style>
        </div>
    );
};

export default Gallery;
