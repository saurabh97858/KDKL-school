import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [settings, setSettings] = useState(null);
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (link) => {
        if (link.hash) {
            return location.pathname === '/' && location.hash === link.hash;
        }
        return location.pathname === link.to;
    };

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

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
        { to: '/about', label: 'About' },
        { to: '/', hash: '#academics', label: 'Academics' },
        { to: '/', hash: '#campus', label: 'Campus' },
        { to: '/gallery', label: 'Gallery' },
        { to: '/admission', label: 'Admission' },
        { to: '/', hash: '#contact', label: 'Contact' },
    ];

    const handleLinkClick = (e, link) => {
        if (link.hash) {
            e.preventDefault();
            if (location.pathname === '/') {
                const el = document.querySelector(link.hash);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    // Update window hash
                    window.history.pushState(null, '', link.hash);
                }
            } else {
                navigate('/', { state: { scrollTo: link.hash } });
            }
        }
        setMenuOpen(false);
    };

    return (
        <nav className={`navbar premium-navbar ${show ? 'nav--show' : 'nav--hide'}`}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={32} color="var(--primary)" style={{ transition: 'color 0.3s ease' }} />
                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '0', color: 'var(--primary)', fontWeight: '800', transition: 'color 0.3s ease' }}>KDKL SHASTRI</h2>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '1px', transition: 'color 0.3s ease' }}>INTER COLLEGE & KPS</p>
                </div>
            </div>
            
            {/* Desktop Nav */}
            <ul className="nav-links desktop-nav" style={{ justifyContent: 'center', margin: 0 }}>
                {navLinks.map((link, idx) => (
                    <li key={idx}>
                        {link.hash ? (
                            <a 
                                href={link.hash} 
                                onClick={(e) => handleLinkClick(e, link)}
                                className={isActive(link) ? 'active-link' : ''}
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link to={link.to} className={isActive(link) ? 'active-link' : ''}>
                                {link.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
            
            <div className="nav-actions-wrapper">
                {user ? (
                    <>
                        <Link 
                            to={`/${user.role}-dashboard`} 
                            className="login-btn-premium"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <LayoutDashboard size={15} /> Dashboard
                        </Link>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="nav-theme-toggle"
                            title="Logout"
                            style={{ color: 'var(--secondary)' }}
                        >
                            <LogOut size={16} />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="login-btn-premium">Login</Link>
                )}
                <button 
                    onClick={() => setIsDark(!isDark)} 
                    className="nav-theme-toggle"
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    aria-label="Toggle dark mode"
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                {/* Hamburger */}
                <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? <X size={24} color="var(--primary)" /> : <Menu size={24} color="var(--primary)" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {menuOpen && (
                <div className="mobile-drawer">
                    {navLinks.map((link, idx) => (
                        link.hash ? (
                            <a 
                                key={idx}
                                href={link.hash}
                                onClick={(e) => handleLinkClick(e, link)}
                                className={`mobile-nav-link ${isActive(link) ? 'mobile-active' : ''}`}
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link 
                                key={idx}
                                to={link.to} 
                                className={`mobile-nav-link ${isActive(link) ? 'mobile-active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        )
                    ))}
                    {user ? (
                        <>
                            <Link to={`/${user.role}-dashboard`} className="mobile-login-btn">Dashboard</Link>
                            <button onClick={() => { logout(); navigate('/'); setMenuOpen(false); }} className="mobile-login-btn" style={{ background: 'var(--secondary)', border: 'none', cursor: 'pointer', width: '100%', marginTop: '0.3rem' }}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="mobile-login-btn">Login Portal</Link>
                    )}
                </div>
            )}

            <style>{`
                .premium-navbar {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    align-items: center;
                    padding: 0.8rem 5%;
                    background: var(--navbar-bg);
                    border-top: 4px solid var(--secondary);
                    border-bottom: 4px solid #138808;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                    transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                .nav--hide { transform: translateY(-100%); }

                /* Active link */
                .nav-links li a.active-link {
                    color: #ffffff !important;
                    background: var(--primary) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .nav-links li a {
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 1.05rem;
                    padding: 0.6rem 1.2rem;
                    border-radius: 8px;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-decoration: none;
                    display: inline-block;
                }
                .nav-links li a:hover {
                    color: #ffffff;
                    background: var(--secondary);
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
                }

                /* Nav actions cluster */
                .nav-actions-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    justify-content: flex-end;
                }

                .login-btn-premium {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    padding: 0.45rem 1.2rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
                    white-space: nowrap;
                }
                .login-btn-premium:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
                    filter: brightness(1.1);
                }

                .nav-theme-toggle {
                    background: var(--bg-light);
                    border: 1.5px solid var(--border-color);
                    color: var(--primary);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    padding: 0;
                }
                .nav-theme-toggle:hover {
                    background: var(--primary);
                    color: white;
                    transform: scale(1.1) rotate(15deg);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
                    background: var(--navbar-bg);
                    border-bottom: 3px solid #138808;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    flex-direction: column;
                    padding: 1rem 5%;
                    gap: 0.5rem;
                    z-index: 999;
                    transition: background 0.3s ease;
                }
                .mobile-nav-link {
                    display: block;
                    padding: 0.8rem 1rem;
                    color: var(--primary);
                    font-weight: 700;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                .mobile-nav-link:hover, .mobile-active {
                    background: var(--primary);
                    color: white;
                }
                .mobile-login-btn {
                    display: block;
                    margin-top: 0.5rem;
                    padding: 0.8rem 1rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    font-weight: 700;
                    text-decoration: none;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                }

                @media (max-width: 1024px) {
                    .premium-navbar { grid-template-columns: auto 1fr auto; padding: 0.6rem 5%; }
                    .logo h2 { font-size: 1.1rem !important; }
                    .logo p { font-size: 0.6rem !important; }
                    .desktop-nav { display: none !important; }
                    .hamburger-btn { display: flex !important; margin-left: auto; }
                    .mobile-drawer { display: flex; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
