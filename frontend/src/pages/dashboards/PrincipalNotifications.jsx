import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Bell, Trash2, Edit2, Sparkles } from 'lucide-react';

const PrincipalNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('Emergency');
    const [editingId, setEditingId] = useState(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/notifications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(data);
        } catch (err) { console.error(err); }
    };

    const handleEdit = (n) => {
        setEditingId(n._id);
        setMessage(n.message);
        setType(n.type);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (editingId) {
                // Need PUT /notifications/:id route
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/notifications/${editingId}`, { message, type }, config);
                alert('Notification updated');
            } else {
                await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/notifications', { message, type }, config);
                alert('Notification added');
            }
            setMessage('');
            setEditingId(null);
            fetchNotifications();
        } catch (err) { alert('Action failed'); }
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
        } catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <h1>Emergency Notifications</h1>
                <p>Manage alerts that appear on the home page for students and parents.</p>

                <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>{editingId ? 'Edit Notification' : 'Post New Notification'}</h3>
                        {editingId && <button onClick={() => {setEditingId(null); setMessage('');}} className="btn btn-secondary">Cancel Edit</button>}
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* AI Alert Generator input */}
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                            <input 
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Write notice using AI (e.g. holiday on Friday for Diwali, meeting at 10 AM)..."
                                className="form-input"
                                style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                            />
                            <button
                                type="button"
                                onClick={handleAIGenerate}
                                disabled={aiLoading || !aiPrompt.trim()}
                                className="btn btn-secondary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                            >
                                <Sparkles size={14} color="var(--primary)" />
                                {aiLoading ? 'Composing...' : 'AI Compose'}
                            </button>
                        </div>

                        <textarea 
                            placeholder="Type your notification here..." 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            required 
                            className="form-input"
                            rows="3"
                        ></textarea>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <select value={type} onChange={(e) => setType(e.target.value)} className="form-input" style={{ width: '200px' }}>
                                <option value="Emergency">Emergency</option>
                                <option value="Holiday">Holiday</option>
                                <option value="Event">Event</option>
                            </select>
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update Alert' : 'Post Notification'}</button>
                        </div>
                    </form>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h3>Active Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {notifications.map(n => (
                            <div key={n._id} className="glass-card" style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `6px solid ${n.type === 'Emergency' ? 'red' : '#1a2a6c'}` }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: n.type === 'Emergency' ? 'red' : '#1a2a6c', textTransform: 'uppercase' }}>{n.type}</span>
                                    <p style={{ marginTop: '0.3rem' }}>{n.message}</p>
                                    <span style={{ fontSize: '0.7rem', color: '#999' }}>{new Date(n.createdAt).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleEdit(n)} style={{ background: 'none', border: 'none', color: '#1a2a6c', cursor: 'pointer' }}>
                                        <Edit2 size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(n._id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrincipalNotifications;
