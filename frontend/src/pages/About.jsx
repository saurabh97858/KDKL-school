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
                const [founderRes, principalRes, teachersRes] = await Promise.all([
                    axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/founder'),
                    axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/principal'),
                    axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/teachers')
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
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="premium-light-page" style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, transition: 'background-color 0.3s ease, color 0.3s ease' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '1rem', color: '#1a2a6c', fontWeight: '600' }}>Loading School Legacy...</p>
                    </div>
                ) : (
                    <div style={{ flex: 1, position: 'relative' }}>
                        {/* Aesthetic Light Blobs */}
                    <div className="bg-blob blob-1"></div>
                    <div className="bg-blob blob-2"></div>
                    <div className="bg-blob blob-3"></div>

                    <div className="intro-section light-glass-panel">
                        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                            <h1 className="main-title text-navy">A Legacy of Excellence</h1>
                            <div className="divider-line crimson-bg"></div>
                            <p className="intro-subtitle text-slate">
                                Nurturing minds and building futures for decades with an unwavering commitment to integrity and quality education.
                            </p>
                        </motion.div>
                    </div>

                    <div className="content-wrapper">
                        {/* Founder Section */}
                        <motion.div 
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
                            className="leadership-section founder-layout"
                        >
                            <div className="leadership-image-wrapper">
                                <div className="image-accent-border nav-border"></div>
                                <img 
                                    src={founder?.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${founder.imageUrl}` : ''} 
                                    alt="The Founder" 
                                    className="leadership-image"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                {!founder?.imageUrl && (
                                     <div style={{ width: '100%', height: '400px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px' }}>
                                         <User size={80} color="var(--text-secondary)" />
                                     </div>
                                 )}
                                <div className="founder-badge light-glass-heavy">
                                    <h3 className="text-navy">{founder?.name || 'KK BAJPAI'}</h3>
                                    <span className="text-crimson">Founder & Visionary</span>
                                </div>
                            </div>

                            <div className="leadership-text-content">
                                <Quote size={80} color="rgba(178, 31, 31, 0.08)" className="quote-icon-bg" />
                                <h4 className="section-kicker text-crimson">Our Founder</h4>
                                <h2 className="section-heading text-navy">The Visionary Behind <span className="text-accent">KDKL</span></h2>
                                <p className="leadership-bio text-slate">
                                    {founder?.message || "Our institution was founded on the principle that every child deserves access to premium education. We strive to blend traditional values with modern pedagogical techniques to create well-rounded individuals ready to conquer the challenges of tomorrow."}
                                </p>
                                <div className="achievement-list">
                                    <div className="achievement-item"><ChevronRight color="#b21f1f" size={20}/> Decades of Educational Impact</div>
                                    <div className="achievement-item"><ChevronRight color="#b21f1f" size={20}/> Fostering Holistic Development</div>
                                    <div className="achievement-item"><ChevronRight color="#b21f1f" size={20}/> Community Focused Learning</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Leadership Sections */}
                        {principals && principals.map((prin, idx) => (
                            <motion.div 
                                key={prin._id || idx}
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
                                className="leadership-section principal-layout light-glass-heavy"
                            >
                                <div className="leadership-text-content principal-content">
                                    <h4 className="section-kicker text-crimson">Meet Our Leader</h4>
                                    <h2 className="section-heading text-navy">{prin.name}</h2>
                                    
                                    <div className="metrics-grid">
                                        <div className="metric-card light-glass-panel">
                                            <div className="metric-icon bg-crimson-dim"><Award color="#b21f1f" /></div>
                                            <div className="metric-info">
                                                <span className="metric-label text-gray">Designation</span>
                                                <span className="metric-value text-navy">{prin.role}</span>
                                            </div>
                                        </div>
                                        <div className="metric-card light-glass-panel">
                                            <div className="metric-icon bg-blue-dim"><Briefcase color="#1a2a6c" /></div>
                                            <div className="metric-info">
                                                <span className="metric-label text-gray">Experience</span>
                                                <span className="metric-value text-navy">{prin.experience}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="leadership-bio text-slate">
                                        Leading our institution with passion and dedication, ensuring that every student receives the highest quality of education, while maintaining our core values of discipline and innovation.
                                    </p>
                                </div>
                                
                                <div className="leadership-image-wrapper">
                                    <img 
                                        src={prin.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${prin.imageUrl}` : ''} 
                                        alt={prin.name} 
                                        className="leadership-image principal-img"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                     {!prin.imageUrl && (
                                         <div style={{ width: '100%', height: '350px', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', border: '8px solid var(--bg-light)' }}>
                                             <GraduationCap size={60} color="var(--text-secondary)" />
                                         </div>
                                     )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Teachers Section */}
                        <div className="faculty-header">
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                                <h4 className="section-kicker text-center text-crimson">Our Faculty</h4>
                                <h2 className="section-heading text-center text-navy">World-Class Educators</h2>
                                <div className="divider-line center-line crimson-bg"></div>
                            </motion.div>
                        </div>

                        <div className="faculty-grid">
                            {teachers.map((teacher, index) => (
                                <motion.div 
                                    key={teacher._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    className="faculty-card light-glass-panel"
                                >
                                    <div className="card-top-accent theme-gradient"></div>
                                    <div className="avatar-wrapper shadow-light">
                                        <img 
                                            src={teacher.profilePic ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${teacher.profilePic}` : ''} 
                                            alt={teacher.teacherName} 
                                            className="faculty-avatar"
                                            onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + teacher.teacherName}
                                        />
                                    </div>
                                    <h3 className="faculty-name text-navy">{teacher.teacherName}</h3>
                                    <div className="faculty-subject text-crimson">{teacher.subject} Medium: {teacher.medium}</div>
                                    
                                    <div className="faculty-details light-glass-inset">
                                        {teacher.expertIn && (
                                            <div className="detail-item" title="Expert In">
                                                <Award size={16} color="#b21f1f" />
                                                <span style={{ fontWeight: 700, color: '#b21f1f' }}>{teacher.expertIn}</span>
                                            </div>
                                        )}
                                        <div className="detail-item">
                                            <GraduationCap size={16} color="#1a2a6c" />
                                            <span>{teacher.qualification}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Briefcase size={16} color="#1a2a6c" />
                                            <span>{teacher.experience}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />

            <style>{`
                .premium-light-page {
                    background: var(--bg-home);
                    min-height: 100vh;
                    font-family: 'Inter', system-ui, sans-serif;
                    position: relative;
                    overflow-x: hidden;
                    color: var(--text-primary);
                    display: flex;
                    flex-direction: column;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }
                /* Ensure footer is at absolute bottom */
                #root {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .loading-screen {
                    display: flex; justify-content: center; align-items: center; height: 100vh;
                    background: var(--bg-home); color: var(--primary); font-size: 1.5rem; font-weight: bold;
                }
                .bg-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    z-index: 0;
                    opacity: 0.35;
                    animation: floatLight 20s infinite ease-in-out alternate;
                }
                .blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(26,42,108,0.15) 0%, transparent 70%); top: -100px; left: -150px; }
                .blob-2 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(178,31,31,0.1) 0%, transparent 70%); bottom: -100px; right: -200px; animation-delay: -5s; }
                .blob-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%); top: 40%; left: 30%; animation-delay: -10s; }
                
                @keyframes floatLight {
                    0% { transform: translateY(0) scale(1) rotate(0deg); }
                    100% { transform: translateY(-30px) scale(1.05) rotate(5deg); }
                }
                .light-glass-panel {
                    background: var(--glass);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid var(--glass-border);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
                }
                .light-glass-heavy {
                    background: var(--glass);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
                    border-radius: 28px;
                }
                .light-glass-inset {
                    background: var(--bg-light);
                    border: 1px solid var(--border-color);
                }
                .text-navy { color: var(--primary); }
                .text-crimson { color: var(--secondary); font-weight: 600; }
                .text-slate { color: var(--text-secondary); }
                .text-gray { color: var(--text-secondary); }
                .text-accent { color: var(--accent); }

                .intro-section { margin: 6rem auto 1.5rem; max-width: 800px; padding: 2rem 1rem; text-align: center; border-radius: 24px; position: relative; z-index: 10; }
                .main-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; margin: 0; }
                .intro-subtitle { font-size: 1rem; line-height: 1.5; max-width: 600px; margin: 0 auto; }
                .divider-line { height: 4px; width: 60px; margin: 1.2rem auto; border-radius: 2px; }
                .crimson-bg { background: #b21f1f; }
                .content-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 5%; position: relative; z-index: 10; }

                .leadership-section { display: grid; align-items: center; gap: 4rem; margin-bottom: 5rem; }
                .founder-layout { grid-template-columns: 1fr 1.2fr; }
                .principal-layout { grid-template-columns: 1.2fr 1fr; padding: 2rem; border-radius: 30px; }

                .leadership-image-wrapper { position: relative; }
                .leadership-image { width: 100%; border-radius: 24px; object-fit: cover; box-shadow: 0 15px 35px rgba(15,23,42,0.15); position: relative; z-index: 2; }
                .principal-img { border: 8px solid white; }
                .image-accent-border { position: absolute; top: -15px; left: -15px; width: 100%; height: 100%; border-radius: 24px; z-index: 1; }
                .nav-border { border: 3px solid #1a2a6c; box-shadow: inset 0 0 15px rgba(26,42,108,0.1); }
                
                .founder-badge { position: absolute; bottom: -20px; right: -20px; padding: 1rem 1.5rem; z-index: 3; }
                .founder-badge h3 { margin: 0; font-size: 1.2rem; font-weight: 800; }
                .founder-badge span { text-transform: uppercase; letter-spacing: 1px; font-size: 0.75rem; }

                .leadership-text-content { position: relative; }
                .quote-icon-bg { position: absolute; top: -20px; left: -15px; z-index: -1; transform: scale(0.8); }
                .section-kicker { margin: 0 0 0.5rem 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; }
                .section-heading { margin: 0 0 1.2rem 0; font-size: 2.2rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.5px; }
                .leadership-bio { font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem; }

                .achievement-list { display: flex; flex-direction: column; gap: 0.8rem; }
                .achievement-item { display: flex; align-items: center; gap: 0.6rem; font-weight: 600; color: #1e293b; font-size: 0.95rem; }

                .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
                .metric-card { display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem; border-radius: 12px; }
                .metric-icon { padding: 0.6rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
                .bg-crimson-dim { background: rgba(178, 31, 31, 0.1); border: 1px solid rgba(178, 31, 31, 0.2); }
                .bg-blue-dim { background: rgba(26, 42, 108, 0.1); border: 1px solid rgba(26, 42, 108, 0.2); }
                .metric-info { display: flex; flex-direction: column; }
                .metric-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
                .metric-value { font-weight: 700; font-size: 1rem; }

                .faculty-header { margin-bottom: 3rem; }
                .faculty-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 4rem; }
                .faculty-card { padding: 1.5rem 1.5rem; border-radius: 20px; position: relative; text-align: center; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; }
                .card-top-accent { position: absolute; top: 0; left: 0; right: 0; height: 5px; transform: scaleX(0); transition: transform 0.4s ease; transform-origin: left; }
                .theme-gradient { background: linear-gradient(90deg, #1a2a6c, #b21f1f); }
                .faculty-card:hover { transform: translateY(-12px); box-shadow: 0 20px 40px rgba(15,23,42,0.1); }
                .faculty-card:hover .card-top-accent { transform: scaleX(1); }
                
                .avatar-wrapper { position: relative; width: 130px; height: 130px; margin: 0 auto 1.5rem; border-radius: 50%; }
                .shadow-light { box-shadow: 0 8px 25px rgba(26,42,108,0.15); border: 4px solid white; }
                .faculty-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

                .faculty-name { font-size: 1.4rem; margin: 0 0 0.5rem 0; font-weight: 700; }
                .faculty-subject { font-size: 1rem; margin-bottom: 1.5rem; }
                .faculty-details { display: flex; flex-direction: column; gap: 0.6rem; padding: 1rem; border-radius: 12px; }
                .detail-item { display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #475569; font-size: 0.9rem; font-weight: 600; }

                .elegant-footer { background: linear-gradient(to right, #0f172a, #1a2a6c); color: white; padding: 5rem 10% 2rem; text-align: center; position: relative; z-index: 10; margin-top: auto;}
                .elegant-footer h2 { margin: 0 0 1rem 0; font-size: 2rem; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .elegant-footer p { opacity: 0.9; font-size: 1.1rem; max-width: 600px; margin: 0 auto 3rem; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
                .footer-bottom { border-top: 1px solid rgba(255,255,255,0.3); padding-top: 2rem; }
                .footer-bottom p { font-size: 0.9rem; margin: 0; opacity: 0.8; }

                @media (max-width: 1024px) {
                    .founder-layout, .principal-layout { grid-template-columns: 1fr; gap: 3rem; }
                    .principal-layout { display: flex; flex-direction: column-reverse; padding: 2.5rem; }
                    .founder-badge { bottom: -20px; right: 10px; padding: 1rem 1.5rem; }
                    .content-wrapper { padding: 0 5%; }
                }
                @media (max-width: 768px) {
                    .intro-section { margin-top: 5rem; padding: 1.5rem 1rem; margin-bottom: 2rem; }
                    .main-title { font-size: 2.2rem; }
                    .section-heading { font-size: 1.8rem; }
                    .metrics-grid { grid-template-columns: 1fr; }
                    .faculty-grid { grid-template-columns: 1fr; padding: 0 0.5rem; gap: 2rem; }
                    .leadership-bio { font-size: 1rem; text-align: center; }
                    .achievement-list { align-items: center; }
                    .leadership-section { margin-bottom: 4rem; gap: 2.5rem; }
                    .leadership-text-content { text-align: center; }
                    .achievement-item { justify-content: center; }
                    .faculty-card { padding: 1.5rem 1rem; }
                }
            `}</style>
        </div>
    );
};

export default About;
