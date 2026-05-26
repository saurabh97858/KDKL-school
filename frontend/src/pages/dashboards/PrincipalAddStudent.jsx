import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { 
    Plus, 
    Filter, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    Trash2, 
    Edit2, 
    GraduationCap, 
    FolderX,
    RefreshCw,
    X,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('1');
    const [selectedMedium, setSelectedMedium] = useState('All Mediums');
    const [selectedStream, setSelectedStream] = useState('All Streams');
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
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
            const med = selectedMedium === 'All Mediums' ? '' : selectedMedium;
            const str = selectedStream === 'All Streams' ? '' : selectedStream;
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/students/${selectedClass}`, {
                params: { medium: med, stream: str },
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
        } catch (err) { 
            alert('Error deleting student'); 
        }
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
        } catch (err) { 
            alert(err.response?.data?.message || 'Error occurred'); 
        }
    };

    const clearFilters = () => {
        setSelectedClass('1');
        setSelectedMedium('All Mediums');
        setSelectedStream('All Streams');
    };

    // Filter list locally for extra safety (already filtered on API, but helps if UI updates)
    const filteredStudents = students.filter(s => {
        const matchesMed = selectedMedium === 'All Mediums' || s.medium === selectedMedium;
        const matchesStr = selectedStream === 'All Streams' || s.stream === selectedStream;
        return matchesMed && matchesStr;
    });

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;

    const classList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="principal" />
            
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        {/* Breadcrumbs */}
                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                            <span>Dashboard</span>
                            <span>&gt;</span>
                            <span style={{ color: '#8b5cf6' }}>Students</span>
                            <span>&gt;</span>
                            <span>Manage Students</span>
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                            Manage Students
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem', margin: 0 }}>
                            View and manage all students of your institution.
                        </p>
                    </div>

                    <button 
                        onClick={() => { setShowAdd(!showAdd); if(showAdd) setEditingId(null); }}
                        style={{ 
                            background: showAdd ? 'var(--text-secondary)' : 'linear-gradient(to right, #8b5cf6, #e11d48)', 
                            color: 'white', 
                            borderRadius: '10px', 
                            padding: '0.65rem 1.4rem', 
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: showAdd ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.2)'
                        }}
                    >
                        {showAdd ? <X size={16} /> : <Plus size={16} />}
                        {showAdd ? 'View Student List' : 'Add New Student'}
                    </button>
                </div>

                {/* Filter and Add Mode Rendering */}
                {!showAdd && (
                    <div className="glass-card" style={{ 
                        padding: '1.2rem', 
                        border: '1.5px solid var(--border-color)', 
                        backgroundColor: 'var(--card-bg)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.2rem',
                        alignItems: 'end',
                        textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Class</label>
                            <select 
                                value={selectedClass} 
                                onChange={(e) => setSelectedClass(e.target.value)}
                                style={{ 
                                    border: '1.5px solid var(--border-color)', 
                                    borderRadius: '10px', 
                                    padding: '0.6rem 1.2rem', 
                                    fontSize: '0.85rem', 
                                    fontWeight: '600', 
                                    backgroundColor: 'var(--card-bg)', 
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                {classList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Medium</label>
                            <select 
                                value={selectedMedium} 
                                onChange={(e) => setSelectedMedium(e.target.value)}
                                style={{ 
                                    border: '1.5px solid var(--border-color)', 
                                    borderRadius: '10px', 
                                    padding: '0.6rem 1.2rem', 
                                    fontSize: '0.85rem', 
                                    fontWeight: '600', 
                                    backgroundColor: 'var(--card-bg)', 
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                <option>All Mediums</option>
                                <option>Hindi</option>
                                <option>English</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Stream</label>
                            <select 
                                value={selectedStream} 
                                onChange={(e) => setSelectedStream(e.target.value)}
                                style={{ 
                                    border: '1.5px solid var(--border-color)', 
                                    borderRadius: '10px', 
                                    padding: '0.6rem 1.2rem', 
                                    fontSize: '0.85rem', 
                                    fontWeight: '600', 
                                    backgroundColor: 'var(--card-bg)', 
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                <option>All Streams</option>
                                <option>None</option>
                                <option>Science</option>
                                <option>Commerce</option>
                                <option>Arts</option>
                            </select>
                        </div>

                        <button 
                            onClick={fetchStudents}
                            style={{ 
                                border: '1.5px solid #8b5cf6', 
                                borderRadius: '10px', 
                                backgroundColor: 'var(--card-bg)', 
                                color: '#8b5cf6', 
                                padding: '0.6rem 1.5rem', 
                                fontSize: '0.85rem', 
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                height: '42px'
                            }}
                        >
                            <Filter size={15} />
                            Filter
                        </button>
                    </div>
                )}

                {/* Form Registration Block */}
                {showAdd ? (
                    <div className="glass-card" style={{ padding: '2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                            {editingId ? 'Edit Student Details' : 'Register New Student'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                            {!editingId && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Login Username</label>
                                    <input name="username" placeholder="Login ID" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="student-form-input" />
                                </div>
                            )}
                            {!editingId && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Login Password</label>
                                    <input name="password" type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="student-form-input" />
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Student Name</label>
                                <input name="name" placeholder="Student Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>WhatsApp Number</label>
                                <input name="mobileNumber" placeholder="Mobile Number" required value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Class</label>
                                <input name="className" placeholder="Class e.g. 1" required value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Email</label>
                                <input name="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Mother's Name</label>
                                <input name="motherName" placeholder="Mother's Name" required value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Father's Name</label>
                                <input name="fatherName" placeholder="Father's Name" required value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Parent's Contact</label>
                                <input name="contactNumber" placeholder="Contact Number" required value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Admission Date</label>
                                <input name="admissionDate" type="date" required value={formData.admissionDate} onChange={(e) => setFormData({...formData, admissionDate: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Monthly Fees (₹)</label>
                                <input name="fees" placeholder="Monthly Fees" required value={formData.fees} onChange={(e) => setFormData({...formData, fees: e.target.value})} className="student-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Last School Attended</label>
                                <input name="previousSchool" placeholder="Last School Attended" value={formData.previousSchool} onChange={(e) => setFormData({...formData, previousSchool: e.target.value})} className="student-form-input" />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Medium</label>
                                <select name="medium" required value={formData.medium} onChange={(e) => setFormData({...formData, medium: e.target.value})} className="student-form-input" style={{ cursor: 'pointer' }}>
                                    <option value="Hindi">Hindi Medium</option>
                                    <option value="English">English Medium</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Stream</label>
                                <select name="stream" value={formData.stream} onChange={(e) => setFormData({...formData, stream: e.target.value})} className="student-form-input" style={{ cursor: 'pointer' }}>
                                    <option value="None">None</option>
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Arts</option>
                                </select>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Permanent Address</label>
                                <textarea name="permanentAddress" placeholder="Permanent Address" required value={formData.permanentAddress} onChange={(e) => setFormData({...formData, permanentAddress: e.target.value})} className="student-form-input" rows="2"></textarea>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Current Address</label>
                                <textarea name="currentAddress" placeholder="Current Address" required value={formData.currentAddress} onChange={(e) => setFormData({...formData, currentAddress: e.target.value})} className="student-form-input" rows="2"></textarea>
                            </div>
                            
                            <button 
                                type="submit" 
                                style={{ 
                                    gridColumn: '1 / -1', 
                                    background: 'linear-gradient(to right, #8b5cf6, #e11d48)', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '10px', 
                                    padding: '0.8rem', 
                                    fontWeight: '700', 
                                    fontSize: '0.92rem', 
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.25)',
                                    marginTop: '0.8rem'
                                }}
                            >
                                {editingId ? 'Update Student Information' : 'Register Student'}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Student Records Grid Card */
                    <div className="glass-card" style={{ 
                        border: '1.5px solid var(--border-color)', 
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.01)'
                    }}>
                        
                        {filteredStudents.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '60px' }}>#</th>
                                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Name</th>
                                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Father's Name</th>
                                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Mobile</th>
                                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center', width: '150px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((s, index) => {
                                            const serialNum = String(indexOfFirstItem + index + 1).padStart(2, '0');
                                            return (
                                                <tr key={s._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="student-tr-hover">
                                                    <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{serialNum}</td>
                                                    <td style={{ padding: '1.1rem 1rem', fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)' }}>{s.studentName}</td>
                                                    <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)' }}>{s.fatherName}</td>
                                                    <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)' }}>{s.mobileNumber}</td>
                                                    <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                            <button 
                                                                onClick={() => handleEdit(s)} 
                                                                style={{ 
                                                                    background: 'none', 
                                                                    border: 'none', 
                                                                    color: '#2563eb', 
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(s._id)} 
                                                                style={{ 
                                                                    background: 'none', 
                                                                    border: 'none', 
                                                                    color: '#ef4444', 
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* Empty State Display matching Screenshot 1 */
                            <div style={{ padding: '5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                <div style={{ 
                                    backgroundColor: '#f5f3ff', 
                                    color: '#8b5cf6', 
                                    width: '100px', 
                                    height: '100px', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.05)',
                                    marginBottom: '0.5rem'
                                }} className="student-illustration">
                                    <GraduationCap size={48} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>No students found</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: '500', maxWidth: '350px', margin: 0 }}>
                                    There are no students available for the selected class and filters.
                                </p>
                                <button 
                                    onClick={clearFilters}
                                    style={{ 
                                        marginTop: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        border: '1.5px solid #8b5cf6', 
                                        borderRadius: '8px', 
                                        backgroundColor: 'var(--card-bg)', 
                                        color: '#8b5cf6', 
                                        padding: '0.55rem 1.2rem', 
                                        fontSize: '0.82rem', 
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={14} />
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination footer */}
                        {filteredStudents.length > 0 && (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '1rem 1.5rem', 
                                borderTop: '1.5px solid var(--border-color)',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                backgroundColor: 'var(--bg-light)'
                            }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} students
                                </span>

                                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        <span>Per Page:</span>
                                        <select 
                                            value={itemsPerPage}
                                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                            style={{ 
                                                border: '1.5px solid var(--border-color)', 
                                                borderRadius: '6px', 
                                                padding: '3px 8px', 
                                                fontWeight: '600',
                                                backgroundColor: 'var(--card-bg)',
                                                color: 'var(--text-primary)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                        </select>
                                    </div>

                                    {/* Pagination Controls */}
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button 
                                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            style={{ 
                                                border: '1.5px solid var(--border-color)', 
                                                backgroundColor: 'var(--card-bg)', 
                                                color: 'var(--text-secondary)',
                                                padding: '5px 10px', 
                                                borderRadius: '8px', 
                                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                opacity: currentPage === 1 ? 0.5 : 1,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button 
                                                key={i + 1}
                                                onClick={() => paginate(i + 1)}
                                                style={{ 
                                                    border: '1.5px solid var(--border-color)', 
                                                    backgroundColor: currentPage === i + 1 ? '#8b5cf6' : 'var(--card-bg)', 
                                                    color: currentPage === i + 1 ? 'white' : 'var(--text-primary)',
                                                    padding: '5px 10px', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer',
                                                    fontWeight: '700',
                                                    fontSize: '0.78rem'
                                                }}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button 
                                            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            style={{ 
                                                border: '1.5px solid var(--border-color)', 
                                                backgroundColor: 'var(--card-bg)', 
                                                color: 'var(--text-secondary)',
                                                padding: '5px 10px', 
                                                borderRadius: '8px', 
                                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                opacity: currentPage === totalPages ? 0.5 : 1,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>
            
            <style>{`
                .student-form-input {
                    padding: 0.65rem 1rem;
                    border: 1.5px solid var(--border-color);
                    border-radius: 10px;
                    background-color: var(--card-bg);
                    color: var(--text-primary);
                    font-size: 0.88rem;
                    font-weight: 500;
                    width: 100%;
                    outline: none;
                }
                .student-form-input:focus {
                    border-color: #8b5cf6;
                }
                .student-tr-hover:hover {
                    background-color: var(--bg-light) !important;
                }
                body.dark .student-illustration {
                    background-color: rgba(139, 92, 246, 0.1) !important;
                    color: #a78bfa !important;
                }
            `}</style>
        </div>
    );
};

export default PrincipalManageStudents;
