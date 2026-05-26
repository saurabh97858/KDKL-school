import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { FileText, Upload, Trash2, ExternalLink, GraduationCap, Search, CalendarDays, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherResults = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [results, setResults] = useState([]);
    const [examType, setExamType] = useState('Final');
    const [file, setFile] = useState(null);
    const [className, setClassName] = useState('1');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, [className]);

    useEffect(() => {
        if (selectedStudent) fetchResults();
        else setResults([]);
    }, [selectedStudent]);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/students/${className}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(data);
        } catch (err) { console.error(err); }
    };

    const fetchResults = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/results/${selectedStudent}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setResults(data);
        } catch (err) { console.error(err); }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !selectedStudent) return alert('Please select a student and a PDF file');
        const formData = new FormData();
        formData.append('resultPdf', file);
        formData.append('studentId', selectedStudent);
        formData.append('examType', examType);
        formData.append('date', new Date().toISOString());
        setUploading(true);
        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/upload-result', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Result uploaded successfully');
            setFile(null);
            fetchResults();
        } catch (err) { alert('Upload failed'); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this result?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/result/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchResults();
        } catch (err) { alert('Delete failed'); }
    };

    const selectedStudentName = students.find(s => s._id === selectedStudent)?.studentName || '';

    const examTypeColors = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('half') || t.includes('mid')) return { color: '#0284c7', bg: '#e0f2fe' };
        if (t.includes('annual') || t.includes('final')) return { color: '#8b5cf6', bg: '#faf5ff' };
        if (t.includes('unit')) return { color: '#ea580c', bg: '#fff3eb' };
        return { color: '#16a34a', bg: '#dcfce7' };
    };

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="teacher" />
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Manage Results</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>
                        Upload and manage examination PDF results for your students
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.4fr)', gap: '1.5rem', alignItems: 'start' }}>

                    {/* Upload Form */}
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.4rem', textAlign: 'left' }}>
                            <div style={{ background: '#faf5ff', color: '#8b5cf6', padding: '7px', borderRadius: '10px' }}>
                                <Upload size={16} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Upload New Result</h3>
                        </div>

                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Class Input */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Class</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 10, 11A"
                                    value={className}
                                    onChange={e => setClassName(e.target.value)}
                                    style={{ padding: '0.6rem 1rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: '600' }}
                                />
                            </div>

                            {/* Student Select */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Student</label>
                                <div style={{ position: 'relative' }}>
                                    <GraduationCap size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        value={selectedStudent}
                                        onChange={e => setSelectedStudent(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(s => (
                                            <option key={s._id} value={s._id}>{s.studentName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Exam Type */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Exam Type</label>
                                <div style={{ position: 'relative' }}>
                                    <BookOpen size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        value={examType}
                                        onChange={e => setExamType(e.target.value)}
                                        style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', border: '1.5px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        <option value="Unit Test 1">Unit Test 1</option>
                                        <option value="Unit Test 2">Unit Test 2</option>
                                        <option value="Half Yearly">Half Yearly</option>
                                        <option value="Final">Final / Annual</option>
                                    </select>
                                </div>
                            </div>

                            {/* File Upload */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>PDF Result File</label>
                                <label htmlFor="result-pdf-upload" style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '0.65rem 1rem', border: '1.5px dashed var(--border-color)',
                                    borderRadius: '10px', backgroundColor: 'var(--bg-light)',
                                    color: file ? '#8b5cf6' : 'var(--text-secondary)',
                                    fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                    <FileText size={15} style={{ flexShrink: 0 }} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {file ? file.name : 'Choose PDF File'}
                                    </span>
                                    <input
                                        id="result-pdf-upload"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={e => setFile(e.target.files[0])}
                                        required
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                                    color: 'white', border: 'none', borderRadius: '10px',
                                    padding: '0.7rem', fontWeight: '700', fontSize: '0.88rem',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    opacity: uploading ? 0.7 : 1,
                                    boxShadow: '0 4px 15px rgba(139,92,246,0.25)',
                                    marginTop: '0.4rem'
                                }}
                            >
                                <Upload size={15} />
                                {uploading ? 'Uploading...' : 'Upload PDF Result'}
                            </button>
                        </form>
                    </div>

                    {/* Existing Results Panel */}
                    <div className="glass-card" style={{ border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '7px', borderRadius: '10px' }}>
                                <FileText size={16} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                {selectedStudentName ? `Results — ${selectedStudentName}` : 'Existing Results'}
                            </h3>
                        </div>

                        <div style={{ padding: '1.2rem 1.5rem' }}>
                            {!selectedStudent ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                                    <div style={{ background: '#f1f5f9', color: '#94a3b8', padding: '1rem', borderRadius: '50%' }}>
                                        <Search size={28} />
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontWeight: '600', margin: 0, fontSize: '0.9rem' }}>
                                        Select a student to view their previous results
                                    </p>
                                </div>
                            ) : results.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontWeight: '600', margin: 0 }}>
                                        No results uploaded yet for this student.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {results.map((r, idx) => {
                                        const style = examTypeColors(r.examType);
                                        return (
                                            <motion.div
                                                key={r._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '1rem 1.2rem',
                                                    background: 'var(--bg-light)',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid var(--border-color)',
                                                    flexWrap: 'wrap',
                                                    gap: '0.8rem'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                                                    <div style={{ background: style.bg, color: style.color, padding: '8px', borderRadius: '10px', flexShrink: 0 }}>
                                                        <FileText size={16} />
                                                    </div>
                                                    <div>
                                                        <span style={{ background: style.bg, color: style.color, padding: '0.15rem 0.55rem', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '800' }}>
                                                            {r.examType?.toUpperCase()}
                                                        </span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: '600' }}>
                                                            <CalendarDays size={11} />
                                                            {new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${r.pdfUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', textDecoration: 'none', cursor: 'pointer' }}
                                                    >
                                                        <ExternalLink size={12} /> View
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(r._id)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherResults;
