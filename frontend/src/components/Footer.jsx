import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Linkedin, GraduationCap } from 'lucide-react';

const Footer = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/settings');
                setSettings(data);
            } catch (err) {
                console.error('Footer settings fetch error:', err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer style={{ 
            backgroundColor: 'var(--navbar-bg)', 
            borderTop: '1px solid var(--border-color)', 
            color: 'var(--text-primary)', 
            padding: '4.5rem 10% 2rem', 
            margin: '0', 
            width: '100%',
            fontFamily: "'Outfit', sans-serif",
            transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease'
        }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '4rem', textAlign: 'left' }}>
                {/* Column 1: Brand */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <GraduationCap size={36} color="var(--primary)" style={{ transition: 'color 0.3s ease' }} />
                        <div>
                            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--primary)', fontWeight: '800', transition: 'color 0.3s ease', letterSpacing: '-0.5px' }}>KDKL SHASTRI</h2>
                            <p style={{ fontSize: '0.65rem', margin: 0, color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '1px', transition: 'color 0.3s ease' }}>INTER COLLEGE & K.P.S</p>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.65', margin: 0, transition: 'color 0.3s ease' }}>
                        Nurturing young minds with excellence, morality, and ambition. Providing a holistic learning experience for tomorrow's leaders.
                    </p>
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                        {[
                            { icon: <Facebook size={18} />, href: settings?.facebookUrl || "#", color: '#1877F2' },
                            { icon: <Instagram size={18} />, href: settings?.instagramUrl || "#", color: '#E1306C' },
                            { icon: <Twitter size={18} />, href: "#", color: '#1DA1F2' },
                            { icon: <Linkedin size={18} />, href: "#", color: '#0077B5' }
                        ].map((soc, idx) => (
                            <a 
                                key={idx} 
                                href={soc.href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="footer-social-icon"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'var(--bg-light)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = soc.color;
                                    e.currentTarget.style.color = '#ffffff';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.transform = 'none';
                                }}
                            >
                                {soc.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                        Quick Links
                        <span style={{ position: 'absolute', bottom: '-6px', left: 0, width: '30px', height: '2.5px', background: 'var(--secondary)' }}></span>
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {[
                            { label: 'Home', to: '/' },
                            { label: 'About Us', to: '/about' },
                            { label: 'Academics', to: '/' },
                            { label: 'Campus', to: '/' },
                            { label: 'Gallery', to: '/gallery' }
                        ].map((link, idx) => (
                            <li key={idx}>
                                <Link 
                                    to={link.to} 
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Useful Links */}
                <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                        Useful Links
                        <span style={{ position: 'absolute', bottom: '-6px', left: 0, width: '30px', height: '2.5px', background: '#138808' }}></span>
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {[
                            { label: 'Admission', to: '/admission' },
                            { label: 'Fee Structure', to: '/fee-structure' },
                            { label: 'Toppers', to: '/' },
                            { label: 'Downloads', to: '/' },
                            { label: 'Privacy Policy', to: '/' }
                        ].map((link, idx) => (
                            <li key={idx}>
                                <Link 
                                    to={link.to} 
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.3rem', color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                        Contact Info
                        <span style={{ position: 'absolute', bottom: '-6px', left: 0, width: '30px', height: '2.5px', background: 'var(--primary)' }}></span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                            <Phone size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                {settings?.phone1 || '+91 9816543210'} {settings?.phone2 ? `/ ${settings.phone2}` : ''}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                            <Mail size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500', wordBreak: 'break-all' }}>
                                {settings?.email || 'kdkl.shastri@gmail.com'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                            <MapPin size={18} color="#138808" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500', lineHeight: '1.4' }}>
                                {settings?.address || 'Main Road, New Delhi, 110001'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom copyright bar */}
            <div style={{ 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '2rem', 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                transition: 'border-color 0.3s ease'
            }}>
                <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} KDKL Shastri Inter College & K.P.S. All Rights Reserved.</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Staff Login</Link>
                    <span style={{ color: 'var(--border-color)' }}>|</span>
                    <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
                    <span style={{ color: 'var(--border-color)' }}>|</span>
                    <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Terms & Conditions</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
