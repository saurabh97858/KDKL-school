import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [settings, setSettings] = useState(null);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 60) {
                setShow(false);
            } else {
                setShow(true);
            }
            setLastScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/settings');
                setSettings(data);
            } catch (err) { console.error('Navbar settings fetch error:', err); }
        };
        fetchSettings();
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location]);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/gallery', label: 'Gallery' },
        { to: '/admission', label: 'Admission' },
        ...(settings?.showFeeStructureInNavbar ? [{ to: '/fee-structure', label: 'Fee Structure' }] : []),
    ];

    return (
        <nav className={`navbar premium-navbar ${show ? 'nav--show' : 'nav--hide'}`}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={32} color="#1a2a6c" />
                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '0', color: '#1a2a6c', fontWeight: '800' }}>KDKL SHASTRI</h2>
                    <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600', letterSpacing: '1px' }}>INTER COLLEGE & KPS</p>
                </div>
            </div>
            
            {/* Desktop Nav */}
            <ul className="nav-links desktop-nav" style={{ justifyContent: 'center', margin: 0 }}>
                {navLinks.map(link => (
                    <li key={link.to}>
                        <Link to={link.to} className={isActive(link.to) ? 'active-link' : ''}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                <Link to="/login" className="login-btn-premium desktop-nav">Login Portal</Link>
                {/* Hamburger */}
                <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? <X size={24} color="#1a2a6c" /> : <Menu size={24} color="#1a2a6c" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {menuOpen && (
                <div className="mobile-drawer">
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to} className={`mobile-nav-link ${isActive(link.to) ? 'mobile-active' : ''}`}>
                            {link.label}
                        </Link>
                    ))}
                    <Link to="/login" className="mobile-login-btn">Login Portal</Link>
                </div>
            )}

            <style>{`
                .premium-navbar {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    padding: 0.8rem 5%;
                    background: #fffde7;
                    border-top: 4px solid #ff9933;
                    border-bottom: 4px solid #138808;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                    transition: transform 0.3s ease;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                .nav--hide { transform: translateY(-100%); }

                /* Active link */
                .nav-links li a.active-link {
                    color: #ffffff !important;
                    background: #1a2a6c !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(26,42,108,0.3);
                }

                .nav-links li a {
                    color: #1a2a6c;
                    font-weight: 700;
                    font-size: 1.05rem;
                    padding: 0.6rem 1.2rem;
                    border-radius: 8px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-decoration: none;
                    display: inline-block;
                }
                .nav-links li a:hover {
                    color: #ffffff;
                    background: #ff9933;
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 15px rgba(255, 153, 51, 0.4);
                }

                .login-btn-premium {
                    background: linear-gradient(135deg, #1a2a6c, #3b5998);
                    color: white;
                    padding: 0.6rem 1.4rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 10px rgba(26, 42, 108, 0.2);
                    white-space: nowrap;
                }
                .login-btn-premium:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(26, 42, 108, 0.3);
                }

                /* Hamburger */
                .hamburger-btn {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.3rem;
                }

                /* Mobile Drawer */
                .mobile-drawer {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #fffde7;
                    border-bottom: 3px solid #138808;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    flex-direction: column;
                    padding: 1rem 5%;
                    gap: 0.5rem;
                    z-index: 999;
                }
                .mobile-nav-link {
                    display: block;
                    padding: 0.8rem 1rem;
                    color: #1a2a6c;
                    font-weight: 700;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                .mobile-nav-link:hover, .mobile-active {
                    background: #1a2a6c;
                    color: white;
                }
                .mobile-login-btn {
                    display: block;
                    margin-top: 0.5rem;
                    padding: 0.8rem 1rem;
                    background: linear-gradient(135deg, #1a2a6c, #3b5998);
                    color: white;
                    font-weight: 700;
                    text-decoration: none;
                    border-radius: 8px;
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .premium-navbar { grid-template-columns: 1fr auto; padding: 0.6rem 5%; }
                    .logo h2 { font-size: 1rem !important; }
                    .logo p { font-size: 0.55rem !important; }
                    .desktop-nav { display: none !important; }
                    .hamburger-btn { display: flex !important; margin-left: auto; }
                    .mobile-drawer { display: flex; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;


