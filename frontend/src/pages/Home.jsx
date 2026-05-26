import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
    Phone, Mail, MapPin, Instagram, Facebook, Award, BookOpen, Users, 
    GraduationCap, CheckCircle2, ChevronLeft, ChevronRight, Monitor, 
    Sparkles, Calendar, ArrowRight, Play, Send, Star, Clock 
} from 'lucide-react';
import { ScrollToTop } from '../components/GlobalUI';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageSlider from '../components/ImageSlider';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [schoolSettings, setSchoolSettings] = useState(null);
    const [toppers, setToppers] = useState([]);
    const [founder, setFounder] = useState(null);
    const [moments, setMoments] = useState([]);
    
    // Gallery Tab Filter
    const [activeGalleryTab, setActiveGalleryTab] = useState('All');
    
    // Horizontal scroll ref for Events slider
    const eventsScrollRef = useRef(null);

    // Form inputs state
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    // Cross-page hash scroll trigger
    useEffect(() => {
        if (location.state?.scrollTo) {
            const selector = location.state.scrollTo;
            setTimeout(() => {
                const el = document.querySelector(selector);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', selector);
                }
            }, 100);
            // Clear state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const fetchData = async () => {
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const [notifRes, galleryRes, settingsRes, topperRes, founderRes, momentRes] = await Promise.all([
                axios.get(`${apiBase}/api/public/notifications`),
                axios.get(`${apiBase}/api/public/gallery`),
                axios.get(`${apiBase}/api/public/settings`),
                axios.get(`${apiBase}/api/public/toppers`),
                axios.get(`${apiBase}/api/public/founder`),
                axios.get(`${apiBase}/api/public/moments`)
            ]);
            setNotifications(notifRes.data);
            setGallery(galleryRes.data);
            setSchoolSettings(settingsRes.data);
            setToppers(topperRes.data);
            setFounder(founderRes.data);
            setMoments(momentRes.data);
        } catch (err) { 
            console.error('Error fetching home page data:', err); 
        }
    };

    const getPicUrl = (path, fallback) => {
        if (!path) return fallback || '';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    // Filter gallery based on tab
    const getFilteredGallery = () => {
        if (activeGalleryTab === 'All') return gallery.slice(0, 6);
        return gallery.filter(item => {
            const category = item.category?.toLowerCase() || '';
            if (activeGalleryTab === 'Events') return category === 'events' || category === 'functions';
            if (activeGalleryTab === 'Activities') return category === 'activities';
            if (activeGalleryTab === 'Campus') return category === 'campus' || category === 'environment';
            if (activeGalleryTab === 'Achievements') return category === 'achievements';
            return true;
        }).slice(0, 6);
    };

    // Fallback static data if database collections are empty
    const defaultToppers = [
        { _id: 't1', studentName: 'Tanu Kumari', className: '10', percentage: 95, imageUrl: '', stream: 'Science' },
        { _id: 't2', studentName: 'Anjali Singh', className: '12', percentage: 93, imageUrl: '', stream: 'Commerce' },
        { _id: 't3', studentName: 'Rohit Verma', className: '12', percentage: 92, imageUrl: '', stream: 'Science' },
        { _id: 't4', studentName: 'Sneha Yadav', className: '10', percentage: 91, imageUrl: '', stream: 'English Medium' }
    ];

    const defaultMoments = [
        { title: 'Annual Function 2024', description: 'A day full of spectacular performances, art showcases, and academic celebrations.', imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600' },
        { title: 'Sports Day', description: 'Promoting fitness, healthy sportsmanship, athletics, and teamwork across all houses.', imageUrl: 'https://images.unsplash.com/photo-1569930761250-7164ff9c6f2e?auto=format&fit=crop&w=600' },
        { title: 'Cultural Fest', description: 'Showcasing diverse talents, traditional dances, poetry, and creativity of our students.', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600' },
        { title: 'Science Exhibition', description: 'Encouraging innovation, logic, and curiosity with practical working models.', imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600' }
    ];

    const displayToppers = toppers.length > 0 ? toppers : defaultToppers;
    const displayMoments = moments.length > 0 ? moments : defaultMoments;

    // Scroll handlers for Events slider
    const scrollEvents = (direction) => {
        if (eventsScrollRef.current) {
            const { scrollLeft, clientWidth } = eventsScrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth * 0.5 
                : scrollLeft + clientWidth * 0.5;
            eventsScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // Contact Form Submission Handler
    const handleContactSubmit = (e) => {
        e.preventDefault();
        setFormStatus('sending');
        setTimeout(() => {
            setFormStatus('success');
            setContactForm({ name: '', email: '', phone: '', message: '' });
        }, 1500);
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh', fontFamily: "'Outfit', sans-serif", transition: 'background-color 0.3s ease, color 0.3s ease' }}>
            <Navbar />
            
            {/* 1. Dynamic Notification Announcement Ticker */}
            {notifications.length > 0 && (
                <div style={{ background: 'linear-gradient(to right, var(--secondary), #991b1b)', color: 'white', padding: '0.65rem 0', zIndex: 99, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <marquee scrollamount="5" style={{ display: 'flex', alignItems: 'center' }}>
                        {notifications.map(n => (
                            <span key={n._id} style={{ marginRight: '5rem', fontWeight: '700', fontSize: '0.92rem', letterSpacing: '0.5px' }}>
                                📢 {n.type.toUpperCase()}: {n.message}
                            </span>
                        ))}
                    </marquee>
                </div>
            )}

            <main style={{ paddingBottom: '0' }}>
                
                {/* 2. Hero Section */}
                <section style={{ padding: '4rem 10% 5rem', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                        {/* Hero Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontWeight: '700', fontSize: '0.88rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                                <Sparkles size={16} /> Excellence. Morality. Ambition.
                            </div>
                            <h1 style={{ fontSize: '3.6rem', color: 'var(--primary)', lineHeight: '1.1', fontWeight: '900', margin: 0, transition: 'color 0.3s ease', letterSpacing: '-1.5px' }}>
                                Nurturing Minds.<br />
                                <span style={{ color: 'var(--secondary)' }}>Building Futures.</span>
                            </h1>
                            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0, maxWidth: '520px', transition: 'color 0.3s ease' }}>
                                Empowering young minds with quality education, strong moral values and a progressive vision for tomorrow. holistically recognized in both Hindi and English mediums.
                            </p>
                            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => navigate('/about')}
                                    style={{ padding: '0.85rem 2rem', borderRadius: '50px', fontSize: '0.95rem', fontWeight: '700', boxShadow: '0 6px 20px rgba(26,42,108,0.2)' }}
                                >
                                    Explore Our Campus
                                </button>
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => navigate('/admission')}
                                    style={{ padding: '0.85rem 2rem', borderRadius: '50px', fontSize: '0.95rem', fontWeight: '700', border: '1.5px solid var(--border-color)' }}
                                >
                                    Admissions Open
                                </button>
                            </div>
                        </motion.div>

                        {/* Hero Slider */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.1)' }}
                        >
                            <ImageSlider />
                        </motion.div>
                    </div>

                    {/* Quick Metrics Stats Block */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                            gap: '1.5rem',
                            marginTop: '2.5rem',
                            backgroundColor: 'var(--card-bg)',
                            padding: '2rem',
                            borderRadius: '20px',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {[
                            { value: '30+', label: 'Years of Excellence', icon: <Award size={24} color="var(--primary)" /> },
                            { value: '5000+', label: 'Active Students', icon: <Users size={24} color="var(--secondary)" /> },
                            { value: '100+', label: 'Expert Faculty', icon: <GraduationCap size={24} color="var(--accent)" /> },
                            { value: '2', label: 'Spacious Campuses', icon: <MapPin size={24} color="#138808" /> }
                        ].map((stat, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRight: idx !== 3 ? '1px solid var(--border-color)' : 'none', paddingRight: '1rem', transition: 'border-color 0.3s ease' }} className="hero-stat-col">
                                <div style={{ background: 'var(--bg-light)', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stat.value}</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* 3. Founder's Vision Section (Removed General About Us from Home) */}
                <section style={{ padding: '5rem 10%', backgroundColor: 'var(--navbar-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(26,42,108,0.08)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                            Our Leadership
                        </div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: 0 }}>Founder's Vision</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>The inspiring mind and principles behind our educational journey.</p>
                    </div>

                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px',
                        padding: '3rem',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr',
                        gap: '3rem',
                        alignItems: 'center',
                        transition: 'all 0.3s ease'
                    }} className="founder-grid-row">
                        {/* Founder Image Frame */}
                        <div style={{ position: 'relative', textAlign: 'center' }}>
                            <img 
                                src={getPicUrl(founder?.imageUrl, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500')} 
                                alt={founder?.name || "Founder"} 
                                style={{ width: '220px', height: '220px', borderRadius: '24px', objectFit: 'cover', border: '5px solid var(--bg-light)', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }} 
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '-15px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                                color: 'white',
                                padding: '0.4rem 1.2rem',
                                borderRadius: '30px',
                                fontSize: '0.78rem',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                whiteSpace: 'nowrap'
                            }}>
                                Our Founder
                            </div>
                        </div>

                        {/* Founder Message & Stats */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                            <div>
                                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: '800' }}>
                                    {founder?.name || 'Krishn Kumar Bajpai'}
                                </h3>
                                <p style={{ margin: 0, color: 'var(--secondary)', fontWeight: '700', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Founder & Visionary
                                </p>
                            </div>
                            
                            <blockquote style={{ 
                                fontStyle: 'italic', 
                                color: 'var(--text-secondary)', 
                                fontSize: '1.15rem', 
                                lineHeight: '1.7', 
                                margin: 0,
                                borderLeft: '4px solid var(--secondary)',
                                paddingLeft: '1.2rem'
                            }}>
                                "{founder?.message || 'Education is the most powerful weapon which you can use to change the world. At KDKL, our dream is to impart not just intellect, but profound character.'}"
                            </blockquote>

                            {/* Inner mini stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                                {[
                                    { value: '30+', label: 'Years of Legacy' },
                                    { value: '50K+', label: 'Alumni Globally' },
                                    { value: '2', label: 'Campuses' },
                                    { value: '100%', label: 'Commitment' }
                                ].map((fs, idx) => (
                                    <div key={idx} style={{ textAlign: 'left' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>{fs.value}</h4>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{fs.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Academics Section */}
                <section id="academics" style={{ padding: '6rem 10%', scrollMarginTop: '80px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
                        {/* Title Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                            <div style={{ display: 'inline-block', background: 'rgba(178,31,31,0.08)', color: 'var(--secondary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', width: 'max-content', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Academics
                            </div>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: 0, lineHeight: '1.2' }}>
                                Holistic Education for<br/>Overall Development
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                                We provide a comprehensive curriculum designed to foster academic excellence, deep logical creativity, and critical, real-world analytical thinking across all key standards.
                            </p>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => navigate('/fee-structure')}
                                style={{ padding: '0.75rem 1.6rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', width: 'max-content', marginTop: '0.5rem' }}
                            >
                                Our Curriculum
                            </button>
                        </div>

                        {/* Image Right */}
                        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0,0,0,0.05)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800" 
                                alt="Academics" 
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }} 
                            />
                        </div>
                    </div>

                    {/* Academic 4 Grid Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'Smart Classes', desc: 'Modern digital classrooms equipped with state-of-the-art interactive systems.', icon: <Monitor size={28} color="var(--primary)" /> },
                            { title: 'Experienced Faculty', desc: 'Highly qualified, warm and dedicated educators committed to student growth.', icon: <Users size={28} color="var(--secondary)" /> },
                            { title: 'Practical Learning', desc: 'Hands-on practical experiments and laboratory projects across subjects.', icon: <Award size={28} color="var(--accent)" /> },
                            { title: 'Career Guidance', desc: 'Helping senior students align ambition with robust resources and counseling.', icon: <GraduationCap size={28} color="#138808" /> }
                        ].map((card, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                style={{
                                    backgroundColor: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '20px',
                                    padding: '2.5rem 2rem',
                                    textAlign: 'left',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.2rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ background: 'var(--bg-light)', padding: '0.85rem', borderRadius: '12px', width: 'max-content', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {card.icon}
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>{card.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', transition: 'color 0.3s ease' }}>{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 5. Our Campus Highlights */}
                <section id="campus" style={{ padding: '6rem 10%', backgroundColor: 'var(--navbar-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.3s ease, border-color 0.3s ease', scrollMarginTop: '80px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
                        {/* Campus Left */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                            <div style={{ display: 'inline-block', background: 'rgba(19,136,8,0.08)', color: '#138808', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', width: 'max-content', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Our Campus
                            </div>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: 0, lineHeight: '1.2' }}>
                                A Perfect Blend of<br/>Learning & Environment
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                                Our massive campus environments are built to accommodate standard athletic grids, digital learning hubs, and secure residential quarters.
                            </p>

                            {/* Checklist of 6 */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                                {[
                                    'Spacious & Green Campus',
                                    'Smart Classrooms',
                                    'Well Equipped Labs',
                                    'Library & Digital Resources',
                                    'Sports & Recreation',
                                    'Safe & Secure Environment'
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle2 size={18} color="#138808" style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: '600' }}>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn btn-primary" style={{ padding: '0.75rem 1.6rem', borderRadius: '8px' }}>
                                    Virtual Tour
                                </button>
                                <button className="btn btn-secondary" style={{ width: '42px', height: '42px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Play size={16} fill="var(--primary)" color="var(--primary)" style={{ marginLeft: '2px' }} />
                                </button>
                            </div>
                        </div>

                        {/* Campus Right */}
                        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0,0,0,0.06)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1607237138185-eedd996ece57?auto=format&fit=crop&w=800" 
                                alt="Modern School Building" 
                                style={{ width: '100%', height: '360px', objectFit: 'cover' }} 
                            />
                        </div>
                    </div>

                    {/* Campus grid bottom gallery row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {gallery.filter(item => item.category === 'Environment' || item.category === 'Campus').slice(0, 4).map((img, idx) => (
                            <div key={img._id || idx} style={{ height: '140px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
                                <img src={getPicUrl(img.imageUrl, 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=500')} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                            </div>
                        ))}
                        {gallery.filter(item => item.category === 'Environment' || item.category === 'Campus').length === 0 && (
                            [
                                'https://images.unsplash.com/photo-1523050853051-f750c7582efd?auto=format&fit=crop&w=400',
                                'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400',
                                'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400',
                                'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=400'
                            ].map((url, idx) => (
                                <div key={idx} style={{ height: '140px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
                                    <img src={url} alt="Campus view" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 6. Gallery Segment */}
                <section style={{ padding: '6rem 10%' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(26,42,108,0.08)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                            Gallery
                        </div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: 0 }}>Glimpses of Campus Life</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Snapshots celebrating student activity, sports, culture, and achievements.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
                        {['All', 'Events', 'Activities', 'Campus', 'Achievements'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveGalleryTab(tab)}
                                style={{
                                    padding: '0.6rem 1.4rem',
                                    borderRadius: '50px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    border: '1.5px solid var(--border-color)',
                                    backgroundColor: activeGalleryTab === tab ? 'var(--primary)' : 'var(--card-bg)',
                                    color: activeGalleryTab === tab ? 'white' : 'var(--text-primary)',
                                    boxShadow: activeGalleryTab === tab ? '0 4px 12px rgba(26,42,108,0.15)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
                        {getFilteredGallery().map((img, idx) => (
                            <motion.div
                                layout
                                key={img._id || idx}
                                style={{
                                    position: 'relative',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    height: '240px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.04)'
                                }}
                            >
                                <img 
                                    src={getPicUrl(img.imageUrl, 'https://images.unsplash.com/photo-1523050853051-f750c7582efd?auto=format&fit=crop&w=500')} 
                                    alt={img.title || "Gallery Photo"} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                                    padding: '1.2rem',
                                    color: 'white',
                                    textAlign: 'left'
                                }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>{img.title || 'Campus Moment'}</h4>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{img.category || 'General'}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/gallery')} style={{ padding: '0.75rem 2rem', borderRadius: '8px' }}>
                            View More Photos
                        </button>
                    </div>
                </section>

                {/* 7. Toppers Section */}
                <section style={{ padding: '6rem 10%', backgroundColor: 'var(--navbar-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(253,187,45,0.12)', color: 'var(--accent)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                            Our Toppers
                        </div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: 0 }}>Celebrating Academic Achievers</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Saluting our brilliant stars who set benchmark scores in examination cycles.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {displayToppers.map((t, idx) => {
                            const colors = ['#f59e0b', '#94a3b8', '#b45309', 'var(--primary)'];
                            const rankNames = ['1st', '2nd', '3rd', '4th'];
                            return (
                                <motion.div
                                    key={t._id || idx}
                                    whileHover={{ y: -8 }}
                                    style={{
                                        backgroundColor: 'var(--card-bg)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '24px',
                                        padding: '2.5rem 2rem',
                                        width: '240px',
                                        textAlign: 'center',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.03)',
                                        position: 'relative',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: colors[idx] || 'var(--primary)',
                                        color: '#ffffff',
                                        fontSize: '0.8rem',
                                        fontWeight: '800',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        {rankNames[idx] || `${idx + 1}th`}
                                    </div>

                                    <div style={{
                                        background: 'rgba(253,187,45,0.15)',
                                        color: 'var(--accent)',
                                        padding: '0.35rem 0.9rem',
                                        borderRadius: '30px',
                                        fontWeight: '800',
                                        fontSize: '0.88rem',
                                        width: 'max-content',
                                        margin: '0 auto 1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Star size={14} fill="var(--accent)" /> {t.percentage}%
                                    </div>

                                    <img 
                                        src={getPicUrl(t.imageUrl, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300')} 
                                        alt={t.studentName} 
                                        style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.2rem', border: '4px solid var(--bg-light)', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }} 
                                    />
                                    
                                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.3rem 0', fontWeight: '800' }}>{t.studentName}</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Class {t.className} {t.stream ? `| ${t.stream}` : ''}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* 8. Events & Functions Section */}
                <section style={{ padding: '6rem 10%', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem', textAlign: 'left' }}>
                        <div>
                            <div style={{ display: 'inline-block', background: 'rgba(178,31,31,0.08)', color: 'var(--secondary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                                Events & Functions
                            </div>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: 0 }}>Celebrating Milestones</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Glimpses into the colorful and dynamic academic milestones at KDKL.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <button onClick={() => scrollEvents('left')} style={{ width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-light)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--card-bg)'}>
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={() => scrollEvents('right')} style={{ width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-light)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--card-bg)'}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div 
                        ref={eventsScrollRef}
                        style={{ 
                            display: 'flex', 
                            gap: '2rem', 
                            overflowX: 'auto', 
                            paddingBottom: '2.5rem', 
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                        className="hide-scrollbar"
                    >
                        {displayMoments.map((mom, idx) => (
                            <div 
                                key={mom._id || idx}
                                style={{
                                    flex: '0 0 350px',
                                    scrollSnapAlign: 'start',
                                    backgroundColor: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                    textAlign: 'left',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'none'}
                            >
                                <div style={{ height: '220px', overflow: 'hidden' }}>
                                    <img src={getPicUrl(mom.imageUrl, 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500')} alt={mom.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: '800' }}>
                                        <Calendar size={14} /> SCHOOL CELEBRATION
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0, fontWeight: '800' }}>{mom.title}</h3>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', transition: 'color 0.3s ease' }}>{mom.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 9. Admission Process Section */}
                <section style={{ padding: '6rem 10%', backgroundColor: 'var(--navbar-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(19,136,8,0.08)', color: '#138808', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                            Enrollment
                        </div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: 0 }}>Admission Process</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Simple sequential guidelines to secure enrollment of your child.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', position: 'relative', marginBottom: '4rem' }}>
                        {[
                            { step: '01', title: 'Apply Online', desc: 'Securely submit application details online using our parent admissions portal.' },
                            { step: '02', title: 'Counseling', desc: 'Engage with our career and academic guides to map correct learning mediums.' },
                            { step: '03', title: 'Document Submission', desc: 'Upload previous report cards, identity cards and address proofs.' },
                            { step: '04', title: 'Confirmation', desc: 'Collect confirm allotment certificates and welcome kit on payment receipt.' }
                        ].map((pr, idx) => (
                            <div key={idx} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', position: 'relative' }}>
                                {idx !== 3 && (
                                    <div className="progress-connector-line" style={{
                                        position: 'absolute',
                                        top: '32px',
                                        left: 'calc(50% + 45px)',
                                        width: 'calc(100% - 90px)',
                                        height: '2px',
                                        borderTop: '2px dashed var(--border-color)',
                                        zIndex: 1
                                    }}></div>
                                )}

                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                                    position: 'relative',
                                    zIndex: 2
                                }}>
                                    {pr.step}
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>{pr.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '200px' }}>{pr.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        color: 'white',
                        borderRadius: '24px',
                        padding: '3rem 4rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '2rem',
                        textAlign: 'left'
                    }} className="admission-banner-row">
                        <div>
                            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Limit Seats Available
                            </span>
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: '0.8rem 0 0.2rem 0' }}>
                                Admissions Open for {schoolSettings?.admissionCloudText || '2026-27'}
                            </h3>
                            <p style={{ margin: 0, opacity: 0.85, fontSize: '1.05rem' }}>Empower your child with rich opportunities. Register now!</p>
                        </div>
                        <button 
                            className="btn" 
                            onClick={() => navigate('/admission')}
                            style={{ backgroundColor: '#ffffff', color: 'var(--primary)', padding: '0.9rem 2.2rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '800', transition: 'all 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Apply Now
                        </button>
                    </div>
                </section>

                {/* 10. Get In Touch / Contact Section */}
                <section id="contact" style={{ padding: '6rem 10%', scrollMarginTop: '80px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(178,31,31,0.08)', color: 'var(--secondary)', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                            Contact Us
                        </div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', margin: 0 }}>Get In Touch</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>We are always here to answer questions. Send us a message!</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'stretch' }}>
                        
                        {/* Contact Info Column */}
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '24px',
                            padding: '3rem 2.5rem',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '2.5rem',
                            textAlign: 'left',
                            transition: 'all 0.3s ease'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: '0 0 0.8rem 0', fontWeight: '800' }}>Contact Details</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>Reach our school administration board for fast confirmations.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                                    <div style={{ background: 'rgba(26,42,108,0.08)', padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin color="var(--primary)" size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-secondary)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>School Address</h4>
                                        <p style={{ margin: 0, fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: '600' }}>{schoolSettings?.address || 'Main Road, New Delhi, 110001'}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                                    <div style={{ background: 'rgba(178,31,31,0.08)', padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone color="var(--secondary)" size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-secondary)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Phone Lines</h4>
                                        <p style={{ margin: 0, fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: '700' }}>{schoolSettings?.phone1 || '+91 9816543210'}</p>
                                        {schoolSettings?.phone2 && <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: '700' }}>{schoolSettings.phone2}</p>}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                                    <div style={{ background: 'rgba(19,136,8,0.08)', padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Mail color="#138808" size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-secondary)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Email Address</h4>
                                        <p style={{ margin: 0, fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: '700', wordBreak: 'break-all' }}>{schoolSettings?.email || 'kdkl.shastri@gmail.com'}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                                <Clock size={16} /> Mon - Sat: 8:00 AM - 4:00 PM
                            </div>
                        </div>

                        {/* Interactive Form Column */}
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '24px',
                            padding: '3rem 2.5rem',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.02)',
                            transition: 'all 0.3s ease'
                        }}>
                            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: '800' }}>Send Us Message</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 0.5rem 0' }}>Drop a line and our representatives will reach you within 24 hours.</p>
                                
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="Your Name"
                                        required
                                        value={contactForm.name}
                                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                <div>
                                    <input 
                                        type="email" 
                                        placeholder="Your Email"
                                        required
                                        value={contactForm.email}
                                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                <div>
                                    <input 
                                        type="tel" 
                                        placeholder="Phone Number"
                                        required
                                        value={contactForm.phone}
                                        onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                <div>
                                    <textarea 
                                        placeholder="Your Message"
                                        required
                                        rows="4"
                                        value={contactForm.message}
                                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                                        className="form-input"
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={formStatus === 'sending'}
                                    className="btn btn-primary"
                                    style={{ padding: '0.85rem', width: '100%', borderRadius: '8px', gap: '8px', fontSize: '0.95rem', fontWeight: '700' }}
                                >
                                    {formStatus === 'sending' ? 'Sending...' : (
                                        <>Send Message <Send size={16} /></>
                                    )}
                                </button>

                                {formStatus === 'success' && (
                                    <div style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>
                                        ✓ Message sent successfully! We will contact you soon.
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Shorter, well-balanced Map container */}
                        <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 15px 35px rgba(0,0,0,0.02)', height: '100%' }}>
                            <iframe 
                                title="School Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9961623862215!2d77.21832181508272!3d28.62986298241857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd380fffffff%3A0x6bbf6f5f9e2e6005!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1653812615438!5m2!1sen!2sin" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, height: '280px', minHeight: '280px' }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <ScrollToTop />
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .form-input {
                    padding: 0.8rem 1rem !important;
                    border: 1.5px solid var(--border-color) !important;
                    border-radius: 8px !important;
                    background-color: var(--bg-light) !important;
                    color: var(--text-primary) !important;
                    width: 100% !important;
                    font-size: 0.95rem !important;
                    font-family: inherit !important;
                    transition: border-color 0.2s, box-shadow 0.2s !important;
                }
                .form-input:focus {
                    outline: none !important;
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1) !important;
                }
                body.dark .form-input:focus {
                    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.2) !important;
                    background-color: var(--card-bg) !important;
                }
                @media (max-width: 1024px) {
                    main section { padding: 4rem 5% !important; }
                    .hero-stat-col { border-right: none !important; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; padding-right: 0 !important; }
                    .progress-connector-line { display: none !important; }
                    .founder-grid-row { grid-template-columns: 1fr !important; gap: 2rem !important; padding: 2rem !important; }
                }
                @media (max-width: 768px) {
                    main section { padding: 3rem 5% !important; }
                    .premium-text { font-size: 2.2rem !important; }
                    .admission-banner-row { padding: 2rem !important; justify-content: center !important; text-align: center !important; }
                    .admission-banner-row h3 { font-size: 1.6rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Home;
