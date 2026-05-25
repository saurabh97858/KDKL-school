import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const PrincipalTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', email: '', mobileNumber: '', 
        currentAddress: '', permanentAddress: '', salary: '', subject: '', assignedClass: '1',
        qualification: '', experience: '', expertIn: '', medium: 'Hindi', role: 'Teacher'
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/teachers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTeachers(data);
        } catch (err) { console.error(err); }
    };

    const handleEdit = (teacher) => {
        setEditingId(teacher._id);
        setFormData({
            username: teacher.user?.username || '',
            password: '', // Don't show old password
            name: teacher.teacherName,
            email: teacher.emailId || '',
            mobileNumber: teacher.mobileNumber,
            currentAddress: teacher.currentAddress,
            permanentAddress: teacher.permanentAddress,
            salary: teacher.salary,
            subject: teacher.subject,
            assignedClass: teacher.assignedClass,
            qualification: teacher.qualification || '',
            experience: teacher.experience || '',
            expertIn: teacher.expertIn || '',
            medium: teacher.medium || 'Hindi',
            role: teacher.role || 'Teacher'
        });
        setShowAdd(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/teacher/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Teacher deleted successfully');
            fetchTeachers();
        } catch (err) { alert('Error deleting teacher'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== '') data.append(key, formData[key]);
        });
        if (file) data.append('profilePic', file);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/teacher/${editingId}`, data, config);
                alert('Teacher updated successfully');
            } else {
                await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/add-teacher', data, config);
                alert('Teacher added successfully');
            }
            setShowAdd(false);
            setEditingId(null);
            setFormData({ username: '', password: '', name: '', email: '', mobileNumber: '', currentAddress: '', permanentAddress: '', salary: '', subject: '', assignedClass: '1', qualification: '', experience: '', expertIn: '', medium: 'Hindi', role: 'Teacher' });
            fetchTeachers();
        } catch (err) { alert(err.response?.data?.message || 'Error occurred'); }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h1>Manage Teachers</h1>
                    <button className="btn btn-primary" onClick={() => { setShowAdd(!showAdd); if(showAdd) setEditingId(null); }}>
                        {showAdd ? 'View List' : 'Add New Teacher'}
                    </button>
                </div>

                {showAdd ? (
                    <div className="glass-card" style={{ padding: '2rem', backgroundColor: 'white' }}>
                        <h3>{editingId ? 'Edit Teacher' : 'Add New Teacher'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginTop: '1rem' }}>
                            <input type="text" placeholder="Username (Login ID)" className="form-input" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                            <input type="password" placeholder="New Password (optional)" className="form-input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <input type="text" placeholder="Teacher Name" className="form-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <input type="email" placeholder="Email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <input type="text" placeholder="Mobile Number" className="form-input" required value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} />
                            <input type="text" placeholder="Subject" className="form-input" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                            <input type="text" placeholder="Assigned Class" className="form-input" required value={formData.assignedClass} onChange={(e) => setFormData({ ...formData, assignedClass: e.target.value })} />
                            <input type="text" placeholder="Salary" className="form-input" required value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                            <input type="text" placeholder="Role (e.g. Senior Teacher)" className="form-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                            <input type="text" placeholder="Qualification" className="form-input" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} />
                            <input type="text" placeholder="Experience (e.g. 5 Years)" className="form-input" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                            <input type="text" placeholder="Expert In (e.g. Organic Chemistry)" className="form-input" value={formData.expertIn} onChange={(e) => setFormData({ ...formData, expertIn: e.target.value })} />
                            <select className="form-input" value={formData.medium} onChange={(e) => setFormData({ ...formData, medium: e.target.value })}>
                                <option value="Hindi">Hindi Medium</option>
                                <option value="English">English Medium</option>
                            </select>
                            <div>
                                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Profile Pic</label>
                                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                            <textarea placeholder="Current Address" className="form-input" style={{ gridColumn: 'span 2' }} required value={formData.currentAddress} onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}></textarea>
                            <textarea placeholder="Permanent Address" className="form-input" style={{ gridColumn: 'span 1' }} required value={formData.permanentAddress} onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}></textarea>
                            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3' }}>{editingId ? 'Update Teacher' : 'Add Teacher'}</button>
                        </form>
                    </div>
                ) : (
                    <div className="glass-card" style={{ overflowX: 'auto', backgroundColor: 'white' }}>
                        <table className="data-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Pic</th>
                                    <th>Name</th>
                                    <th>Medium</th>
                                    <th>Subject</th>
                                    <th>Class</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map(t => (
                                    <tr key={t._id}>
                                        <td><img src={t.profilePic ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${t.profilePic}` : 'https://via.placeholder.com/40'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt="" /></td>
                                        <td>{t.teacherName}</td>
                                        <td>{t.medium}</td>
                                        <td>{t.subject}</td>
                                        <td>{t.assignedClass}</td>
                                        <td>
                                            <button onClick={() => handleEdit(t)} style={{ border: 'none', background: 'none', color: '#1a2a6c', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}>Edit</button>
                                            <button onClick={() => handleDelete(t._id)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
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

export default PrincipalTeachers;
