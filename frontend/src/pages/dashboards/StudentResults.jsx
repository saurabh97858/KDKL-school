import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const StudentResults = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/results', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setResults(data);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="student" />
            <div className="dashboard-content">
                <h1>Examination Results</h1>
                <p>View and download your academic performance reports</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                    {results.map(r => (
                        <div key={r._id} className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'white', borderLeft: '6px solid #1a2a6c' }}>
                            <h3 style={{ color: '#1a2a6c' }}>{r.examType}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Date: {new Date(r.date).toLocaleDateString()}</p>
                            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Uploaded by: {r.teacher?.name || 'Teacher'}</p>
                            <a 
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${r.pdfUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-primary" 
                                style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none', fontSize: '0.9rem' }}
                            >
                                Download / View PDF
                            </a>
                        </div>
                    ))}
                    {results.length === 0 && <p style={{ marginTop: '1rem', color: '#666' }}>No results uploaded yet for you.</p>}
                </div>
            </div>
        </div>
    );
};

export default StudentResults;
