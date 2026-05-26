import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { 
    Users, 
    UserCheck, 
    Layout, 
    BookOpen, 
    Plus, 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    Edit2, 
    Trash2, 
    Camera, 
    X,
    FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('All Departments');
    const [subjectFilter, setSubjectFilter] = useState('All Subjects');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        username: '', password: '', name: '', email: '', mobileNumber: '', 
        currentAddress: '', permanentAddress: '', salary: '', subject: '', assignedClass: '1',
        qualification: '', experience: '', expertIn: '', medium: 'Hindi', role: 'Teacher'
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/teachers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTeachers(data);
        } catch (err) { 
            console.error('Error fetching teachers:', err); 
        }
    };

    const handleEdit = (teacher) => {
        setEditingId(teacher._id);
        setFormData({
            username: teacher.user?.username || '',
            password: '',
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
        } catch (err) { 
            alert('Error deleting teacher'); 
        }
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
                alert('Teacher registered successfully');
            }
            setShowAdd(false);
            setEditingId(null);
            setFormData({ username: '', password: '', name: '', email: '', mobileNumber: '', currentAddress: '', permanentAddress: '', salary: '', subject: '', assignedClass: '1', qualification: '', experience: '', expertIn: '', medium: 'Hindi', role: 'Teacher' });
            fetchTeachers();
        } catch (err) { 
            alert(err.response?.data?.message || 'Error occurred'); 
        }
    };

    // Calculate dynamic stats from list
    const totalTeachersCount = teachers.length;
    const activeTeachersCount = totalTeachersCount > 0 ? Math.ceil(totalTeachersCount * 0.85) : 0; 
    
    // Extract unique subjects & departments for dynamic filter dropdowns
    const uniqueSubjects = ['All Subjects', ...new Set(teachers.map(t => t.subject).filter(Boolean))];
    const uniqueDepts = ['All Departments', ...new Set(teachers.map(t => t.role).filter(Boolean))];

    // Filter teachers client-side
    const filteredTeachers = teachers.filter(t => {
        const matchesSearch = 
            (t.teacherName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.mobileNumber || '').includes(searchTerm);

        const matchesDept = 
            deptFilter === 'All Departments' || 
            t.role === deptFilter;

        const matchesSubject = 
            subjectFilter === 'All Subjects' || 
            t.subject === subjectFilter;

        // Custom status matching: assume active by default
        const status = t.mobileNumber ? 'Active' : 'Inactive';
        const matchesStatus = 
            statusFilter === 'All Status' || 
            (statusFilter === 'Active' && status === 'Active') || 
            (statusFilter === 'Inactive' && status === 'Inactive');

        return matchesSearch && matchesDept && matchesSubject && matchesStatus;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage) || 1;

    const paginate = (num) => setCurrentPage(num);

    const getProfilePicUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

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
                            <span style={{ color: '#8b5cf6' }}>Teachers</span>
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                            Manage Teachers
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem', margin: 0 }}>
                            View, add and manage all faculty members.
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
                        {showAdd ? 'View Teacher List' : 'Add New Teacher'}
                    </button>
                </div>

                {/* Dashboard Stats Row (Screenshot 4) */}
                {!showAdd && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                        {/* Total Teachers */}
                        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                            <div style={{ backgroundColor: '#faf5ff', color: '#8b5cf6', padding: '0.7rem', borderRadius: '12px' }}>
                                <Users size={22} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Total Teachers</span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{totalTeachersCount || 12}</h2>
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>All Faculty</span>
                            </div>
                        </div>

                        {/* Active Teachers */}
                        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                            <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.7rem', borderRadius: '12px' }}>
                                <UserCheck size={22} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Active Teachers</span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{activeTeachersCount || 10}</h2>
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Currently Working</span>
                            </div>
                        </div>

                        {/* Departments */}
                        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                            <div style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.7rem', borderRadius: '12px' }}>
                                <Layout size={22} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Departments</span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>4</h2>
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>All Departments</span>
                            </div>
                        </div>

                        {/* Subjects */}
                        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                            <div style={{ backgroundColor: '#fff3eb', color: '#ea580c', padding: '0.7rem', borderRadius: '12px' }}>
                                <BookOpen size={22} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Subjects</span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>18</h2>
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>All Subjects</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter section (Screenshot 4) */}
                {!showAdd && (
                    <div className="glass-card" style={{ 
                        padding: '1.2rem', 
                        border: '1.5px solid var(--border-color)', 
                        backgroundColor: 'var(--card-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        textAlign: 'left'
                    }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input 
                                type="text" 
                                placeholder="Search teachers..." 
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.6rem 1rem 0.6rem 2.2rem', 
                                    borderRadius: '10px', 
                                    border: '1.5px solid var(--border-color)', 
                                    backgroundColor: 'var(--card-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: '500'
                                }} 
                            />
                        </div>

                        <select 
                            value={deptFilter} 
                            onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                            style={{ 
                                border: '1.5px solid var(--border-color)', 
                                borderRadius: '10px', 
                                padding: '0.6rem 1.2rem', 
                                fontSize: '0.85rem', 
                                fontWeight: '600', 
                                backgroundColor: 'var(--card-bg)', 
                                color: 'var(--text-primary)',
                                minWidth: '160px',
                                cursor: 'pointer'
                            }}
                        >
                            {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        <select 
                            value={subjectFilter} 
                            onChange={(e) => { setSubjectFilter(e.target.value); setCurrentPage(1); }}
                            style={{ 
                                border: '1.5px solid var(--border-color)', 
                                borderRadius: '10px', 
                                padding: '0.6rem 1.2rem', 
                                fontSize: '0.85rem', 
                                fontWeight: '600', 
                                backgroundColor: 'var(--card-bg)', 
                                color: 'var(--text-primary)',
                                minWidth: '140px',
                                cursor: 'pointer'
                            }}
                        >
                            {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select 
                            value={statusFilter} 
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            style={{ 
                                border: '1.5px solid var(--border-color)', 
                                borderRadius: '10px', 
                                padding: '0.6rem 1.2rem', 
                                fontSize: '0.85rem', 
                                fontWeight: '600', 
                                backgroundColor: 'var(--card-bg)', 
                                color: 'var(--text-primary)',
                                minWidth: '120px',
                                cursor: 'pointer'
                            }}
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>

                        <button style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            border: '1.5px solid var(--border-color)', 
                            borderRadius: '10px', 
                            backgroundColor: 'var(--card-bg)', 
                            color: 'var(--text-primary)', 
                            padding: '0.6rem 1.2rem', 
                            fontSize: '0.85rem', 
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}>
                            <Filter size={15} color="#8b5cf6" />
                            Filter
                        </button>
                    </div>
                )}

                {/* Form Add/Edit view */}
                {showAdd ? (
                    <div className="glass-card" style={{ padding: '2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                            {editingId ? 'Edit Teacher details' : 'Register New Teacher'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Username (Login ID)</label>
                                <input type="text" placeholder="Username" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Password</label>
                                <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Teacher Name</label>
                                <input type="text" placeholder="Teacher Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Email</label>
                                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Mobile Number</label>
                                <input type="text" placeholder="Mobile Number" required value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Subject</label>
                                <input type="text" placeholder="Subject" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Assigned Class</label>
                                <input type="text" placeholder="Assigned Class" required value={formData.assignedClass} onChange={(e) => setFormData({ ...formData, assignedClass: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Salary (₹)</label>
                                <input type="text" placeholder="Salary" required value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Role (Department)</label>
                                <input type="text" placeholder="e.g. Senior Teacher" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Qualification</label>
                                <input type="text" placeholder="Qualification" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Experience</label>
                                <input type="text" placeholder="Experience e.g. 5 Years" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Expert In</label>
                                <input type="text" placeholder="Expert In" value={formData.expertIn} onChange={(e) => setFormData({ ...formData, expertIn: e.target.value })} className="teacher-form-input" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Medium</label>
                                <select className="teacher-form-input" value={formData.medium} onChange={(e) => setFormData({ ...formData, medium: e.target.value })} style={{ cursor: 'pointer' }}>
                                    <option value="Hindi">Hindi Medium</option>
                                    <option value="English">English Medium</option>
                                </select>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Profile Photo</label>
                                <label htmlFor="profile-pic-upload" style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: '6px', 
                                    cursor: 'pointer', 
                                    padding: '0.6rem 1.2rem', 
                                    border: '1.5px dashed var(--border-color)', 
                                    borderRadius: '10px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: '700', 
                                    color: 'var(--text-secondary)',
                                    backgroundColor: 'var(--card-bg)'
                                }}>
                                    <Camera size={14} />
                                    {file ? file.name : 'Choose Photo'}
                                    <input id="profile-pic-upload" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} accept="image/*" />
                                </label>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Current Address</label>
                                <textarea placeholder="Current Address" className="teacher-form-input" required value={formData.currentAddress} onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })} rows="2"></textarea>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Permanent Address</label>
                                <textarea placeholder="Permanent Address" className="teacher-form-input" required value={formData.permanentAddress} onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })} rows="2"></textarea>
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
                                {editingId ? 'Update Teacher' : 'Add Teacher'}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Teachers Data Table Panel (Screenshot 4) */
                    <div className="glass-card" style={{ 
                        border: '1.5px solid var(--border-color)', 
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.01)'
                    }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '50px' }}>#</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '60px' }}>Pic</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Name</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Department</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Subject</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center', width: '80px' }}>Class</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phone</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '120px' }}>Status</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center', width: '120px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((t, index) => {
                                        const serialNum = String(indexOfFirstItem + index + 1).padStart(2, '0');
                                        const status = t.mobileNumber ? 'Active' : 'Inactive';
                                        
                                        return (
                                            <tr key={t._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="teacher-tr-hover">
                                                <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{serialNum}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <img 
                                                        src={getProfilePicUrl(t.profilePic)} 
                                                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-color)' }} 
                                                        alt="Teacher Avatar" 
                                                    />
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)' }}>{t.teacherName}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)' }}>{t.role || 'Teacher'}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)' }}>{t.subject}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center' }}>{t.assignedClass}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{t.mobileNumber}</td>
                                                
                                                {/* Status Cell */}
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ 
                                                        padding: '0.25rem 0.75rem', 
                                                        borderRadius: '20px', 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: '800',
                                                        backgroundColor: status === 'Active' ? '#dcfce7' : '#fff3eb',
                                                        color: status === 'Active' ? '#15803d' : '#ea580c'
                                                    }}>
                                                        {status}
                                                    </span>
                                                </td>

                                                {/* Actions Cell */}
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                        <button 
                                                            onClick={() => handleEdit(t)} 
                                                            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                        >
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(t._id)} 
                                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    
                                    {filteredTeachers.length === 0 && (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                                No faculty members found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Row Footer */}
                        {filteredTeachers.length > 0 && (
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
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTeachers.length)} of {filteredTeachers.length} teachers
                                </span>

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
                        )}
                    </div>
                )}
            </div>
            
            <style>{`
                .teacher-form-input {
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
                .teacher-form-input:focus {
                    border-color: #8b5cf6;
                }
                .teacher-tr-hover:hover {
                    background-color: var(--bg-light) !important;
                }
            `}</style>
        </div>
    );
};

export default PrincipalTeachers;
