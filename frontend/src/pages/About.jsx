import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, BookOpen, Users, GraduationCap, Briefcase, Quote, ChevronRight, User } from 'lucide-react';
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
                    <section style={{ padding: '5rem 10% 4rem', textAlign: 'center', position: 'relative' }}>
                        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                            <div style={{ display: 'inline-block', background: 'rgba(26,42,108,0.08)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                                School Biography
                            </div>
                            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', margin: '0 0 1rem 0', letterSpacing: '-1px' }}>A Legacy of Excellence</h1>
                            <div style={{ height: '4px', width: '60px', background: 'var(--secondary)', margin: '1rem auto', borderRadius: '2px' }}></div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.65' }}>
                                Nurturing young scholars with strong values, dynamic academic parameters and strict discipline since decades.
                            </p>
                        </motion.div>
                    </section>

                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 6rem', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                        
                        {/* Founder Spotlight Card */}
                        <motion.div 
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '4rem',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-15px', left: '-15px', width: '100%', height: '100%', border: '3px solid var(--primary)', borderRadius: '24px', zIndex: 1 }}></div>
                                <img 
                                    src={founder?.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${founder.imageUrl}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600'} 
                                    alt={founder?.name || "The Founder"} 
                                    style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 15px 35px rgba(15,23,42,0.1)', position: 'relative', zIndex: 2 }}
                                />
                                <div style={{ 
                                    position: 'absolute', 
                                    bottom: '20px', 
                                    right: '20px', 
                                    backgroundColor: 'var(--card-bg)', 
                                    border: '1px solid var(--border-color)', 
                                    padding: '1rem 1.5rem', 
                                    borderRadius: '16px', 
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                    zIndex: 3,
                                    textAlign: 'left'
                                }}>
                                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>{founder?.name || 'KK BAJPAI'}</h3>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Founder & Visionary</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left', position: 'relative' }}>
                                <div style={{ display: 'inline-block', background: 'rgba(178,31,31,0.08)', color: 'var(--secondary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', width: 'max-content', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                    Our Founder
                                </div>
                                <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, lineHeight: '1.1', letterSpacing: '-0.5px' }}>
                                    The Visionary Behind <span style={{ color: 'var(--accent)' }}>KDKL</span>
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.75', margin: 0 }}>
                                    {founder?.message || "Our institution was founded on the principle that every child deserves access to premium education. We strive to blend traditional values with modern pedagogical techniques to create well-rounded individuals ready to conquer the challenges of tomorrow."}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
                                    {[
                                        'Decades of Educational Impact',
                                        'Fostering Holistic Development',
                                        'Community Focused Value Learning'
                                    ].map((ach, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                            <ChevronRight color="var(--secondary)" size={18} /> {ach}
                                        </div>
                                    ))}
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
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '30px',
                                    padding: '3rem',
                                    boxShadow: '0 20px 45px rgba(0,0,0,0.03)',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: '4rem',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
                                    <div>
                                        <span style={{ display: 'inline-block', background: 'rgba(19,136,8,0.08)', color: '#138808', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                                            Administration
                                        </span>
                                        <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{prin.name}</h2>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                            <div style={{ background: 'rgba(178,31,31,0.08)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}><Award color="var(--secondary)" size={20} /></div>
                                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Role</span>
                                                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{prin.role}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                            <div style={{ background: 'rgba(26,42,108,0.08)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}><Briefcase color="var(--primary)" size={20} /></div>
                                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Experience</span>
                                                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{prin.experience}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                                        Leading our academic branches with deep commitment, ensuring quality education guidelines, character construction, and state level accomplishments.
                                    </p>
                                </div>
                                
                                <div style={{ position: 'relative', textAlign: 'center' }}>
                                    <img 
                                        src={prin.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${prin.imageUrl}` : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500'} 
                                        alt={prin.name} 
                                        style={{ width: '100%', maxHeight: '340px', objectFit: 'cover', borderRadius: '20px', border: '8px solid var(--bg-light)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                                    />
                                </div>
                            </motion.div>
                        ))}

                        {/* Teachers/Faculty Grid Section */}
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                                <span style={{ display: 'inline-block', background: 'rgba(26,42,108,0.08)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.8rem' }}>
                                    Our Educators
                                </span>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '850', color: 'var(--text-primary)', margin: 0 }}>World-Class Faculty</h2>
                                <div style={{ height: '4px', width: '60px', background: 'var(--secondary)', margin: '1rem auto', borderRadius: '2px' }}></div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                                {teachers.map((teacher, index) => (
                                    <motion.div 
                                        key={teacher._id || index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                                        style={{
                                            backgroundColor: 'var(--card-bg)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '24px',
                                            padding: '2.5rem 1.5rem',
                                            textAlign: 'center',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {/* Avatar bubble */}
                                        <img 
                                            src={teacher.profilePic ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${teacher.profilePic}` : `https://ui-avatars.com/api/?name=${teacher.teacherName}&background=0f2b5c&color=fff`} 
                                            alt={teacher.teacherName} 
                                            style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.2rem', border: '4px solid var(--bg-light)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}
                                        />
                                        
                                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.3rem 0', fontWeight: '800' }}>{teacher.teacherName}</h3>
                                        <p style={{ margin: '0 0 1.2rem 0', color: 'var(--secondary)', fontWeight: '700', fontSize: '0.88rem' }}>{teacher.subject} | {teacher.medium} Medium</p>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1rem', borderRadius: '16px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }}>
                                            {teacher.expertIn && (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '750', color: 'var(--secondary)' }}>
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
            `}</style>
        </div>
    );
};

export default About;
