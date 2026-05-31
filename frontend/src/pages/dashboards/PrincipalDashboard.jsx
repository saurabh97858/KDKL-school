import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    GraduationCap, 
    Laptop, 
    IndianRupee, 
    Search, 
    Bell, 
    Download, 
    TrendingUp, 
    Menu, 
    ChevronRight,
    ArrowUpRight,
    Plus,
    CheckSquare,
    DollarSign,
    Send,
    UserCheck,
    Calendar,
    MessageSquare,
    ClipboardList,
    AlertCircle,
    Play
} from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ 
        teachers: 0, 
        students: 0, 
        applications: 0,
        acceptedApps: 0,
        rejectedApps: 0,
        pendingApps: 0,
        totalFees: 0,
        depositedFees: 0,
        pendingFees: 0,
        feeRate: 0
    });
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchNotifications();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/stats', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (data) {
                setStats({
                    teachers: data.teachers || 0,
                    students: data.students || 0,
                    applications: data.applications || 0,
                    acceptedApps: data.acceptedApps || 0,
                    rejectedApps: data.rejectedApps || 0,
                    pendingApps: data.pendingApps || 0,
                    totalFees: data.totalFees || 0,
                    depositedFees: data.depositedFees || 0,
                    pendingFees: data.pendingFees || 0,
                    feeRate: data.feeRate || 0
                });
            }
        } catch (err) { 
            console.error('Error fetching stats:', err); 
        }
    };

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/notifications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (data && data.length > 0) {
                setNotifications(data.slice(0, 4));
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const getTodayFormatted = () => {
        return new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    // Calculate dynamic percentages or fallback
    const totalApplicationsCount = stats.applications || 0;
    const acceptedCount = stats.acceptedApps || 0;
    const rejectedCount = stats.rejectedApps || 0;
    const pendingCount = stats.pendingApps || 0;

    const totalAppsForDonut = acceptedCount + pendingCount + rejectedCount || 1;
    const acceptedPct = (acceptedCount / totalAppsForDonut) * 100;
    const pendingPct = (pendingCount / totalAppsForDonut) * 100;
    const rejectedPct = 100 - acceptedPct - pendingPct;

    const circ = 238.76;
    const acceptedDash = (acceptedPct / 100) * circ;
    const pendingDash = (pendingPct / 100) * circ;
    const rejectedDash = (rejectedPct / 100) * circ;

    const acceptedOffset = 0;
    const pendingOffset = -acceptedDash;
    const rejectedOffset = -(acceptedDash + pendingDash);

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="principal" />
            
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', paddingBottom: '3rem' }}>
                
                {/* Topbar Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, maxWidth: '400px' }}>
                        <button className="sidebar-toggle-btn" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Menu size={20} />
                        </button>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input 
                                type="text" 
                                placeholder="Search anything... Ctrl+K" 
                                style={{ 
                                    width: '100%', 
                                    padding: '0.6rem 1rem 0.6rem 2.2rem', 
                                    borderRadius: '10px', 
                                    border: '1.5px solid var(--border-color)', 
                                    backgroundColor: 'var(--card-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: '500'
                                }} 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* Date Widget */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            backgroundColor: 'var(--card-bg)', 
                            border: '1.5px solid var(--border-color)',
                            borderRadius: '10px',
                            padding: '0.55rem 1rem',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            <Calendar size={15} color="#ea580c" />
                            {getTodayFormatted()}
                        </div>

                        {/* Notifications Bell */}
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={20} color="var(--text-primary)" />
                            <span style={{ 
                                position: 'absolute', 
                                top: '-4px', 
                                right: '-4px', 
                                background: '#ef4444', 
                                color: 'white', 
                                fontSize: '0.62rem', 
                                fontWeight: '700', 
                                borderRadius: '50%', 
                                width: '15px', 
                                height: '15px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>3</span>
                        </div>

                        {/* Principal Profile Display */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1.5px solid var(--border-color)', paddingLeft: '1.2rem' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" 
                                alt="Principal Profile" 
                                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #ea580c' }}
                            />
                            <div style={{ textAlign: 'left' }}>
                                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>Main Principal</h4>
                                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Founder & Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Welcome Back & Download Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.3rem 0' }}>
                            Welcome back, Main Principal 👋
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: '500', margin: 0 }}>
                            Here's what's happening in your institution today.
                        </p>
                    </div>
                    <button 
                        className="btn" 
                        style={{ 
                            background: '#0f172a', 
                            color: 'white', 
                            borderRadius: '10px', 
                            padding: '0.7rem 1.4rem', 
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                        }}
                    >
                        <Download size={15} />
                        Download Report
                    </button>
                </div>

                {/* Stat Grid (4 columns) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                    
                    {/* Faculty Members Card */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Faculty Members</span>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0 0.1rem 0' }}>{stats.teachers}</h2>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Total Teachers</span>
                            </div>
                            <div style={{ backgroundColor: '#fff3eb', color: '#ea580c', padding: '0.8rem', borderRadius: '12px' }}>
                                <Users size={22} />
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#16a34a', fontWeight: '600' }}>
                            <span>↑ 8%</span>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>from last month</span>
                        </div>
                    </div>

                    {/* Total Students Card */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Students</span>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0 0.1rem 0' }}>{stats.students}</h2>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '500' }}>All Students</span>
                            </div>
                            <div style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.8rem', borderRadius: '12px' }}>
                                <GraduationCap size={22} />
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#16a34a', fontWeight: '600' }}>
                            <span>↑ 12%</span>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>from last year</span>
                        </div>
                    </div>

                    {/* Active Apps Card */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Apps</span>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0 0.1rem 0' }}>{stats.applications}</h2>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '500' }}>System Usage</span>
                            </div>
                            <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.8rem', borderRadius: '12px' }}>
                                <Laptop size={22} />
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#16a34a', fontWeight: '600' }}>
                            <span>↑ 5%</span>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>from last month</span>
                        </div>
                    </div>

                    {/* Total Fees Collected Card */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Fees Collected</span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0 0.1rem 0' }}>₹{stats.depositedFees?.toLocaleString('en-IN') || '0'}</h2>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '500' }}>This Academic Year</span>
                            </div>
                            <div style={{ backgroundColor: '#faf5ff', color: '#7e22ce', padding: '0.8rem', borderRadius: '12px' }}>
                                <IndianRupee size={22} />
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#16a34a', fontWeight: '600' }}>
                            <span>↑ 15%</span>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>from last year</span>
                        </div>
                    </div>

                </div>

                {/* Dashboard Main Content Area Grid (2 Columns: 70% / 30%) */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.8rem', alignItems: 'start' }} className="dashboard-grid-layout">
                    
                    {/* Left Column (Charts and Overview) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                        
                        {/* Students Overview Card (Line Chart) */}
                        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Students Overview</h3>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.75rem', fontWeight: '600' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ea580c' }}>
                                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c' }}></span>
                                            This Year
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }}></span>
                                            Last Year
                                        </span>
                                    </div>
                                </div>
                                <select style={{ 
                                    border: '1.5px solid var(--border-color)', 
                                    borderRadius: '8px', 
                                    padding: '0.35rem 0.8rem', 
                                    fontSize: '0.78rem', 
                                    fontWeight: '600', 
                                    backgroundColor: 'var(--card-bg)', 
                                    color: 'var(--text-primary)' 
                                }}>
                                    <option>This Year</option>
                                </select>
                            </div>

                            {/* Responsive SVG Line Chart */}
                            <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                                <svg viewBox="0 0 600 200" width="100%" height="200" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="chartLineGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25"/>
                                            <stop offset="100%" stopColor="#ea580c" stopOpacity="0"/>
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Grid Lines */}
                                    <line x1="0" y1="40" x2="600" y2="40" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="0.8" opacity="0.5" />
                                    <line x1="0" y1="80" x2="600" y2="80" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="0.8" opacity="0.5" />
                                    <line x1="0" y1="120" x2="600" y2="120" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="0.8" opacity="0.5" />
                                    <line x1="0" y1="160" x2="600" y2="160" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="0.8" opacity="0.5" />
                                    
                                    {/* Chart Areas */}
                                    <path 
                                        d="M 10 140 Q 60 120 110 100 T 210 70 T 310 90 T 410 60 T 510 80 T 590 40 L 590 190 L 10 190 Z" 
                                        fill="url(#chartLineGrad)" 
                                    />
                                    
                                    {/* Chart Lines */}
                                    <path 
                                        d="M 10 140 Q 60 120 110 100 T 210 70 T 310 90 T 410 60 T 510 80 T 590 40" 
                                        fill="none" 
                                        stroke="#ea580c" 
                                        strokeWidth="3.5" 
                                        strokeLinecap="round"
                                    />
                                    <path 
                                        d="M 10 160 Q 60 150 110 130 T 210 100 T 310 110 T 410 90 T 510 110 T 590 70" 
                                        fill="none" 
                                        stroke="#cbd5e1" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round"
                                        opacity="0.8"
                                    />
                                    
                                    {/* Active Point Circle & Badge */}
                                    <circle cx="590" cy="40" r="6" fill="#ea580c" stroke="white" strokeWidth="2" />
                                    <g transform="translate(565, 12)">
                                        <rect width="32" height="18" rx="4" fill="#ea580c" />
                                        <text x="16" y="12" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{stats.students}</text>
                                    </g>

                                    {/* X-axis Labels */}
                                    <text x="10" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Apr</text>
                                    <text x="60" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">May</text>
                                    <text x="110" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Jun</text>
                                    <text x="160" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Jul</text>
                                    <text x="210" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Aug</text>
                                    <text x="260" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Sep</text>
                                    <text x="310" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Oct</text>
                                    <text x="360" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Nov</text>
                                    <text x="410" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Dec</text>
                                    <text x="460" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Jan</text>
                                    <text x="510" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Feb</text>
                                    <text x="590" y="195" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500">Mar</text>
                                </svg>
                            </div>
                        </div>

                        {/* Bottom Row Grid (Admission Overview & Fee Collection Overview) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            
                            {/* Admission Overview */}
                            <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Admission Overview</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-around', minHeight: '150px' }}>
                                    
                                    {/* Donut Chart */}
                                    <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                                        <svg width="130" height="130" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--border-color)" strokeWidth="8" opacity="0.3" />
                                            {/* Segments */}
                                            {/* Green - Approved */}
                                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray={`${acceptedDash} ${circ - acceptedDash}`} strokeDashoffset={acceptedOffset} />
                                            {/* Yellow - Pending */}
                                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray={`${pendingDash} ${circ - pendingDash}`} strokeDashoffset={pendingOffset} />
                                            {/* Red - Rejected */}
                                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="8" strokeDasharray={`${rejectedDash} ${circ - rejectedDash}`} strokeDashoffset={rejectedOffset} />
                                        </svg>
                                        <div style={{ 
                                            position: 'absolute', 
                                            inset: 0, 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            lineHeight: '1.2'
                                        }}>
                                            <span style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Total</span>
                                            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalApplicationsCount}</span>
                                            <span style={{ fontSize: '0.52rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Applications</span>
                                        </div>
                                    </div>

                                    {/* Legend Column */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', fontWeight: '600' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                                            <span style={{ color: 'var(--text-secondary)', width: '70px' }}>Approved</span>
                                            <span style={{ color: 'var(--text-primary)' }}>{acceptedCount}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                                            <span style={{ color: 'var(--text-secondary)', width: '70px' }}>Pending</span>
                                            <span style={{ color: 'var(--text-primary)' }}>{pendingCount}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                                            <span style={{ color: 'var(--text-secondary)', width: '70px' }}>Rejected</span>
                                            <span style={{ color: 'var(--text-primary)' }}>{rejectedCount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.2rem', paddingTop: '0.8rem', textAlign: 'center' }}>
                                    <a href="/principal/applications" style={{ textDecoration: 'none', color: '#ea580c', fontSize: '0.8rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                        View All Applications <ChevronRight size={14} />
                                    </a>
                                </div>
                            </div>

                            {/* Fee Collection Overview */}
                            <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Fee Collection Overview</h3>
                                    <select style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontWeight: '600', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
                                        <option>This Year</option>
                                    </select>
                                </div>

                                {/* Custom Bar Chart */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '110px', padding: '0 0.5rem 0.5rem 0.5rem', borderBottom: '1.5px solid var(--border-color)', gap: '8px' }}>
                                    {[
                                        { m: 'Apr', h: '60px' },
                                        { m: 'May', h: '75px' },
                                        { m: 'Jun', h: '95px' },
                                        { m: 'Jul', h: '55px' },
                                        { m: 'Aug', h: '82px' },
                                        { m: 'Sep', h: '88px' }
                                    ].map((bar, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
                                            <div style={{ 
                                                height: bar.h, 
                                                width: '100%', 
                                                maxWidth: '22px', 
                                                background: 'linear-gradient(to top, #ea580c, #f97316)', 
                                                borderRadius: '4px 4px 0 0' 
                                            }}></div>
                                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{bar.m}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats Grid Bottom */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '1rem', textAlign: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Total Collected</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>₹{stats.depositedFees?.toLocaleString('en-IN') || '0'}</span>
                                    </div>
                                    <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Pending Amount</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>₹{stats.pendingFees?.toLocaleString('en-IN') || '0'}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Total Students</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.students}</span>
                                    </div>
                                </div>
                            </div>
                            </div>

                    {/* Right Column (Summary & Action List) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                        
                        {/* Today's Summary (Dark Navy Card) */}
                        <div className="glass-card" style={{ 
                            padding: '1.5rem', 
                            border: 'none', 
                            backgroundColor: '#0b1329', 
                            color: 'white', 
                            borderRadius: '20px', 
                            boxShadow: '0 8px 30px rgba(11, 19, 41, 0.15)',
                            textAlign: 'left'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', marginBottom: '1.2rem' }}>Today's Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                
                                {/* Item 1 */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate('/principal/applications')}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ backgroundColor: 'rgba(234, 88, 12, 0.2)', color: '#ea580c', padding: '0.5rem', borderRadius: '8px' }}>
                                            <UserCheck size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0' }}>New Admissions</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: 'white' }}>
                                        {pendingCount} <ChevronRight size={14} style={{ opacity: 0.6 }} />
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate('/principal/fees')}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.2)', color: '#16a34a', padding: '0.5rem', borderRadius: '8px' }}>
                                            <DollarSign size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0' }}>Fee Received Today</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: 'white' }}>
                                        ₹{Math.round(stats.depositedFees * 0.02 || 45600).toLocaleString('en-IN')} <ChevronRight size={14} style={{ opacity: 0.6 }} />
                                    </div>
                                </div>

                                {/* Item 3 */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '0.5rem', borderRadius: '8px' }}>
                                            <MessageSquare size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0' }}>Active Faculty</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: 'white' }}>
                                        {stats.teachers} <ChevronRight size={14} style={{ opacity: 0.6 }} />
                                    </div>
                                </div>

                                {/* Item 4 */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate('/principal/notifications')}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', padding: '0.5rem', borderRadius: '8px' }}>
                                            <Calendar size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0' }}>Events / Notices</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: 'white' }}>
                                        {notifications.length} <ChevronRight size={14} style={{ opacity: 0.6 }} />
                                    </div>
                                </div>             </div>

                            </div>
                        </div>

                        {/* Quick Actions (Grid of 4) */}
                        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1.2rem' }}>Quick Actions</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                
                                {/* Add Teacher */}
                                <div 
                                    onClick={() => navigate('/principal/teachers')}
                                    style={{ 
                                        border: '1.5px solid var(--border-color)', 
                                        borderRadius: '12px', 
                                        padding: '0.8rem', 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        backgroundColor: 'var(--card-bg)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="action-card"
                                >
                                    <div style={{ color: '#ea580c', display: 'inline-flex', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fff3eb', marginBottom: '6px' }}>
                                        <Plus size={16} />
                                    </div>
                                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>Add Teacher</div>
                                </div>

                                {/* Enroll Student */}
                                <div 
                                    onClick={() => navigate('/principal/add-student')}
                                    style={{ 
                                        border: '1.5px solid var(--border-color)', 
                                        borderRadius: '12px', 
                                        padding: '0.8rem', 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        backgroundColor: 'var(--card-bg)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="action-card"
                                >
                                    <div style={{ color: '#7e22ce', display: 'inline-flex', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#faf5ff', marginBottom: '6px' }}>
                                        <GraduationCap size={16} />
                                    </div>
                                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>Enroll Student</div>
                                </div>

                                {/* Collect Fees */}
                                <div 
                                    onClick={() => navigate('/principal/fees')}
                                    style={{ 
                                        border: '1.5px solid var(--border-color)', 
                                        borderRadius: '12px', 
                                        padding: '0.8rem', 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        backgroundColor: 'var(--card-bg)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="action-card"
                                >
                                    <div style={{ color: '#16a34a', display: 'inline-flex', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#dcfce7', marginBottom: '6px' }}>
                                        <CheckSquare size={16} />
                                    </div>
                                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>Collect Fees</div>
                                </div>

                                {/* Send Notice */}
                                <div 
                                    onClick={() => navigate('/principal/notifications')}
                                    style={{ 
                                        border: '1.5px solid var(--border-color)', 
                                        borderRadius: '12px', 
                                        padding: '0.8rem', 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        backgroundColor: 'var(--card-bg)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="action-card"
                                >
                                    <div style={{ color: '#2563eb', display: 'inline-flex', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#dbeafe', marginBottom: '6px' }}>
                                        <Send size={16} />
                                    </div>
                                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>Send Notice</div>
                                </div>

                            </div>
                        </div>

                        {/* Recent Notifications */}
                        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Recent Notifications</h3>
                                <a href="/principal/notifications" style={{ textDecoration: 'none', color: '#ea580c', fontSize: '0.75rem', fontWeight: '700' }}>View All</a>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { text: 'New student admission', desc: 'Rohan Verma has been admitted', t: '10 min ago', col: '#10b981', bg: '#dcfce7', ic: Users },
                                    { text: 'Fee payment received', desc: '₹12,500 received from Class 10A', t: '1 hour ago', col: '#f59e0b', bg: '#fff3eb', ic: IndianRupee },
                                    { text: 'Staff meeting scheduled', desc: 'Meeting at 4:00 PM in staff room', t: '3 hours ago', col: '#7e22ce', bg: '#faf5ff', ic: Calendar },
                                    { text: 'New event created', desc: 'Annual Function 2025 details published', t: '5 hours ago', col: '#3b82f6', bg: '#e0f2fe', ic: AlertCircle }
                                ].map((n, i) => {
                                    const Icon = n.ic;
                                    return (
                                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <div style={{ backgroundColor: n.bg, color: n.col, padding: '0.45rem', borderRadius: '8px', flexShrink: 0 }}>
                                                <Icon size={14} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.text}</span>
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', flexShrink: 0 }}>{n.t}</span>
                                                </div>
                                                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Recent Activity</h3>
                                <span style={{ color: '#ea580c', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>View All</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                
                                {/* Act 1 */}
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <img 
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80" 
                                        alt="User Avatar" 
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Anjali Singh</span>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>Joined as Teacher (Mathematics)</p>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', flexShrink: 0 }}>2 hours ago</span>
                                </div>

                                {/* Act 2 */}
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <img 
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" 
                                        alt="User Avatar" 
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Rohit Verma</span>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>New admission in Class 11</p>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', flexShrink: 0 }}>4 hours ago</span>
                                </div>

                                {/* Act 3 */}
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <IndianRupee size={14} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Fee of ₹15,000 collected</span>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>From Class 9B student</p>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', flexShrink: 0 }}>6 hours ago</span>
                                </div>

                                {/* Act 4 */}
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: '#e0f2fe', color: '#0284c7', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Play size={12} fill="#0284c7" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Sports Day event created</span>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>For next month schedule</p>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', flexShrink: 0 }}>1 day ago</span>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <style>{`
                .sidebar-toggle-btn {
                    display: none;
                }
                @media (max-width: 1024px) {
                    .dashboard-grid-layout {
                        grid-template-columns: 1fr !important;
                    }
                    .sidebar-toggle-btn {
                        display: block !important;
                    }
                }
                .action-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 4px 12px var(--border-color);
                    border-color: #ea580c !important;
                }
                body.dark .action-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
            `}</style>
        </div>
    );
};

export default PrincipalDashboard;
