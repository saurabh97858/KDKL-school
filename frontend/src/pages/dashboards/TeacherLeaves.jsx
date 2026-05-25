import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const TeacherLeaves = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/leave-requests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setLeaves(data);
        } catch (err) { console.error(err); }
    };

    const handleAction = async (leaveId, status) => {
        const comment = prompt('Enter comment (optional):');
        try {
            await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/manage-leave', 
                { leaveId, status, teacherComment: comment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert(`Leave ${status}`);
            fetchLeaves();
        } catch (err) { alert('Action failed'); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="teacher" />
            <div className="dashboard-content">
                <h1>Leave Requests</h1>
                <p>Review and manage student leave applications</p>

                <div className="glass-card" style={{ marginTop: '2rem', overflowX: 'auto', backgroundColor: 'white' }}>
                    <table className="data-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Period</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(l => (
                                <tr key={l._id}>
                                    <td>{l.student?.studentName}</td>
                                    <td>{l.student?.className}</td>
                                    <td>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                                    <td>{l.reason}</td>
                                    <td>
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
                                    <td>
                                        {l.status === 'Pending' && (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button onClick={() => handleAction(l._id, 'Approved')} className="btn" style={{ background: '#dcfce7', color: '#15803d', padding: '5px 10px', fontSize: '0.8rem' }}>Approve</button>
                                                <button onClick={() => handleAction(l._id, 'Rejected')} className="btn" style={{ background: '#fee2e2', color: '#b91c1c', padding: '5px 10px', fontSize: '0.8rem' }}>Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {leaves.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No leave requests found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherLeaves;
