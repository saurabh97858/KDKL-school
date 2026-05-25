import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const PrincipalApplications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/applications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setApplications(data);
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/application-status/${id}`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchApplications();
        } catch (err) { alert(err.response?.data?.message || 'Update failed'); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <h1>Admission Applications</h1>
                <p>View students who have applied for admission through the website.</p>

                <div className="glass-card" style={{ marginTop: '2rem', overflowX: 'auto', backgroundColor: 'white' }}>
                    <table className="data-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Class</th>
                                <th>Path</th>
                                <th>Father's Name</th>
                                <th>Contact</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td style={{ padding: '1rem' }}>{app.studentName}</td>
                                    <td style={{ padding: '1rem' }}>{app.className}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.8rem' }}>{app.medium} | {app.stream}</td>
                                    <td style={{ padding: '1rem' }}>{app.fatherName}</td>
                                    <td style={{ padding: '1rem' }}>{app.contactNumber}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.8rem', 
                                            backgroundColor: app.status === 'Accepted' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef9c3',
                                            color: app.status === 'Accepted' ? '#166534' : app.status === 'Rejected' ? '#991b1b' : '#a16207'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        {app.status === 'Pending' && (
                                            <>
                                                <button onClick={() => updateStatus(app._id, 'Accepted')} style={{ padding: '5px 12px', borderRadius: '6px', background: '#22c55e', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Accept</button>
                                                <button onClick={() => updateStatus(app._id, 'Rejected')} style={{ padding: '5px 12px', borderRadius: '6px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Reject</button>
                                            </>
                                        )}
                                        {app.status !== 'Pending' && <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Decision Made</span>}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No new applications found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PrincipalApplications;
