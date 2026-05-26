import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { 
    Search, 
    Filter, 
    FileText, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Download, 
    ChevronLeft, 
    ChevronRight,
    MoreVertical,
    FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalApplications = () => {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('All Classes');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/applications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setApplications(data);
        } catch (err) { 
            console.error('Error fetching applications:', err); 
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/principal/application-status/${id}`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchApplications();
        } catch (err) { 
            alert(err.response?.data?.message || 'Update failed'); 
        }
    };

    // Derived statistics
    const totalCount = applications.length;
    const acceptedCount = applications.filter(app => app.status === 'Accepted').length;
    const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
    const pendingCount = applications.filter(app => app.status === 'Pending').length;

    // Filtered Applications
    const filteredApps = applications.filter(app => {
        const matchesSearch = 
            (app.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.fatherName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.contactNumber || '').includes(searchTerm);
        
        const matchesClass = 
            classFilter === 'All Classes' || 
            String(app.className) === classFilter.replace('Class ', '');

        const matchesStatus = 
            statusFilter === 'All Status' || 
            app.status === statusFilter;

        return matchesSearch && matchesClass && matchesStatus;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApps.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Format date as DD/MM/YYYY or simple local
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    // List of classes for dropdown
    const classList = ['All Classes', 'Class 6', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="principal" />
            
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
                
                {/* Header Title Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        {/* Breadcrumbs */}
                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                            <span>Dashboard</span>
                            <span>&gt;</span>
                            <span style={{ color: '#8b5cf6' }}>Admissions</span>
                            <span>&gt;</span>
                            <span>Applications</span>
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                            Admission Applications
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem' }}>
                            View students who have applied for admission through the website.
                        </p>
                    </div>

                    <button 
                        className="btn" 
                        style={{ 
                            background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                            color: 'white', 
                            borderRadius: '10px', 
                            padding: '0.65rem 1.4rem', 
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)'
                        }}
                    >
                        <Download size={16} />
                        Export Report
                    </button>
                </div>

                {/* Stats Cards Row (4 cards) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                    
                    {/* Total Applications */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ backgroundColor: '#faf5ff', color: '#8b5cf6', padding: '0.7rem', borderRadius: '12px' }}>
                            <FileText size={22} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Total Applications</span>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{totalCount}</h2>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>All Time</span>
                        </div>
                    </div>

                    {/* Accepted */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.7rem', borderRadius: '12px' }}>
                            <CheckCircle size={22} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Accepted</span>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{acceptedCount}</h2>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>This Year</span>
                        </div>
                    </div>

                    {/* Rejected */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.7rem', borderRadius: '12px' }}>
                            <XCircle size={22} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Rejected</span>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{rejectedCount}</h2>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>This Year</span>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ backgroundColor: '#fff3eb', color: '#ea580c', padding: '0.7rem', borderRadius: '12px' }}>
                            <Clock size={22} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Pending</span>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{pendingCount}</h2>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Under Review</span>
                        </div>
                    </div>

                </div>

                {/* Filter and Search Bar Section */}
                <div className="glass-card" style={{ 
                    padding: '1.2rem', 
                    border: '1.5px solid var(--border-color)', 
                    backgroundColor: 'var(--card-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    
                    {/* Search Field */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                        <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search by student name, father's name or contact..." 
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

                    {/* Class Select Dropdown */}
                    <select 
                        value={classFilter} 
                        onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
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
                        {classList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>

                    {/* Status Select Dropdown */}
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
                            minWidth: '140px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All Status">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    {/* Filter Action Icon Button */}
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

                {/* Data Table Panel */}
                <div className="glass-card" style={{ 
                    border: '1.5px solid var(--border-color)', 
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.01)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '50px' }}>#</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Student Name</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '80px' }}>Class</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Path</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Father's Name</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Contact</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Applied Date</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '120px' }}>Status</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center', width: '180px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((app, index) => {
                                    const serialNum = String(indexOfFirstItem + index + 1).padStart(2, '0');
                                    
                                    // Status Badge styling
                                    let badgeBg = '#fff3eb';
                                    let badgeText = '#ea580c';
                                    if (app.status === 'Accepted') {
                                        badgeBg = '#dcfce7';
                                        badgeText = '#15803d';
                                    } else if (app.status === 'Rejected') {
                                        badgeBg = '#fee2e2';
                                        badgeText = '#ef4444';
                                    }

                                    return (
                                        <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="table-row-hover">
                                            <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{serialNum}</td>
                                            <td style={{ padding: '1.1rem 1rem', fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)' }}>{app.studentName}</td>
                                            <td style={{ padding: '1.1rem 1rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>{app.className}</td>
                                            <td style={{ padding: '1.1rem 1rem', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{app.medium} | {app.stream}</td>
                                            <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)' }}>{app.fatherName}</td>
                                            <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)' }}>{app.contactNumber}</td>
                                            <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{formatDate(app.createdAt)}</td>
                                            
                                            {/* Status Cell */}
                                            <td style={{ padding: '1.1rem 1rem' }}>
                                                <span style={{ 
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '0.25rem 0.75rem', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.78rem', 
                                                    fontWeight: '700',
                                                    backgroundColor: badgeBg,
                                                    color: badgeText
                                                }}>
                                                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badgeText }}></span>
                                                    {app.status}
                                                </span>
                                            </td>

                                            {/* Actions Cell */}
                                            <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                    {app.status === 'Pending' ? (
                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                            <button 
                                                                onClick={() => updateStatus(app._id, 'Accepted')} 
                                                                style={{ 
                                                                    padding: '4px 10px', 
                                                                    borderRadius: '6px', 
                                                                    background: '#16a34a', 
                                                                    color: 'white', 
                                                                    border: 'none', 
                                                                    cursor: 'pointer', 
                                                                    fontSize: '0.78rem',
                                                                    fontWeight: '600' 
                                                                }}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button 
                                                                onClick={() => updateStatus(app._id, 'Rejected')} 
                                                                style={{ 
                                                                    padding: '4px 10px', 
                                                                    borderRadius: '6px', 
                                                                    background: '#ef4444', 
                                                                    color: 'white', 
                                                                    border: 'none', 
                                                                    cursor: 'pointer', 
                                                                    fontSize: '0.78rem',
                                                                    fontWeight: '600' 
                                                                }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button style={{ 
                                                            padding: '0.3rem 0.8rem', 
                                                            borderRadius: '8px', 
                                                            backgroundColor: '#faf5ff', 
                                                            color: '#8b5cf6', 
                                                            border: '1px solid rgba(139, 92, 246, 0.2)',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                            cursor: 'default'
                                                        }}>
                                                            Decision Made
                                                        </button>
                                                    )}
                                                    <button style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                
                                {filteredApps.length === 0 && (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                            No admission applications found matching the filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Row Footer */}
                    {filteredApps.length > 0 && (
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
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApps.length)} of {filteredApps.length} applications
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

            </div>
            
            <style>{`
                .table-row-hover:hover {
                    background-color: var(--bg-light) !important;
                }
            `}</style>
        </div>
    );
};

export default PrincipalApplications;
