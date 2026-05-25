import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Phone, Mail, MapPin, Instagram, Facebook, Award, BookOpen, Users } from 'lucide-react';
import { ScrollToTop, WhatsAppButton } from '../components/GlobalUI';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageSlider from '../components/ImageSlider';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();
    const [showCloud, setShowCloud] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [schoolSettings, setSchoolSettings] = useState(null);
    const [toppers, setToppers] = useState([]);
    const [moments, setMoments] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [notifRes, galleryRes, settingsRes, topperRes, momentRes] = await Promise.all([
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/notifications'),
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/gallery'),
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/settings'),
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/toppers'),
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/moments')
            ]);
            setNotifications(notifRes.data);
            setGallery(galleryRes.data);
            setSchoolSettings(settingsRes.data);
            setToppers(topperRes.data);
            setMoments(momentRes.data);
        } catch (err) { console.error(err); }
    };

    const functionImages = gallery.filter(item => item.category === 'Functions');

    const getPicUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    return (
        <div style={{ backgroundColor: '#fdf6b2', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
            <Navbar />
            
            {notifications.length > 0 && (
                <div style={{ background: '#b21f1f', color: 'white', padding: '0.6rem 0', zIndex: 999, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <marquee scrollamount="6">
                        {notifications.map(n => (
                            <span key={n._id} style={{ marginRight: '4rem', fontWeight: '700', fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                                📢 {n.type.toUpperCase()}: {n.message}
                            </span>
                        ))}
                    </marquee>
                </div>
            )}

            <main>
                {/* Hero Slider Section */}
                <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                    <ImageSlider />
                    {showCloud && (
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="admission-cloud"
                            onClick={() => navigate('/admission')}
                        >
                            <span style={{ fontWeight: '800' }}>{schoolSettings?.admissionCloudText || 'ADMISSION OPEN 2026-27'}</span>
                            <span 
                                onClick={(e) => { e.stopPropagation(); setShowCloud(false); }}
                                className="cloud-close-btn"
                                title="Close"
                            >✕</span>
                        </motion.div>
                    )}
                </div>

                {/* Welcome Section */}
                <div style={{ padding: '0.5rem 10% 2.5rem', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h1 className="premium-text" style={{ fontSize: '2.4rem', color: '#1a2a6c', marginBottom: '0.8rem', lineHeight: '0.9' }}>
                            KDKL SHASTRI INTER COLLEGE <br/> 
                            <span style={{ fontSize: '1.5rem', opacity: 0.8, display: 'inline-block', marginTop: '-0.2rem' }}>& KAVITA PUBLIC SCHOOL</span>
                        </h1>
                        <div style={{ height: '5px', width: '80px', background: '#b21f1f', margin: '1rem auto' }}></div>
                        <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '900px', margin: '0 auto', lineHeight: '1.8' }}>
                            Nurturing Young Minds with Excellence, Morality, and Ambition. Providing a holistic learning experience in both Hindi & English mediums.
                        </p>
                    </motion.div>
                </div>

                {/* Quick Stats / Highlights */}
                <section style={{ padding: '2rem 10%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {[
                        { icon: <Award size={32} color="#b21f1f" />, title: "Quality Education", desc: "U.P. Board recognized excellence since decades." },
                        { icon: <BookOpen size={32} color="#1a2a6c" />, title: "Dual Medium", desc: "Hindi & English mediums for comprehensive growth." },
                        { icon: <Users size={32} color="#b21f1f" />, title: "Expert Faculty", desc: "Dedicated teachers focused on individual progress." }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -10 }}
                            className="glass-card" 
                            style={{ padding: '2.5rem', textAlign: 'center', background: 'white' }}
                        >
                            <div style={{ marginBottom: '1.5rem' }}>{item.icon}</div>
                            <h3 style={{ color: '#1a2a6c', marginBottom: '0.8rem', fontSize: '1.4rem' }}>{item.title}</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6' }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Toppers Section */}
                {toppers.length > 0 && (
                    <section style={{ padding: '3rem 10%', background: '#fff7ed', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
                                    transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                                    style={{
                                        position: 'absolute',
                                        width: '150px', height: '150px',
                                        borderRadius: '50%',
                                        background: 'rgba(253, 187, 45, 0.15)',
                                        filter: 'blur(50px)',
                                        top: `${20 * i}%`, left: `${25 * i}%`
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
                            <h2 className="premium-text" style={{ fontSize: '2.5rem', color: '#1a2a6c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                <Award color="#fdbb2d" size={40} /> Academic Toppers
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Celebrating our bright stars and their extraordinary achievements.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', position: 'relative', zIndex: 1 }}>
                            {toppers.map(t => (
                                <motion.div key={t._id} whileHover={{ y: -10 }} className="glass-card" style={{ padding: '2rem', background: 'white', textAlign: 'center', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#b21f1f', color: 'white', padding: '5px 12px', borderRadius: '15px', fontWeight: '800', fontSize: '0.9rem' }}>{t.percentage}%</div>
                                    <img src={getPicUrl(t.imageUrl)} alt={t.studentName} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem', border: '5px solid #fdf6b2', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                    <h3 style={{ color: '#1a2a6c', fontSize: '1.4rem', marginBottom: '0.5rem' }}>{t.studentName}</h3>
                                    <p style={{ color: '#64748b', fontWeight: '600' }}>Class {t.className}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* School Moments Section */}
                {moments.length > 0 && (
                    <section style={{ padding: '3rem 10%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                            <div>
                                <h2 className="premium-text" style={{ color: '#1a2a6c', fontSize: '2.5rem', margin: 0 }}>School Moments</h2>
                                <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem' }}>Glimpses into the vibrant life at our campus.</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => navigate('/gallery')}>View All Moments</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
                            {moments.map((item, idx) => (
                                <motion.div 
                                    key={idx} 
                                    whileHover={{ y: -15, boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}
                                    className="glass-card" 
                                    style={{ padding: '0', backgroundColor: 'white', borderRadius: '32px', overflow: 'hidden', border: 'none' }}
                                >
                                    <div style={{ height: '280px', overflow: 'hidden' }}>
                                        <img 
                                            src={getPicUrl(item.imageUrl)} 
                                            alt={item.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <div style={{ padding: '2rem' }}>
                                        <h3 style={{ color: '#1a2a6c', marginBottom: '1rem', fontSize: '1.6rem' }}>{item.title}</h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.8', fontSize: '1.1rem' }}>{item.description || 'Glimpses into the vibrant life at our campus.'}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Campus Environment Section */}
                {gallery.filter(item => item.category === 'Environment').length > 0 && (
                    <section style={{ padding: '3rem 10%', background: '#fff7ed', position: 'relative', overflow: 'hidden' }}>
                         <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
                                    transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut" }}
                                    style={{
                                        position: 'absolute',
                                        width: '120px', height: '120px',
                                        borderRadius: '50%',
                                        background: 'rgba(253, 187, 45, 0.12)',
                                        filter: 'blur(45px)',
                                        bottom: `${25 * i}%`, right: `${25 * i}%`
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                            <h2 className="premium-text" style={{ fontSize: '2.5rem', color: '#1a2a6c' }}>Campus Environment</h2>
                            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Our state-of-the-art facilities and green campus.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', position: 'relative', zIndex: 1 }}>
                            {gallery.filter(item => item.category === 'Environment').map((img) => (
                                <motion.div 
                                    key={img._id}
                                    whileHover={{ scale: 1.05 }}
                                    style={{ borderRadius: '24px', overflow: 'hidden', height: '250px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                >
                                    <img src={getPicUrl(img.imageUrl)} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Events & Functions Section (RTL Marquee) */}
                {gallery.filter(item => item.category === 'Functions').length > 0 && (
                    <section style={{ padding: '4rem 0', background: 'var(--primary)', overflow: 'hidden' }}>
                        <div style={{ padding: '0 10%', marginBottom: '2.5rem' }}>
                            <h2 className="premium-text" style={{ fontSize: '2.5rem', color: '#fff' }}>Events & Functions</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>Celebrating every milestone with joy and enthusiasm.</p>
                        </div>
                        <div style={{ display: 'flex', width: '200%' }}>
                            <div style={{ display: 'flex', gap: '2rem', animation: 'scroll 40s linear infinite' }}>
                                {[...gallery.filter(item => item.category === 'Functions'), ...gallery.filter(item => item.category === 'Functions')].map((img, idx) => (
                                    <div key={idx} style={{ width: '400px', height: '280px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0, border: '5px solid rgba(255,255,255,0.1)' }}>
                                        <img src={getPicUrl(img.imageUrl)} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
                                            <p style={{ margin: 0, fontWeight: '700' }}>{img.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Reach Us Section Refined */}
                <section style={{ padding: '4rem 10%', background: 'linear-gradient(135deg, #fdf6b2 0%, #fffde7 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-40px', left: '15%', right: '15%', height: '80px', background: 'rgba(26, 42, 108, 0.04)', filter: 'blur(35px)', borderRadius: '50%' }}></div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card" 
                            style={{ padding: '3rem', backgroundColor: 'white', borderRadius: '35px', boxShadow: '0 30px 60px rgba(26, 42, 108, 0.08)', border: '1px solid rgba(255,255,255,0.8)' }}
                        >
                            <h2 style={{ marginBottom: '2.5rem', color: '#1a2a6c', fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Get In Touch</h2>
                            
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: 'rgba(178, 31, 31, 0.08)', padding: '0.8rem', borderRadius: '15px' }}>
                                    <MapPin color="#b21f1f" size={28} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.4rem 0', color: '#1a2a6c', fontSize: '1rem' }}>Location</h4>
                                    <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.4', fontWeight: '500' }}>{schoolSettings?.address || 'KDKL Shastri Inter College, Main Road'}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: 'rgba(26, 42, 108, 0.08)', padding: '0.8rem', borderRadius: '15px' }}>
                                    <Phone color="#1a2a6c" size={28} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.4rem 0', color: '#1a2a6c', fontSize: '1rem' }}>Phone</h4>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a2a6c' }}>
                                        <p style={{ margin: 0 }}>{schoolSettings?.phone1 || '+91 99999 88888'}</p>
                                        {schoolSettings?.phone2 && <p style={{ margin: '0.3rem 0 0 0', opacity: 0.8 }}>{schoolSettings.phone2}</p>}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ background: 'rgba(178, 31, 31, 0.08)', padding: '0.8rem', borderRadius: '15px' }}>
                                    <Mail color="#b21f1f" size={28} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.4rem 0', color: '#1a2a6c', fontSize: '1rem' }}>Email</h4>
                                    <p style={{ fontSize: '1.15rem', color: '#1a2a6c', fontWeight: '700' }}>{schoolSettings?.email || 'contact@kdklschool.com'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: 'center', paddingTop: '1.5rem' }}
                        >
                            <div style={{ display: 'inline-block', background: 'rgba(253, 187, 45, 0.12)', padding: '0.6rem 1.8rem', borderRadius: '30px', color: '#1a2a6c', fontWeight: '800', fontSize: '0.8rem', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Social Media</div>
                            <h2 style={{ marginBottom: '2rem', color: '#1a2a6c', fontSize: '3rem', fontWeight: '900' }}>Digital Presence</h2>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem' }}>Stay connected with our latest events, student achievements, and school updates.</p>
                            
                            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                                <motion.a 
                                    whileHover={{ scale: 1.1, translateY: -8 }} 
                                    href={schoolSettings?.instagramUrl || "#"} 
                                    target="_blank" 
                                    style={{ 
                                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', 
                                        color: 'white', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 15px 30px rgba(220, 39, 67, 0.15)' 
                                    }}
                                >
                                    <Instagram size={32} />
                                </motion.a>
                                <motion.a 
                                    whileHover={{ scale: 1.1, translateY: -8 }} 
                                    href={schoolSettings?.facebookUrl || "#"} 
                                    target="_blank" 
                                    style={{ 
                                        background: '#1877F2', 
                                        color: 'white', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 15px 30px rgba(24, 119, 242, 0.15)'
                                    }}
                                >
                                    <Facebook size={32} />
                                </motion.a>
                            </div>
                            
                            <div style={{ marginTop: '4rem', padding: '1.5rem', background: 'rgba(255,255,255,0.4)', borderRadius: '20px', border: '1px dashed rgba(26, 42, 108, 0.15)' }}>
                                <p style={{ margin: 0, color: '#1a2a6c', fontWeight: '700', fontSize: '1rem' }}>Admission Inquiries</p>
                                <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Mon-Sat (8 AM - 4 PM)</p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />

            <ScrollToTop />
            <WhatsAppButton phone={schoolSettings?.phone1 || '919999999999'} message="Hello! I am interested in admission for 2026-27 session." />
            <style>{`
                @media (max-width: 1024px) {
                    main section { padding: 3rem 5% !important; }
                    .premium-text { font-size: 2.2rem !important; }
                }
                @media (max-width: 768px) {
                    main section { padding: 2rem 5% !important; }
                    .premium-text { font-size: 1.8rem !important; }
                    .glass-card { padding: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Home;
