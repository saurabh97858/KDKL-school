import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const TeacherResults = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [results, setResults] = useState([]);
    const [examType, setExamType] = useState('Final');
    const [file, setFile] = useState(null);
    const [className, setClassName] = useState('1');

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
        if (!file || !selectedStudent) return alert('Select student and file');

        const formData = new FormData();
        formData.append('resultPdf', file);
        formData.append('studentId', selectedStudent);
        formData.append('examType', examType);
        formData.append('date', new Date().toISOString());

        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/upload-result', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Result uploaded successfully');
            setFile(null);
            fetchResults();
        } catch (err) { alert('Upload failed'); }
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

    return (
        <div className="dashboard-container">
            <Sidebar role="teacher" />
            <div className="dashboard-content">
                <h1>Manage Results</h1>
                <p>Upload new results or manage existing ones for your students.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                    <div className="glass-card" style={{ padding: '2rem', backgroundColor: 'white' }}>
                        <h3>Upload New Result</h3>
                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
                            <input type="text" placeholder="Class" value={className} onChange={(e) => setClassName(e.target.value)} className="form-input" />
                            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required className="form-input">
                                <option value="">Select Student</option>
                                {students.map(s => <option key={s._id} value={s._id}>{s.studentName}</option>)}
                            </select>
                            <select value={examType} onChange={(e) => setExamType(e.target.value)} className="form-input">
                                <option value="Unit Test 1">Unit Test 1</option>
                                <option value="Half Yearly">Half Yearly</option>
                                <option value="Final">Final</option>
                            </select>
                            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required />
                            <button type="submit" className="btn btn-primary">Upload PDF Result</button>
                        </form>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', backgroundColor: 'white' }}>
                        <h3>Existing Results</h3>
                        {!selectedStudent ? (
                            <p style={{ marginTop: '1rem', color: '#666' }}>Select a student to view their previous results.</p>
                        ) : (
                            <div style={{ marginTop: '1rem' }}>
                                {results.map(r => (
                                    <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', borderBottom: '1px solid #eee' }}>
                                        <div>
                                            <span style={{ fontWeight: 'bold' }}>{r.examType}</span>
                                            <p style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(r.date).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${r.pdfUrl}`} target="_blank" rel="noreferrer" style={{ color: 'blue', fontSize: '0.9rem', textDecoration: 'none' }}>View</a>
                                            <button onClick={() => handleDelete(r._id)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer', fontSize: '0.9rem' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {results.length === 0 && <p style={{ color: '#666' }}>No results uploaded yet for this student.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .form-input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 6px; }
            `}</style>
        </div>
    );
};

export default TeacherResults;
