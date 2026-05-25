import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const PrincipalManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('1');
    const [selectedMedium, setSelectedMedium] = useState('');
    const [selectedStream, setSelectedStream] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', email: '', mobileNumber: '', className: '1',
        motherName: '', fatherName: '', contactNumber: '', permanentAddress: '', currentAddress: '',
        fees: '', previousSchool: '', admissionDate: '', medium: 'Hindi', stream: 'None'
    });

    useEffect(() => {
        if (!showAdd) fetchStudents();
    }, [selectedClass, showAdd]);

    const fetchStudents = async () => {
        if (!selectedClass) return;
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/students/${selectedClass}`, {
                params: { medium: selectedMedium, stream: selectedStream },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(data);
        } catch (err) { 
            console.error('Error fetching students:', err);
            setStudents([]); 
        }
    };

    const handleEdit = (student) => {
        setEditingId(student._id);
        setFormData({
            ...student,
            username: student.user?.username || '',
            password: '',
            name: student.studentName,
            email: student.emailId || '',
            admissionDate: student.admissionDate ? student.admissionDate.split('T')[0] : ''
        });
        setShowAdd(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/student/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Student deleted successfully');
            fetchStudents();
        } catch (err) { alert('Error deleting student'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/student/${editingId}`, formData, config);
                alert('Student updated successfully');
            } else {
                await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/add-student', formData, config);
                alert('Student registered successfully');
            }
            setShowAdd(false);
            setEditingId(null);
            setFormData({ username: '', password: '', name: '', email: '', mobileNumber: '', className: '1', motherName: '', fatherName: '', contactNumber: '', permanentAddress: '', currentAddress: '', fees: '', previousSchool: '', admissionDate: '', medium: 'Hindi', stream: 'None' });
        } catch (err) { alert(err.response?.data?.message || 'Error occurred'); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h1>Manage Students</h1>
                    <button className="btn btn-primary" onClick={() => { setShowAdd(!showAdd); if(showAdd) setEditingId(null); }}>
                        {showAdd ? 'View List' : 'Add New Student'}
                    </button>
                </div>

                {!showAdd && (
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label>Class:</label>
                            <input type="text" placeholder="Class" className="form-input" style={{ width: '80px' }} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label>Medium:</label>
                            <select className="form-input" value={selectedMedium} onChange={(e) => setSelectedMedium(e.target.value)}>
                                <option value="">All</option>
                                <option value="Hindi">Hindi</option>
                                <option value="English">English</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label>Stream:</label>
                            <select className="form-input" value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                                <option value="">All</option>
                                <option value="Science">Science</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Arts">Arts</option>
                                <option value="None">None</option>
                            </select>
                        </div>
                        <button className="btn btn-secondary" onClick={fetchStudents}>Filter</button>
                    </div>
                )}

                {showAdd ? (
                    <div className="glass-card" style={{ padding: '2rem', backgroundColor: 'white' }}>
                        <h3>{editingId ? 'Edit Student' : 'Register New Student'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginTop: '1rem' }}>
                            {!editingId && <input name="username" placeholder="Login Username" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="form-input" />}
                            {!editingId && <input name="password" type="password" placeholder="Login Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="form-input" />}
                            <input name="name" placeholder="Student Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input" />
                            <input name="mobileNumber" placeholder="WhatsApp Number" required value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} className="form-input" />
                            <input name="className" placeholder="Class (e.g. 1)" required value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} className="form-input" />
                            <input name="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" />
                            <input name="motherName" placeholder="Mother's Name" required value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} className="form-input" />
                            <input name="fatherName" placeholder="Father's Name" required value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} className="form-input" />
                            <input name="contactNumber" placeholder="Parent's Contact" required value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="form-input" />
                            <input name="admissionDate" type="date" required value={formData.admissionDate} onChange={(e) => setFormData({...formData, admissionDate: e.target.value})} className="form-input" />
                            <input name="fees" placeholder="Monthly Fees" required value={formData.fees} onChange={(e) => setFormData({...formData, fees: e.target.value})} className="form-input" />
                            <input name="previousSchool" placeholder="Last School Attended" value={formData.previousSchool} onChange={(e) => setFormData({...formData, previousSchool: e.target.value})} className="form-input" />
                            <textarea name="permanentAddress" placeholder="Permanent Address" required value={formData.permanentAddress} onChange={(e) => setFormData({...formData, permanentAddress: e.target.value})} style={{ gridColumn: 'span 2' }} className="form-input"></textarea>
                            <textarea name="currentAddress" placeholder="Current Address" required value={formData.currentAddress} onChange={(e) => setFormData({...formData, currentAddress: e.target.value})} style={{ gridColumn: 'span 2' }} className="form-input"></textarea>
                            
                            <select name="medium" required value={formData.medium} onChange={(e) => setFormData({...formData, medium: e.target.value})} className="form-input">
                                <option value="Hindi">Hindi Medium</option>
                                <option value="English">English Medium</option>
                            </select>
                            <select name="stream" value={formData.stream} onChange={(e) => setFormData({...formData, stream: e.target.value})} className="form-input">
                                <option value="None">None</option>
                                <option value="Science">Science</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Arts">Arts</option>
                            </select>
                            
                            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>{editingId ? 'Update Student' : 'Register Student'}</button>
                        </form>
                    </div>
                ) : (
                    <div className="glass-card" style={{ overflowX: 'auto', backgroundColor: 'white' }}>
                        <table className="data-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Father's Name</th>
                                    <th>Mobile</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s._id}>
                                        <td>{s.studentName}</td>
                                        <td>{s.fatherName}</td>
                                        <td>{s.mobileNumber}</td>
                                        <td>
                                            <button onClick={() => handleEdit(s)} style={{ border: 'none', background: 'none', color: '#1a2a6c', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}>Edit</button>
                                            <button onClick={() => handleDelete(s._id)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No students found for this class.</td></tr>}
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

export default PrincipalManageStudents;
