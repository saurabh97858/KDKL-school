import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { CreditCard, Save, Plus, Trash2, Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalFeeStructure = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(null);
    const [filterMedium, setFilterMedium] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        className: '', medium: 'Hindi', tuitionFee: 0, booksFee: 0, dressFee: 0, admissionCharges: 0, otherCharges: 0
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const classes = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const mediums = ['Hindi', 'English'];

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/fee-structure', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFees(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/fee-structure', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEditing(null);
            setFormData({ className: '', medium: 'Hindi', tuitionFee: 0, booksFee: 0, dressFee: 0, admissionCharges: 0, otherCharges: 0 });
            fetchFees();
        } catch (err) { alert('Error saving fee structure'); }
    };

    const startEdit = (fee) => {
        setEditing(`${fee.className} (${fee.medium})`);
        setFormData(fee);
    };

    // Filter logic
    const filteredFees = fees.filter(f => {
        const matchesMedium = filterMedium === 'All' ? true : f.medium === filterMedium;
        const matchesSearch = f.className.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesMedium && matchesSearch;
    });

    // Client-side pagination calculations
    const totalEntries = filteredFees.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
    const paginatedRows = filteredFees.slice(startIndex, endIndex);

    // Reset pagination when filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterMedium, searchQuery, rowsPerPage]);

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content fee-structure-panel">
                {/* Header Section */}
                <div className="panel-header-section" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                    <div className="header-icon-container" style={{
                        background: '#e6f4ea',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CreditCard color="#137333" size={24} />
                    </div>
                    <div>
                        <h1 style={{ color: '#065f46', margin: 0, fontSize: '1.85rem', fontWeight: '800' }} className="panel-title">
                            Fee Structure Management
                        </h1>
                        <p style={{ color: '#6b7280', margin: '4px 0 0' }} className="panel-subtitle">Define and adjust fees for each class and medium.</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-card form-card-wrapper" style={{ padding: '1.8rem', marginBottom: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#065f46', fontWeight: '700', fontSize: '1.15rem' }} className="form-title">
                        {editing ? `Editing: ${editing}` : 'Add / Update Class Fees'}
                    </h3>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.2rem', alignItems: 'end' }} className="fee-form">
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: '#374151' }}>Class</label>
                            <select className="form-input custom-input" required value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })}>
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: '#374151' }}>Medium</label>
                            <select className="form-input custom-input" required value={formData.medium} onChange={(e) => setFormData({ ...formData, medium: e.target.value })}>
                                {mediums.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: '#374151' }}>Tuition (₹)</label>
                            <input type="number" className="form-input custom-input" value={formData.tuitionFee} onChange={(e) => setFormData({ ...formData, tuitionFee: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: '#374151' }}>Books (₹)</label>
                            <input type="number" className="form-input custom-input" value={formData.booksFee} onChange={(e) => setFormData({ ...formData, booksFee: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: '#374151' }}>Dress (₹)</label>
                            <input type="number" className="form-input custom-input" value={formData.dressFee} onChange={(e) => setFormData({ ...formData, dressFee: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: '#374151' }}>Admission (₹)</label>
                            <input type="number" className="form-input custom-input" value={formData.admissionCharges} onChange={(e) => setFormData({ ...formData, admissionCharges: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: '#374151' }}>Other (₹)</label>
                            <input type="number" className="form-input custom-input" value={formData.otherCharges} onChange={(e) => setFormData({ ...formData, otherCharges: e.target.value })} />
                        </div>
                        <button type="submit" className="btn submit-btn" style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', borderRadius: '10px' }}>
                            <Save size={16} /> Save Changes
                        </button>
                    </form>
                </div>

                {/* Filters & Search Row */}
                <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }} className="filters-search-row">
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }} className="filter-medium-wrapper">
                        <span style={{ fontWeight: '600', color: '#4b5563', fontSize: '0.88rem' }} className="filter-label">Filter by Medium:</span>
                        {['All', 'Hindi', 'English'].map(m => (
                            <button 
                                key={m} 
                                onClick={() => setFilterMedium(m)}
                                className={`filter-badge-btn ${filterMedium === m ? 'active' : ''}`}
                                style={{ 
                                    padding: '6px 16px', 
                                    borderRadius: '20px', 
                                    border: 'none', 
                                    background: filterMedium === m ? '#047857' : '#f3f4f6',
                                    color: filterMedium === m ? 'white' : '#4b5563',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    transition: '0.3s',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="search-bar-wrapper" style={{ position: 'relative', width: '220px' }}>
                        <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search class..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '6px 12px 6px 2.2rem',
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                fontSize: '0.85rem',
                                background: '#ffffff',
                                color: '#1f2937'
                            }}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Table Card */}
                <div className="glass-card table-card-wrapper" style={{ overflowX: 'auto', marginBottom: '1rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                    <table className="data-table premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'left' }}>Class</th>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'left' }}>Medium</th>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'left' }}>Tuition (₹)</th>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'left' }}>Books (₹)</th>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'left' }}>Dress (₹)</th>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'left' }}>Admission (₹)</th>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'left' }}>Other (₹)</th>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'left' }}>Total (₹)</th>
                                <th style={{ padding: '0.9rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.map(f => (
                                <tr key={f._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '0.9rem 1.2rem', fontWeight: '700', color: '#1f2937' }} className="class-cell">Class {f.className}</td>
                                    <td style={{ padding: '0.9rem 1.2rem' }}>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '8px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '700',
                                            background: f.medium === 'English' ? '#dbeafe' : '#ffedd5',
                                            color: f.medium === 'English' ? '#1d4ed8' : '#d97706'
                                        }} className="medium-badge">
                                            {f.medium}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.9rem 1.2rem', color: '#4b5563' }} className="number-cell">₹{f.tuitionFee?.toLocaleString('en-IN') || 0}</td>
                                    <td style={{ padding: '0.9rem 1.2rem', color: '#4b5563' }} className="number-cell">₹{f.booksFee?.toLocaleString('en-IN') || 0}</td>
                                    <td style={{ padding: '0.9rem 1.2rem', color: '#4b5563' }} className="number-cell">₹{f.dressFee?.toLocaleString('en-IN') || 0}</td>
                                    <td style={{ padding: '0.9rem 1.2rem', color: '#4b5563' }} className="number-cell">₹{f.admissionCharges?.toLocaleString('en-IN') || 0}</td>
                                    <td style={{ padding: '0.9rem 1.2rem', color: '#4b5563' }} className="number-cell">₹{f.otherCharges?.toLocaleString('en-IN') || 0}</td>
                                    <td style={{ padding: '0.9rem 1.2rem', fontWeight: '800', color: '#166534' }} className="total-cell">₹{f.total?.toLocaleString('en-IN') || 0}</td>
                                    <td style={{ padding: '0.9rem 1.2rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                                            <button 
                                                onClick={() => startEdit(f)} 
                                                className="btn edit-badge-btn" 
                                                style={{ 
                                                    padding: '4px 12px', 
                                                    fontSize: '0.78rem', 
                                                    background: '#ffffff', 
                                                    border: '1px solid #cbd5e1', 
                                                    color: '#334155',
                                                    borderRadius: '6px',
                                                    fontWeight: '700'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <MoreVertical size={16} color="#6b7280" style={{ cursor: 'pointer' }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedRows.length === 0 && (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', opacity: 0.5 }}>
                                        No fee data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.5rem 2rem', flexWrap: 'wrap', gap: '1rem' }} className="pagination-wrapper">
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }} className="pagination-text">
                            Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }} className="pagination-actions">
                            {/* Pagination Numbers */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    style={{
                                        border: 'none', background: 'none', color: '#6b7280', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center'
                                    }}
                                    title="Previous"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }).map((_, idx) => {
                                    const pageNum = idx + 1;
                                    const isActive = currentPage === pageNum;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: isActive ? '#047857' : 'none',
                                                color: isActive ? 'white' : '#4b5563',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                fontSize: '0.82rem'
                                            }}
                                            className="pagination-number-btn"
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button 
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    style={{
                                        border: 'none', background: 'none', color: '#6b7280', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center'
                                    }}
                                    title="Next"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Rows per page dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="rows-per-page-wrapper">
                                <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Rows per page:</span>
                                <select 
                                    value={rowsPerPage} 
                                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                    style={{
                                        padding: '4px 6px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.82rem',
                                        background: '#ffffff',
                                        color: '#374151'
                                    }}
                                    className="rows-select"
                                >
                                    {[5, 10, 15, 25].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                /* === LIGHT MODE OVERRIDES SCOPED TO LIGHT THEME ONLY === */
                body:not(.dark) .fee-structure-panel {
                    background-color: #fcfbf7 !important;
                }
                
                body:not(.dark) .form-card-wrapper,
                body:not(.dark) .table-card-wrapper {
                    background: #ffffff !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.02) !important;
                    border: 1px solid rgba(243, 244, 246, 0.9) !important;
                }

                body:not(.dark) .custom-input {
                    background-color: #ffffff !important;
                    border: 1.5px solid #e5e7eb !important;
                    color: #1f2937 !important;
                    border-radius: 10px !important;
                    padding: 0.65rem 0.8rem !important;
                }

                body:not(.dark) .custom-input:focus {
                    border-color: #059669 !important;
                    box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.08) !important;
                }

                body:not(.dark) .submit-btn {
                    background: linear-gradient(135deg, #059669, #1d4ed8) !important;
                    color: white !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.3px;
                }

                body:not(.dark) .submit-btn:hover {
                    box-shadow: 0 6px 15px rgba(5, 150, 105, 0.2) !important;
                    transform: translateY(-1px);
                }

                body:not(.dark) .filter-badge-btn.active {
                    background: #059669 !important;
                    box-shadow: 0 4px 10px rgba(5, 150, 105, 0.2) !important;
                }

                body:not(.dark) .filter-badge-btn:not(.active) {
                    background: #f3f4f6 !important;
                    color: #4b5563 !important;
                }
                body:not(.dark) .filter-badge-btn:not(.active):hover {
                    background: #e5e7eb !important;
                }

                body:not(.dark) .premium-table th {
                    background: #fafaf9 !important;
                    border-bottom: 2px solid #f3f4f6 !important;
                    color: #6b7280 !important;
                }

                body:not(.dark) .premium-table tr:hover td {
                    background-color: #fafaf9 !important;
                }

                body:not(.dark) .edit-badge-btn:hover {
                    background: #f3f4f6 !important;
                    border-color: #94a3b8 !important;
                }
            `}</style>
        </div>
    );
};

export default PrincipalFeeStructure;
