import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, UserPlus, BookOpen, Image as ImageIcon, LogOut, FileText, Bell, Lock, Settings, CreditCard, Menu, X } from 'lucide-react';

const Sidebar = ({ role }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

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
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/principal-dashboard' },
        { name: 'Teachers', icon: <Users size={20} />, path: '/principal/teachers' },
        { name: 'Add Student', icon: <UserPlus size={20} />, path: '/principal/add-student' },
        { name: 'Fee Management', icon: <CreditCard size={20} />, path: '/principal/fees' },
        { name: 'Admissions', icon: <FileText size={20} />, path: '/principal/applications' },
        { name: 'Gallery', icon: <ImageIcon size={20} />, path: '/principal/gallery' },
        { name: 'Moments', icon: <ImageIcon size={20} />, path: '/principal/moments' },
        { name: 'Toppers', icon: <Users size={20} />, path: '/principal/toppers' },
        { name: 'Fee Details', icon: <CreditCard size={20} />, path: '/principal/fee-structure' },
        { name: 'Founder Info', icon: <Users size={20} />, path: '/principal/founder' },
        { name: 'Notifications', icon: <Bell size={20} />, path: '/principal/notifications' },
        { name: 'School Settings', icon: <Settings size={20} />, path: '/principal/settings' },
    ];

    const teacherLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/teacher-dashboard' },
        { name: 'Attendance', icon: <BookOpen size={20} />, path: '/teacher/attendance' },
        { name: 'Results', icon: <FileText size={20} />, path: '/teacher/results' },
        { name: 'Leaves', icon: <FileText size={20} />, path: '/teacher/leaves' },
    ];

    const studentLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student-dashboard' },
        { name: 'My Fees', icon: <CreditCard size={20} />, path: '/student/fees' },
        { name: 'Results', icon: <FileText size={20} />, path: '/student/results' },
        { name: 'Leaves', icon: <FileText size={20} />, path: '/student/leaves' },
    ];

    const commonLinks = [
        { name: 'Change Password', icon: <Lock size={20} />, path: '/settings/password' },
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
                    position: 'fixed', top: '15px', left: '15px', zIndex: 1100,
                    background: '#1a2a6c', color: 'white', border: 'none',
                    borderRadius: '8px', padding: '10px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    cursor: 'pointer'
                }}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
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
                            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                            backdropFilter: 'blur(4px)'
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
                    background: 'linear-gradient(180deg, #1a2a6c 0%, #111827 100%)',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
                    zIndex: 1050,
                    height: '100vh',
                    width: '260px',
                    left: 0, top: 0,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div className="sidebar-header" style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.1)', 
                    padding: '2rem 1rem 1rem', 
                    marginBottom: '1rem', 
                    marginTop: '2.5rem' 
                }}>
                    <h2 style={{ fontSize: '1.2rem', letterSpacing: '2px', fontWeight: '800', color: '#fff' }}>KDKL PORTAL</h2>
                </div>

                <ul className="sidebar-menu" style={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    padding: '0 1rem 2rem',
                    scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none' // For Internet Explorer
                }}>
                    {getLinks().map((link, idx) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <motion.li key={idx} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to={link.path} 
                                    className={isActive ? 'active-link' : ''}
                                    style={{ 
                                        backgroundColor: isActive ? 'rgba(253, 187, 45, 0.2)' : 'transparent',
                                        color: isActive ? '#fdbb2d' : 'rgba(255,255,255,0.7)',
                                        fontWeight: isActive ? '700' : '400',
                                        borderLeft: isActive ? '4px solid #fdbb2d' : 'none',
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem',
                                        textDecoration: 'none', borderRadius: '8px', transition: 'all 0.3s'
                                    }}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            </motion.li>
                        );
                    })}
                    <motion.li 
                        whileHover={{ x: 5 }}
                        onClick={handleLogout} 
                        className="logout-btn"
                        style={{ 
                            marginTop: '2rem', color: '#ef4444',
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            padding: '0.8rem 1rem', cursor: 'pointer'
                        }}
                    >
                        <LogOut size={20} />
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
