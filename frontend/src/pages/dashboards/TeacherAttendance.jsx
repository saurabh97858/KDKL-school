import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const TeacherAttendance = () => {
    const [students, setStudents] = useState([]);
    const [history, setHistory] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [className, setClassName] = useState('1'); 
    const [viewMode, setViewMode] = useState('mark'); // 'mark' or 'history'

    useEffect(() => {
        if (viewMode === 'mark') fetchStudents();
        else fetchHistory();
    }, [className, date, viewMode]);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/students/${className}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(data);
        } catch (err) { console.error(err); }
    };

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/attendance-history?className=${className}&date=${date}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setHistory(data);
        } catch (err) { console.error(err); }
    };

    const handleAttendance = async (studentId, status) => {
        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/teacher/attendance', 
                { studentId, date, status, className },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert(`Attendance for ${status} marked.`);
            if (viewMode === 'history') fetchHistory();
        } catch (err) { alert('Error marking attendance'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/attendance/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchHistory();
        } catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="teacher" />
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Attendance Management</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className={`btn ${viewMode === 'mark' ? 'btn-primary' : ''}`} onClick={() => setViewMode('mark')}>Mark Attendance</button>
                        <button className={`btn ${viewMode === 'history' ? 'btn-primary' : ''}`} onClick={() => setViewMode('history')}>Attendance History</button>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
                    <input type="text" placeholder="Class" value={className} onChange={(e) => setClassName(e.target.value)} className="form-input" style={{ width: '100px' }} />
                </div>

                {viewMode === 'mark' ? (
                    <div className="glass-card" style={{ overflowX: 'auto', backgroundColor: 'white' }}>
                        <table className="data-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s._id}>
                                        <td>{s.studentName}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleAttendance(s._id, 'Present')} style={{ background: '#dcfce7', color: '#15803d', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}>Present</button>
                                                <button onClick={() => handleAttendance(s._id, 'Absent')} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}>Absent</button>
                                                <button onClick={() => handleAttendance(s._id, 'Leave')} style={{ background: '#fef9c3', color: '#a16207', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}>Leave</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="glass-card" style={{ overflowX: 'auto', backgroundColor: 'white' }}>
                        <table className="data-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(h => (
                                    <tr key={h._id}>
                                        <td>{h.student?.studentName}</td>
                                        <td>
                                            <span style={{ 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.8rem', 
                                                backgroundColor: h.status === 'Present' ? '#dcfce7' : h.status === 'Absent' ? '#fee2e2' : '#fef9c3',
                                                color: h.status === 'Present' ? '#15803d' : h.status === 'Absent' ? '#b91c1c' : '#a16207'
                                            }}>
                                                {h.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(h._id)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>No attendance records for this date.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <style jsx>{`
                .form-input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px; }
            `}</style>
        </div>
    );
};

export default TeacherAttendance;
