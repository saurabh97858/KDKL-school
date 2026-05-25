import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, UserPlus, BookOpen, Image as ImageIcon, LogOut, FileText, Bell, Lock, Settings, CreditCard, Menu, X, Sun, Moon } from 'lucide-react';

const Sidebar = ({ role }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

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
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (!mobile) setIsOpen(true); // Default open on desktop
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar on route change for mobile
    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
            document.body.classList.remove('sidebar-open');
        } else {
            if (isOpen) document.body.classList.add('sidebar-open');
            else document.body.classList.remove('sidebar-open');
        }
    }, [location.pathname, isMobile, isOpen]);

    useEffect(() => {
        if (isOpen) document.body.classList.add('sidebar-open');
        else document.body.classList.remove('sidebar-open');
        return () => document.body.classList.remove('sidebar-open');
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const principalLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/principal-dashboard' },
        { name: 'Teachers', icon: <Users size={18} />, path: '/principal/teachers' },
        { name: 'Add Student', icon: <UserPlus size={18} />, path: '/principal/add-student' },
        { name: 'Fee Management', icon: <CreditCard size={18} />, path: '/principal/fees' },
        { name: 'Admissions', icon: <FileText size={18} />, path: '/principal/applications' },
        { name: 'Gallery', icon: <ImageIcon size={18} />, path: '/principal/gallery' },
        { name: 'Moments', icon: <ImageIcon size={18} />, path: '/principal/moments' },
        { name: 'Toppers', icon: <Users size={18} />, path: '/principal/toppers' },
        { name: 'Fee Details', icon: <CreditCard size={18} />, path: '/principal/fee-structure' },
        { name: 'Founder Info', icon: <Users size={18} />, path: '/principal/founder' },
        { name: 'Notifications', icon: <Bell size={18} />, path: '/principal/notifications' },
        { name: 'School Settings', icon: <Settings size={18} />, path: '/principal/settings' },
    ];

    const teacherLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/teacher-dashboard' },
        { name: 'Attendance', icon: <BookOpen size={18} />, path: '/teacher/attendance' },
        { name: 'Results', icon: <FileText size={18} />, path: '/teacher/results' },
        { name: 'Leaves', icon: <FileText size={18} />, path: '/teacher/leaves' },
    ];

    const studentLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/student-dashboard' },
        { name: 'My Fees', icon: <CreditCard size={18} />, path: '/student/fees' },
        { name: 'Results', icon: <FileText size={18} />, path: '/student/results' },
        { name: 'Leaves', icon: <FileText size={18} />, path: '/student/leaves' },
    ];

    const commonLinks = [
        { name: 'Change Password', icon: <Lock size={18} />, path: '/settings/password' },
    ];

    const getLinks = () => {
        let links = [];
        if (role === 'principal') links = principalLinks;
        else if (role === 'teacher') links = teacherLinks;
        else if (role === 'student') links = studentLinks;
        return [...links, ...commonLinks];
    };

    return (
        <>
            {/* Universal Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="sidebar-toggle-btn"
                style={{
                    position: 'fixed', top: '12px', left: '12px', zIndex: 1100,
                    background: 'var(--primary)', color: 'white', border: 'none',
                    borderRadius: '6px', padding: '8px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                }}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed', inset: 0, 
                            background: 'rgba(0,0,0,0.4)', zIndex: 1000,
                            backdropFilter: 'blur(3px)'
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.div 
                initial={isMobile ? { x: -280 } : { x: isOpen ? 0 : -280 }}
                animate={{ x: isOpen ? 0 : -280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="sidebar"
                style={{ 
                    position: 'fixed',
                    background: 'var(--card-bg)',
                    borderRight: '1px solid var(--border-color)',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
                    zIndex: 1050,
                    height: '100vh',
                    width: '260px',
                    left: 0, top: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'background 0.3s ease, border-color 0.3s ease'
                }}
            >
                <div className="sidebar-header" style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    padding: '1.2rem 1rem 0.8rem', 
                    marginBottom: '0.6rem', 
                    marginTop: '2.8rem',
                    transition: 'border-color 0.3s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <h2 style={{ fontSize: '1.05rem', letterSpacing: '2px', fontWeight: '800', color: 'var(--primary)', margin: 0, transition: 'color 0.3s ease' }}>KDKL PORTAL</h2>
                    <button 
                        onClick={() => setIsDark(!isDark)}
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        style={{
                            background: 'var(--bg-light)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--primary)',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                            padding: 0,
                            transition: 'all 0.3s ease',
                            flexShrink: 0
                        }}
                    >
                        {isDark ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                </div>

                <ul className="sidebar-menu" style={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    padding: '0 0.8rem 1.5rem',
                    scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none' // For Internet Explorer
                }}>
                    {getLinks().map((link, idx) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <motion.li key={idx} whileTap={{ scale: 0.98 }} style={{ listStyle: 'none', marginBottom: '0.3rem' }}>
                                <Link 
                                    to={link.path} 
                                    className={`sidebar-link ${isActive ? 'active-link' : ''}`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            </motion.li>
                        );
                    })}
                    <motion.li 
                        onClick={handleLogout} 
                        className="sidebar-link logout-btn-sidebar"
                        style={{ 
                            marginTop: '1.2rem',
                            listStyle: 'none'
                        }}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </motion.li>
                </ul>
                <style>{`
                    .sidebar-menu::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </motion.div>
        </>
    );
};

export default Sidebar;
