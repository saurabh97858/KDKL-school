import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, BookOpen, Users, GraduationCap, Briefcase, Quote, ChevronRight, User, Trophy } from 'lucide-react';
import Footer from '../components/Footer';

const About = () => {
    const [founder, setFounder] = useState(null);
    const [principals, setPrincipals] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const [founderRes, principalRes, teachersRes] = await Promise.all([
                    axios.get(`${apiBase}/api/public/founder`),
                    axios.get(`${apiBase}/api/public/principal`),
                    axios.get(`${apiBase}/api/public/teachers`)
                ]);
                setFounder(founderRes.data);
                setPrincipals(principalRes.data);
                setTeachers(teachersRes.data);
            } catch (err) { 
                console.error('Error fetching about data:', err); 
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getPicUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease, color 0.3s ease', fontFamily: "'Outfit', sans-serif" }}>
            <Navbar />
            
            {loading ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                    <div style={{ border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: '700' }}>Loading School Legacy...</p>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative' }}>
                    
                    {/* Header Banner */}
                    <section style={{ padding: '5rem 10% 3.5rem', textAlign: 'center', position: 'relative' }}>
                        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                            <div className="bio-tag" style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                background: '#fff3eb', 
                                color: '#d97706', 
                                padding: '0.4rem 1.2rem', 
                                borderRadius: '30px', 
                                fontWeight: '800', 
                                fontSize: '0.8rem', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.8px', 
                                marginBottom: '1.2rem',
                                border: '1px solid rgba(217, 119, 6, 0.15)'
                            }}>
                                📖 School Biography
                            </div>
                            <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 1.2rem 0', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                                A Legacy of Excellence
                            </h1>
                            <div style={{ height: '4px', width: '45px', background: '#ea580c', margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
                                Nurturing young scholars with strong values, dynamic academic parameters and strict discipline since decades.
                            </p>
                        </motion.div>
                    </section>
 
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 6rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                        
                        {/* Founder Spotlight Card matching Screenshot 2 */}
                        <motion.div 
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '3rem',
                                alignItems: 'center',
                                border: '1.5px solid var(--border-color)',
                                padding: '2.5rem',
                                borderRadius: '28px',
                                backgroundColor: 'var(--card-bg)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                            }}
                        >
                            {/* Founder Image block */}
                            <div style={{ position: 'relative', width: '100%', height: '340px' }}>
                                <div style={{ 
                                    position: 'absolute', 
                                    inset: '0', 
                                    border: '1.5px solid #ea580c', 
                                    borderRadius: '20px', 
                                    transform: 'rotate(-2deg)', 
                                    zIndex: 1 
                                }}></div>
                                <img 
                                    src={getPicUrl(founder?.imageUrl)} 
                                    alt={founder?.name || "Our Founder"} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover', 
                                        borderRadius: '20px', 
                                        position: 'relative', 
                                        zIndex: 2,
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.05)'
                                    }}
                                />
                            </div>

                            {/* Founder Content Details & Gold Card */}
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', textAlign: 'left' }}>
                                <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <span style={{ 
                                        display: 'inline-block', 
                                        background: '#dcfce7', 
                                        color: '#15803d', 
                                        padding: '0.3rem 0.8rem', 
                                        borderRadius: '6px', 
                                        fontWeight: '800', 
                                        fontSize: '0.72rem', 
                                        width: 'max-content', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.5px' 
                                    }}>
                                        Our Founder
                                    </span>
                                    
                                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, lineHeight: '1.2' }}>
                                        The Visionary Behind <span style={{ color: '#ea580c' }}>KDKL</span>
                                    </h2>
                                    
                                    <p style={{ color: '#ea580c', fontSize: '1.05rem', fontWeight: '700', fontStyle: 'italic', margin: '0.2rem 0' }}>
                                        “ {founder?.message || 'Jai Hind Jai Bharat.'} ”
                                    </p>
                                    
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0, fontWeight: '500' }}>
                                        Our founder's vision is the foundation of KDKL Shastri Inter College & KPS. His dedication to quality education, discipline and moral values continues to inspire generations of students and educators.
                                    </p>

                                    <button 
                                        style={{ 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '0.65rem 1.4rem', 
                                            border: '1.5px solid #16a34a', 
                                            borderRadius: '8px', 
                                            backgroundColor: 'transparent', 
                                            color: '#16a34a', 
                                            fontWeight: '700', 
                                            fontSize: '0.88rem',
                                            cursor: 'pointer',
                                            width: 'max-content',
                                            transition: 'all 0.2s ease',
                                            marginTop: '0.5rem'
                                        }}
                                        className="founder-about-btn"
                                    >
                                        <User size={16} />
                                        Know More About Our Founder
                                    </button>
                                </div>

                                {/* Right Side Trophy Card */}
                                <div style={{ 
                                    border: '1.5px solid var(--border-color)', 
                                    backgroundColor: 'var(--card-bg)', 
                                    padding: '1.5rem', 
                                    borderRadius: '20px', 
                                    textAlign: 'center', 
                                    width: '180px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    flexShrink: 0,
                                    margin: '0 auto'
                                }} className="excellence-trophy-card">
                                    <div style={{ backgroundColor: '#fff3eb', color: '#ea580c', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}>
                                        <Trophy size={28} />
                                    </div>
                                    <h3 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>25+</h3>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600', lineHeight: '1.4' }}>
                                        Years of Educational Excellence
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Leadership Sections (Principals) */}
                        {principals.map((prin, idx) => (
                            <motion.div 
                                key={prin._id || idx}
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
                                style={{
                                    backgroundColor: 'var(--card-bg)',
                                    border: '1.5px solid var(--border-color)',
                                    borderRadius: '28px',
                                    padding: '2.5rem',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: '3rem',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                                    <div>
                                        <span style={{ display: 'inline-block', background: 'rgba(2,132,199,0.08)', color: '#0284c7', padding: '0.3rem 0.8rem', borderRadius: '6px', fontWeight: '800', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                                            Administration
                                        </span>
                                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{prin.name}</h2>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                            <div style={{ background: '#fff3eb', padding: '0.5rem', borderRadius: '8px', display: 'flex', color: '#ea580c' }}><Award size={18} /></div>
                                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Role</span>
                                                <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{prin.role}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                            <div style={{ background: '#e0f2fe', padding: '0.5rem', borderRadius: '8px', display: 'flex', color: '#0284c7' }}><Briefcase size={18} /></div>
                                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Experience</span>
                                                <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{prin.experience}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0, fontWeight: '500' }}>
                                        Leading our academic branches with deep commitment, ensuring quality education guidelines, character construction, and state level accomplishments.
                                    </p>
                                </div>
                                
                                <div style={{ position: 'relative', textAlign: 'center' }}>
                                    <img 
                                        src={getPicUrl(prin.imageUrl)} 
                                        alt={prin.name} 
                                        style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', borderRadius: '20px', border: '6px solid var(--bg-light)', boxShadow: '0 8px 20px rgba(0,0,0,0.03)' }}
                                    />
                                </div>
                            </motion.div>
                        ))}

                        {/* Teachers/Faculty Grid Section */}
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <span style={{ display: 'inline-block', background: 'rgba(139,92,246,0.08)', color: '#8b5cf6', padding: '0.4rem 1.2rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.8rem' }}>
                                    Our Educators
                                </span>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>World-Class Faculty</h2>
                                <div style={{ height: '4px', width: '45px', background: '#8b5cf6', margin: '0.8rem auto 0', borderRadius: '2px' }}></div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                                {teachers.map((teacher, index) => (
                                    <motion.div 
                                        key={teacher._id || index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        whileHover={{ y: -8 }}
                                        style={{
                                            backgroundColor: 'var(--card-bg)',
                                            border: '1.5px solid var(--border-color)',
                                            borderRadius: '24px',
                                            padding: '2.5rem 1.5rem',
                                            textAlign: 'center',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease'
                                        }}
                                        className="educator-grid-card"
                                    >
                                        <img 
                                            src={teacher.profilePic ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${teacher.profilePic}` : `https://ui-avatars.com/api/?name=${teacher.teacherName}&background=8b5cf6&color=fff`} 
                                            alt={teacher.teacherName} 
                                            style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.2rem', border: '4px solid var(--bg-light)', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}
                                        />
                                        
                                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.3rem 0', fontWeight: '800' }}>{teacher.teacherName}</h3>
                                        <p style={{ margin: '0 0 1.2rem 0', color: '#ea580c', fontWeight: '700', fontSize: '0.88rem' }}>{teacher.subject} | {teacher.medium} Medium</p>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1rem', borderRadius: '16px', backgroundColor: 'var(--bg-light)', border: '1.5px solid var(--border-color)' }}>
                                            {teacher.expertIn && (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: '#ea580c' }}>
                                                    <Award size={14} /> Expert: {teacher.expertIn}
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                                <GraduationCap size={14} /> {teacher.qualification}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                                <Briefcase size={14} /> {teacher.experience} Experience
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <Footer />
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .founder-about-btn:hover {
                    background-color: #16a34a !important;
                    color: white !important;
                }
                .educator-grid-card:hover {
                    box-shadow: 0 16px 35px rgba(0,0,0,0.06) !important;
                }
                body.dark .educator-grid-card:hover {
                    box-shadow: 0 16px 35px rgba(0,0,0,0.25) !important;
                }
                body.dark .bio-tag {
                    background: rgba(249, 115, 22, 0.1) !important;
                    color: #f97316 !important;
                    border-color: rgba(249, 115, 22, 0.2) !important;
                }
            `}</style>
        </div>
    );
};

export default About;
