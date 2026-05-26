import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { 
    Bell, 
    Trash2, 
    Edit2, 
    Sparkles, 
    Send, 
    Info, 
    Paperclip, 
    Search, 
    Filter, 
    Eye, 
    Check, 
    MoreVertical,
    FileText,
    Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('Emergency');
    const [editingId, setEditingId] = useState(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Types');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/notifications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(data);
        } catch (err) { 
            console.error('Error fetching notifications:', err); 
        }
    };

    const handleEdit = (n) => {
        setEditingId(n._id);
        setMessage(n.message);
        setType(n.type);
        // Scroll to form smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/notifications/${editingId}`, { message, type }, config);
            } else {
                await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/notifications', { message, type }, config);
            }
            setMessage('');
            setEditingId(null);
            fetchNotifications();
        } catch (err) { 
            alert('Action failed'); 
        }
    };

    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setAiLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const { data } = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/generate-notice', { prompt: aiPrompt }, config);
            setMessage(data.notice);
            setAiPrompt('');
        } catch (err) {
            alert('Failed to generate notice with AI');
        } finally {
            setAiLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this alert?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/notifications/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchNotifications();
        } catch (err) { 
            alert('Delete failed'); 
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'Recent';
        try {
            const d = new Date(dateStr);
            const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const date = d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
            return `${date} ${time}`;
        } catch {
            return 'Recent';
        }
    };

    // Client-side filtering
    const filteredNotifications = notifications.filter(n => {
        const matchesSearch = (n.message || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All Types' || n.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="principal" />
            
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
                
                {/* Header Row with illustration */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '1.5rem', 
                    backgroundColor: 'var(--card-bg)', 
                    border: '1.5px solid var(--border-color)', 
                    padding: '1.5rem 2rem', 
                    borderRadius: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', textAlign: 'left', zIndex: 2 }}>
                        <div style={{ backgroundColor: '#f5f3ff', color: '#6d28d9', padding: '0.8rem', borderRadius: '15px' }}>
                            <Megaphone size={28} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                Emergency Notifications
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem', margin: 0 }}>
                                Manage alerts that appear on the home page for students and parents.
                            </p>
                        </div>
                    </div>

                    {/* Megaphone Illustration SVG */}
                    <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.85, width: '130px', pointerEvents: 'none' }} className="megaphone-illustration">
                        <svg viewBox="0 0 100 100" width="100" height="100">
                            {/* Sparks */}
                            <path d="M 15 30 L 5 25" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                            <path d="M 20 15 L 15 5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                            <path d="M 35 10 L 38 0" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                            {/* Stand */}
                            <path d="M 65 65 L 75 80 L 80 80" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                            {/* Blue Megaphone Body */}
                            <path d="M 40 45 L 70 30 C 75 35 75 55 70 60 L 40 45" fill="#3b82f6" />
                            {/* Big Cone */}
                            <ellipse cx="40" cy="45" rx="8" ry="18" fill="#1d4ed8" />
                            {/* Bell/Handle */}
                            <path d="M 70 30 L 78 33 L 78 57 L 70 60 Z" fill="#64748b" />
                            <path d="M 72 45 Q 65 52 58 58 L 52 52" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                            {/* Golden Bell Overlay */}
                            <circle cx="82" cy="35" r="7" fill="#f59e0b" />
                            <path d="M 82 42 L 82 46" stroke="#d97706" strokeWidth="3" />
                        </svg>
                    </div>
                </div>

                {/* Form + Tip Container (Grid 70% / 30%) */}
                <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 0.8fr', gap: '1.5rem', alignItems: 'stretch' }} className="form-tip-grid">
                    
                    {/* Post Notification Form */}
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1.2rem' }}>
                            <Send size={18} color="#8b5cf6" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                {editingId ? 'Edit Notification' : 'Post New Notification'}
                            </h3>
                            {editingId && (
                                <button 
                                    onClick={() => { setEditingId(null); setMessage(''); }} 
                                    style={{ 
                                        marginLeft: 'auto', 
                                        border: '1.5px solid var(--border-color)', 
                                        borderRadius: '8px', 
                                        padding: '0.35rem 0.8rem', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '700',
                                        backgroundColor: 'transparent',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            
                            {/* AI Assist row */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Sparkles size={14} color="#8b5cf6" /> AI Compose (Optional)
                                </label>
                                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                                    <input 
                                        type="text"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="e.g. Holiday on Friday for Diwali, Meeting at 10 AM..."
                                        style={{ 
                                            flex: 1, 
                                            padding: '0.6rem 1rem', 
                                            borderRadius: '10px', 
                                            border: '1.5px solid var(--border-color)', 
                                            backgroundColor: 'var(--bg-light)', 
                                            color: 'var(--text-primary)',
                                            fontSize: '0.85rem',
                                            fontWeight: '500'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAIGenerate}
                                        disabled={aiLoading || !aiPrompt.trim()}
                                        style={{ 
                                            background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '10px', 
                                            padding: '0.6rem 1.2rem', 
                                            fontSize: '0.82rem', 
                                            fontWeight: '700', 
                                            cursor: aiLoading || !aiPrompt.trim() ? 'not-allowed' : 'pointer',
                                            opacity: aiLoading || !aiPrompt.trim() ? 0.6 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <Sparkles size={14} />
                                        {aiLoading ? 'Composing...' : 'AI Compose'}
                                    </button>
                                </div>
                            </div>

                            {/* Main Notification Textarea */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Write your notification here...</label>
                                <textarea 
                                    placeholder="Type your notification message..." 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    required 
                                    rows="4"
                                    maxLength="500"
                                    style={{ 
                                        width: '100%',
                                        padding: '0.8rem 1rem', 
                                        borderRadius: '12px', 
                                        border: '1.5px solid var(--border-color)', 
                                        backgroundColor: 'var(--card-bg)', 
                                        color: 'var(--text-primary)',
                                        fontSize: '0.88rem',
                                        lineHeight: '1.5',
                                        fontWeight: '500',
                                        resize: 'vertical'
                                    }}
                                ></textarea>
                                <span style={{ position: 'absolute', bottom: '10px', right: '15px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                    {message.length}/500
                                </span>
                            </div>

                            {/* Options Row */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Select Type</span>
                                    <select 
                                        value={type} 
                                        onChange={(e) => setType(e.target.value)} 
                                        style={{ 
                                            border: '1.5px solid var(--border-color)', 
                                            borderRadius: '10px', 
                                            padding: '0.55rem 1rem', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '600', 
                                            backgroundColor: 'var(--card-bg)', 
                                            color: 'var(--text-primary)',
                                            minWidth: '150px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="Emergency">Emergency</option>
                                        <option value="Holiday">Holiday</option>
                                        <option value="Event">Event</option>
                                    </select>
                                </div>

                                <button 
                                    type="button"
                                    style={{ 
                                        alignSelf: 'flex-end',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        border: '1.5px dashed var(--border-color)', 
                                        borderRadius: '10px', 
                                        backgroundColor: 'var(--card-bg)', 
                                        color: 'var(--text-secondary)', 
                                        padding: '0.55rem 1.2rem', 
                                        fontSize: '0.82rem', 
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        marginTop: '1.2rem'
                                    }}
                                >
                                    <Paperclip size={14} />
                                    Attach File (Optional)
                                </button>

                                <button 
                                    type="submit" 
                                    style={{ 
                                        alignSelf: 'flex-end',
                                        background: 'linear-gradient(to right, #e11d48, #db2777)', 
                                        color: 'white', 
                                        borderRadius: '10px', 
                                        padding: '0.62rem 1.8rem', 
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(225, 29, 72, 0.2)',
                                        marginLeft: 'auto',
                                        marginTop: '1.2rem'
                                    }}
                                >
                                    {editingId ? 'Update Alert' : 'Post Notification'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Side Tip Card */}
                    <div className="glass-card" style={{ 
                        padding: '1.5rem', 
                        border: 'none', 
                        backgroundColor: '#eff6ff', 
                        color: '#1e40af', 
                        borderRadius: '20px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px',
                        textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.95rem' }}>
                            <Info size={18} color="#1d4ed8" />
                            Tip
                        </div>
                        <p style={{ fontSize: '0.82rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>
                            Use short, clear and important messages so parents notice immediately.
                        </p>
                    </div>

                </div>

                {/* Active Notifications Section */}
                <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'left' }}>
                            <FileText size={18} color="#8b5cf6" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                Active Notifications ({filteredNotifications.length})
                            </h3>
                        </div>

                        {/* Search and Filters */}
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end', maxWidth: '600px' }}>
                            <div style={{ position: 'relative', width: '220px' }}>
                                <Search size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search notifications..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.45rem 1rem 0.45rem 2rem', 
                                        borderRadius: '8px', 
                                        border: '1.5px solid var(--border-color)', 
                                        backgroundColor: 'var(--card-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.8rem',
                                        fontWeight: '500'
                                    }} 
                                />
                            </div>

                            <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                style={{ 
                                    border: '1.5px solid var(--border-color)', 
                                    borderRadius: '8px', 
                                    padding: '0.45rem 0.8rem', 
                                    fontSize: '0.8rem', 
                                    fontWeight: '600', 
                                    backgroundColor: 'var(--card-bg)', 
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="All Types">All Types</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Holiday">Holiday</option>
                                <option value="Event">Event</option>
                            </select>

                            <button style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '5px', 
                                border: '1.5px solid var(--border-color)', 
                                borderRadius: '8px', 
                                backgroundColor: 'var(--card-bg)', 
                                color: 'var(--text-primary)', 
                                padding: '0.45rem 0.8rem', 
                                fontSize: '0.8rem', 
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}>
                                <Filter size={13} color="#8b5cf6" />
                                All Types
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                    <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Title</th>
                                    <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '120px' }}>Type</th>
                                    <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '160px' }}>Posted On</th>
                                    <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '150px', textAlign: 'center' }}>Visible on Home</th>
                                    <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '100px' }}>Status</th>
                                    <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '150px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNotifications.map(n => {
                                    // Set tag colors
                                    let badgeBg = '#fff3eb';
                                    let badgeText = '#ea580c';
                                    let typeLabel = n.type;
                                    if (n.type === 'Emergency') {
                                        badgeBg = '#fee2e2';
                                        badgeText = '#ef4444';
                                        typeLabel = 'Emergency';
                                    } else if (n.type === 'Holiday') {
                                        badgeBg = '#e0f2fe';
                                        badgeText = '#0284c7';
                                        typeLabel = 'Holiday';
                                    } else if (n.type === 'Event') {
                                        badgeBg = '#f3e8ff';
                                        badgeText = '#7e22ce';
                                        typeLabel = 'Event';
                                    }

                                    return (
                                        <tr key={n._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', maxWidth: '300px', wordWrap: 'break-word' }}>
                                                {n.message}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ 
                                                    padding: '0.2rem 0.6rem', 
                                                    borderRadius: '6px', 
                                                    fontSize: '0.72rem', 
                                                    fontWeight: '800',
                                                    backgroundColor: badgeBg,
                                                    color: badgeText
                                                }}>
                                                    {typeLabel}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                                {formatDateTime(n.createdAt)}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '0.78rem', fontWeight: '700', backgroundColor: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '20px' }}>
                                                    <Check size={12} strokeWidth={3} />
                                                    Yes
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ color: '#16a34a', fontSize: '0.78rem', fontWeight: '700', backgroundColor: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                                    Active
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                        <Eye size={15} />
                                                    </button>
                                                    <button onClick={() => handleEdit(n)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button onClick={() => handleDelete(n._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                        <MoreVertical size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                
                                {filteredNotifications.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                            No active notifications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            
            <style>{`
                @media (max-width: 768px) {
                    .form-tip-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .megaphone-illustration {
                        display: none !important;
                    }
                }
                body.dark .glass-card[style*="backgroundColor: rgb(239, 246, 255)"] {
                    background-color: rgba(30, 41, 59, 0.5) !important;
                    color: #93c5fd !important;
                }
            `}</style>
        </div>
    );
};

export default PrincipalNotifications;
