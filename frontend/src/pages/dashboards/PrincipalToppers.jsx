import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Trophy, Trash2, Plus, Star, GraduationCap, BarChart2, Users, ClipboardList, Filter, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PrincipalToppers = () => {
    const [toppers, setToppers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '', className: '', percentage: '', stream: '', examTerm: ''
    });
    const [file, setFile] = useState(null);
    const [editingTopper, setEditingTopper] = useState(null); // topper being edited
    const [editForm, setEditForm] = useState({});
    const [editFile, setEditFile] = useState(null);

    // Filters
    const [filterClass, setFilterClass] = useState('All Classes');
    const [filterExam, setFilterExam] = useState('All Exams');
    const [filterStream, setFilterStream] = useState('All Streams');

    useEffect(() => {
        fetchToppers();
    }, []);

    const fetchToppers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/toppers',
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setToppers(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('topperPic', file);

        try {
            await axios.post(
                (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/toppers',
                data,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setShowAdd(false);
            setFormData({ studentName: '', className: '', percentage: '', stream: '', examTerm: '' });
            setFile(null);
            fetchToppers();
        } catch (err) { alert(err.response?.data?.message || 'Error occurred'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this topper?')) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/toppers/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchToppers();
        } catch (err) { console.error(err); }
    };

    const startEdit = (t) => {
        setEditingTopper(t._id);
        setEditForm({ studentName: t.studentName, className: t.className, percentage: t.percentage, stream: t.stream || '', examTerm: t.examTerm || '' });
        setEditFile(null);
    };

    const handleEdit = async (e, id) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(editForm).forEach(key => data.append(key, editForm[key]));
        if (editFile) data.append('topperPic', editFile);
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/toppers/${id}`,
                data,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setEditingTopper(null);
            fetchToppers();
        } catch (err) { alert(err.response?.data?.message || 'Update failed'); }
    };

    // Stats computed from toppers
    const totalToppers = toppers.length;
    const highestScore = toppers.length > 0
        ? Math.max(...toppers.map(t => parseFloat(t.percentage) || 0))
        : 0;
    const averageScore = toppers.length > 0
        ? (toppers.reduce((sum, t) => sum + (parseFloat(t.percentage) || 0), 0) / toppers.length).toFixed(0)
        : 0;
    const uniqueClasses = new Set(toppers.map(t => t.className)).size;

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content toppers-panel">
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        <div className="header-icon-container" style={{
                            background: '#fef9c3',
                            borderRadius: '12px',
                            width: '52px',
                            height: '52px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Trophy color="#d97706" size={26} />
                        </div>
                        <div>
                            <h1 style={{ color: '#1e1b4b', margin: 0, fontSize: '1.85rem', fontWeight: '800' }} className="panel-title">
                                Academic Toppers
                            </h1>
                            <p style={{ color: '#6b7280', margin: '4px 0 0' }} className="panel-subtitle">
                                Manage and showcase students who secured top positions.
                            </p>
                        </div>
                    </div>
                    <button
                        className="btn add-topper-btn"
                        onClick={() => setShowAdd(!showAdd)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.65rem 1.4rem', borderRadius: '10px', border: 'none',
                            color: 'white', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer'
                        }}
                    >
                        {showAdd ? <><X size={16} /> Close</> : <><Plus size={16} /> Add New Topper</>}
                    </button>
                </div>

                {/* Add Topper Form */}
                <AnimatePresence>
                    {showAdd && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            className="glass-card add-form-card"
                            style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden' }}
                        >
                            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '5px', color: '#374151' }}>Student Name</label>
                                    <input type="text" className="form-input" required value={formData.studentName}
                                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '5px', color: '#374151' }}>Class</label>
                                    <input type="text" className="form-input" placeholder="e.g. Class 12" required value={formData.className}
                                        onChange={(e) => setFormData({ ...formData, className: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '5px', color: '#374151' }}>Stream</label>
                                    <select className="form-input" value={formData.stream}
                                        onChange={(e) => setFormData({ ...formData, stream: e.target.value })}>
                                        <option value="">-- Select Stream --</option>
                                        <option value="Science Stream">Science Stream</option>
                                        <option value="Commerce Stream">Commerce Stream</option>
                                        <option value="Arts Stream">Arts Stream</option>
                                        <option value="Hindi Medium">Hindi Medium</option>
                                        <option value="English Medium">English Medium</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '5px', color: '#374151' }}>Exam / Term</label>
                                    <input type="text" className="form-input" placeholder="e.g. Annual Examination 2025" value={formData.examTerm}
                                        onChange={(e) => setFormData({ ...formData, examTerm: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '5px', color: '#374151' }}>Percentage (%)</label>
                                    <input type="text" className="form-input" required value={formData.percentage}
                                        onChange={(e) => setFormData({ ...formData, percentage: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '5px', color: '#374151' }}>Student Photo</label>
                                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
                                        style={{ fontSize: '0.82rem', width: '100%' }} />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ height: '42px', fontWeight: '700' }}>
                                    Save Topper
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filter Row */}
                <div className="glass-card filter-row-card" style={{ padding: '1.2rem 1.5rem', marginBottom: '2rem', borderRadius: '14px', display: 'flex', flexWrap: 'wrap', gap: '1.2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class</label>
                        <select className="form-input filter-select" value={filterClass} onChange={e => setFilterClass(e.target.value)}
                            style={{ borderRadius: '8px', padding: '0.45rem 0.7rem', fontSize: '0.88rem', minWidth: '160px' }}>
                            <option>All Classes</option>
                            {['Nursery','LKG','UKG','1','2','3','4','5','6','7','8','9','10','11','12'].map(c => (
                                <option key={c} value={`Class ${c}`}>Class {c}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Exam / Term</label>
                        <select className="form-input filter-select" value={filterExam} onChange={e => setFilterExam(e.target.value)}
                            style={{ borderRadius: '8px', padding: '0.45rem 0.7rem', fontSize: '0.88rem', minWidth: '160px' }}>
                            <option>All Exams</option>
                            <option>Annual Examination 2025</option>
                            <option>Half Yearly 2025</option>
                            <option>Unit Test 1</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stream</label>
                        <select className="form-input filter-select" value={filterStream} onChange={e => setFilterStream(e.target.value)}
                            style={{ borderRadius: '8px', padding: '0.45rem 0.7rem', fontSize: '0.88rem', minWidth: '160px' }}>
                            <option>All Streams</option>
                            <option>Science Stream</option>
                            <option>Commerce Stream</option>
                            <option>Arts Stream</option>
                            <option>Hindi Medium</option>
                            <option>English Medium</option>
                        </select>
                    </div>
                    <button className="btn filter-apply-btn" style={{ marginTop: '1.1rem', padding: '0.45rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <Filter size={14} /> Filter
                    </button>
                </div>

                {/* Topper Cards Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                        <Trophy size={40} style={{ opacity: 0.3, marginBottom: '0.8rem' }} />
                        <p>Loading toppers...</p>
                    </div>
                ) : (
                    <>
                        {toppers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                                <Trophy size={60} style={{ marginBottom: '1rem', color: '#d97706' }} />
                                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No toppers added yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                {toppers.map((t, index) => {
                                    const position = index + 1;
                                    const ribbonColor = position === 1 ? '#d97706' : position === 2 ? '#9ca3af' : position === 3 ? '#cd7c2f' : '#6b7280';

                                    return (
                                        <motion.div
                                            key={t._id}
                                            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="glass-card topper-card"
                                            style={{ padding: '1.5rem', position: 'relative', borderRadius: '16px', overflow: 'visible' }}
                                        >
                                            {/* Position Ribbon Badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                left: '-10px',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: ribbonColor,
                                                color: 'white',
                                                fontWeight: '800',
                                                fontSize: '0.88rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 4px 8px ${ribbonColor}44`,
                                                zIndex: 2
                                            }}>
                                                {position}
                                            </div>

                                            {/* Edit + Delete Buttons */}
                                            <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                                                <button
                                                    onClick={() => startEdit(t)}
                                                    style={{
                                                        background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                                                        borderRadius: '8px', width: '32px', height: '32px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', color: '#3b82f6', transition: 'all 0.2s ease'
                                                    }}
                                                    title="Edit topper"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t._id)}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)',
                                                        borderRadius: '8px', width: '32px', height: '32px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', color: '#ef4444', transition: 'all 0.2s ease'
                                                    }}
                                                    title="Delete topper"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            {/* Card Content */}
                                            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', paddingTop: '0.5rem' }}>
                                                {/* Profile Picture */}
                                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                                    {t.imageUrl ? (
                                                        <img
                                                            src={t.imageUrl}
                                                            alt={t.studentName}
                                                            style={{
                                                                width: '72px', height: '72px', borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                border: `3px solid ${ribbonColor}`,
                                                                boxShadow: `0 0 0 4px ${ribbonColor}22`
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            width: '72px', height: '72px', borderRadius: '50%',
                                                            background: `${ribbonColor}22`,
                                                            border: `3px solid ${ribbonColor}`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '1.6rem', fontWeight: '800', color: ribbonColor
                                                        }}>
                                                            {t.studentName?.[0]?.toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div>
                                                    <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem', color: '#1f2937' }} className="topper-name">
                                                        {t.studentName}
                                                    </h3>
                                                    <div style={{ marginTop: '4px' }}>
                                                        <span style={{
                                                            background: '#dbeafe', color: '#1d4ed8',
                                                            padding: '2px 10px', borderRadius: '20px',
                                                            fontSize: '0.75rem', fontWeight: '700'
                                                        }} className="class-badge">
                                                            Class {t.className}
                                                        </span>
                                                    </div>
                                                    {t.stream && (
                                                        <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '0.85rem' }} className="stream-text">{t.stream}</p>
                                                    )}
                                                    {/* Percentage Badge */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                                                        <Star size={14} fill="#ef4444" color="#ef4444" />
                                                        <span style={{ color: '#b91c1c', fontWeight: '800', fontSize: '1rem' }}>{t.percentage}%</span>
                                                    </div>
                                                    {t.examTerm && (
                                                        <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.75rem' }} className="exam-text">{t.examTerm}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Inline Edit Form */}
                                            {editingTopper === t._id && (
                                                <form onSubmit={(e) => handleEdit(e, t._id)} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                                    <input className="form-input" type="text" placeholder="Name" value={editForm.studentName} onChange={e => setEditForm({ ...editForm, studentName: e.target.value })} required style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
                                                    <input className="form-input" type="text" placeholder="Class" value={editForm.className} onChange={e => setEditForm({ ...editForm, className: e.target.value })} required style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
                                                    <input className="form-input" type="text" placeholder="Percentage" value={editForm.percentage} onChange={e => setEditForm({ ...editForm, percentage: e.target.value })} required style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
                                                    <input className="form-input" type="text" placeholder="Stream" value={editForm.stream} onChange={e => setEditForm({ ...editForm, stream: e.target.value })} style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
                                                    <input className="form-input" type="text" placeholder="Exam/Term" value={editForm.examTerm} onChange={e => setEditForm({ ...editForm, examTerm: e.target.value })} style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
                                                    <input type="file" accept="image/*" onChange={e => setEditFile(e.target.files[0])} style={{ fontSize: '0.78rem' }} />
                                                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                        <button type="submit" style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>Save</button>
                                                        <button type="button" onClick={() => setEditingTopper(null)} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                                                    </div>
                                                </form>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Bottom Stats Grid */}
                        {toppers.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }} className="stats-grid">
                                {/* Total Toppers */}
                                <div className="glass-card stat-block" style={{ padding: '1.2rem 1.4rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#ede9fe', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Users size={22} color="#6d28d9" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }} className="stat-label">Total Toppers</p>
                                        <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1f2937' }} className="stat-value">{totalToppers}</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#9ca3af' }}>All Time</p>
                                    </div>
                                </div>

                                {/* Highest Score */}
                                <div className="glass-card stat-block" style={{ padding: '1.2rem 1.4rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#dcfce7', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <GraduationCap size={22} color="#15803d" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }} className="stat-label">Highest Score</p>
                                        <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1f2937' }} className="stat-value">{highestScore}%</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#9ca3af' }}>All Time</p>
                                    </div>
                                </div>

                                {/* Average Score */}
                                <div className="glass-card stat-block" style={{ padding: '1.2rem 1.4rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#ffedd5', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BarChart2 size={22} color="#c2410c" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }} className="stat-label">Average Score</p>
                                        <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1f2937' }} className="stat-value">{averageScore}%</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#9ca3af' }}>All Time</p>
                                    </div>
                                </div>

                                {/* Total Classes */}
                                <div className="glass-card stat-block" style={{ padding: '1.2rem 1.4rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#dbeafe', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ClipboardList size={22} color="#1d4ed8" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }} className="stat-label">Total Classes</p>
                                        <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1f2937' }} className="stat-value">{uniqueClasses}</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#9ca3af' }}>With Toppers</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
                /* === LIGHT THEME SCOPED OVERRIDES === */
                body:not(.dark) .toppers-panel {
                    background-color: #fcfbf7 !important;
                }

                body:not(.dark) .add-topper-btn {
                    background: linear-gradient(135deg, #7c3aed, #db2777) !important;
                    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2) !important;
                }
                body:not(.dark) .add-topper-btn:hover {
                    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3) !important;
                    transform: translateY(-1px);
                }

                body:not(.dark) .add-form-card,
                body:not(.dark) .filter-row-card,
                body:not(.dark) .topper-card,
                body:not(.dark) .stat-block {
                    background: #ffffff !important;
                    border: 1px solid #f3f4f6 !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02) !important;
                }

                body:not(.dark) .filter-select {
                    background: #f9fafb !important;
                    border: 1.5px solid #e5e7eb !important;
                    color: #374151 !important;
                }
                body:not(.dark) .filter-select:focus {
                    border-color: #6d28d9 !important;
                    box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.08) !important;
                }

                body:not(.dark) .filter-apply-btn {
                    background: #f3f4f6 !important;
                    border: 1.5px solid #e5e7eb !important;
                    color: #374151 !important;
                }
                body:not(.dark) .filter-apply-btn:hover {
                    background: #e5e7eb !important;
                }

                body:not(.dark) .topper-name { color: #111827 !important; }
                body:not(.dark) .stream-text { color: #6b7280 !important; }
                body:not(.dark) .exam-text { color: #9ca3af !important; }
                body:not(.dark) .stat-label { color: #6b7280 !important; }
                body:not(.dark) .stat-value { color: #111827 !important; }
            `}</style>
        </div>
    );
};

export default PrincipalToppers;
