import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const StudentLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ reason: '', startDate: '', endDate: '', teacherId: '' });
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchLeaves();
        fetchTeachers();
    }, []);

    const fetchLeaves = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/my-leaves', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setLeaves(data);
        } catch (err) { console.error(err); }
    };

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/teachers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTeachers(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/student/request-leave', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Leave request sent successfully!');
            setShowForm(false);
            setFormData({ reason: '', startDate: '', endDate: '', teacherId: '' });
            fetchLeaves();
        } catch (err) { alert('Error sending request'); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="student" />
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h1>My Leave Requests</h1>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'View My Leaves' : 'Apply for Leave'}
                    </button>
                </div>

                {showForm ? (
                    <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', backgroundColor: 'white' }}>
                        <h3>Application Form</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
                            <select onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} required className="form-input">
                                <option value="">Select Teacher to Notify</option>
                                {teachers.map(t => <option key={t._id} value={t.user?._id}>{t.teacherName} ({t.subject})</option>)}
                            </select>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem' }}>Start Date</label>
                                    <input type="date" required onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="form-input" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem' }}>End Date</label>
                                    <input type="date" required onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="form-input" style={{ width: '100%' }} />
                                </div>
                            </div>
                            <textarea placeholder="Reason for leave..." required onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="form-input" rows="4"></textarea>
                            <button type="submit" className="btn btn-primary">Submit Request</button>
                        </form>
                    </div>
                ) : (
                    <div className="glass-card" style={{ overflowX: 'auto', backgroundColor: 'white' }}>
                        <table className="data-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Period</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map(l => (
                                    <tr key={l._id}>
                                        <td style={{ padding: '1rem' }}>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>{l.reason}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.8rem', 
                                                backgroundColor: l.status === 'Approved' ? '#dcfce7' : l.status === 'Rejected' ? '#fee2e2' : '#fef9c3',
                                                color: l.status === 'Approved' ? '#15803d' : l.status === 'Rejected' ? '#b91c1c' : '#a16207'
                                            }}>
                                                {l.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{l.teacherComment || '-'}</td>
                                    </tr>
                                ))}
                                {leaves.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No leave applications found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <style jsx>{`
                .form-input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 6px; }
            `}</style>
        </div>
    );
};

export default StudentLeaves;
