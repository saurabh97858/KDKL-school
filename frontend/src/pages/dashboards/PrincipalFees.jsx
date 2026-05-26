import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Spinner } from '../../components/GlobalUI';
import { 
    Coins, 
    RefreshCw, 
    Download, 
    Filter, 
    Eye, 
    ArrowLeft, 
    Users, 
    CheckCircle, 
    Clock, 
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Search,
    ChevronDown,
    Save,
    CreditCard,
    History
} from 'lucide-react';

const CLASS_LIST = ['LKG','UKG','1','2','3','4','5','6','7','8','9','10','11','12'];
const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal';

const PrincipalFees = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedMedium, setSelectedMedium] = useState('');
    const [selectedStream, setSelectedStream] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feeForm, setFeeForm] = useState({ totalFees: '', depositedFees: '', fine: '', fineDescription: '', otherCharges: '', otherChargesDescription: '', dueDate: '', remarks: '' });
    const [paymentForm, setPaymentForm] = useState({ amount: '', mode: 'Cash', note: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [tab, setTab] = useState('details'); // 'details' | 'payment' | 'history'
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(5);

    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

    const fetchStudents = async (cls = selectedClass, med = selectedMedium, str = selectedStream) => {
        if (!cls) {
            setStudents([]);
            return;
        }
        setLoading(true);
        setSelectedStudent(null);
        try {
            const res = await axios.get(`${API}/fees/class/${cls}`, {
                params: { medium: med === 'All Mediums' ? '' : med, stream: str === 'All Streams' ? '' : str },
                headers: config.headers
            });
            setStudents(res.data);
        } catch (err) { 
            console.error(err);
            setStudents([]); 
        }
        setLoading(false);
    };

    const selectStudent = (s) => {
        setSelectedStudent(s);
        setTab('details');
        setMsg('');
        const f = s.feeRecord;
        setFeeForm({
            totalFees: f?.totalFees ?? '',
            depositedFees: f?.depositedFees ?? '',
            fine: f?.fine ?? '',
            fineDescription: f?.fineDescription ?? '',
            otherCharges: f?.otherCharges ?? '',
            otherChargesDescription: f?.otherChargesDescription ?? '',
            dueDate: f?.dueDate ? f.dueDate.substring(0, 10) : '',
            remarks: f?.remarks ?? ''
        });
        setPaymentForm({ amount: '', mode: 'Cash', note: '' });
    };

    const handleSaveFee = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        try {
            await axios.post(`${API}/fees/student/${selectedStudent._id}`, feeForm, config);
            setMsg('✅ Fee details saved successfully!');
            fetchStudents(selectedClass);
        } catch { 
            setMsg('❌ Save failed'); 
        }
        setSaving(false);
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        if (!paymentForm.amount) return;
        setSaving(true);
        setMsg('');
        try {
            await axios.post(`${API}/fees/student/${selectedStudent._id}/payment`, paymentForm, config);
            setMsg('✅ Payment added successfully!');
            fetchStudents(selectedClass);
        } catch { 
            setMsg('❌ Payment failed'); 
        }
        setSaving(false);
    };

    const pending = () => {
        const t = parseFloat(feeForm.totalFees) || 0;
        const d = parseFloat(feeForm.depositedFees) || 0;
        const f = parseFloat(feeForm.fine) || 0;
        const o = parseFloat(feeForm.otherCharges) || 0;
        return t + f + o - d;
    };

    const getStatusColor = (feeRecord) => {
        if (!feeRecord) return '#94a3b8';
        const p = (feeRecord.totalFees + feeRecord.fine + feeRecord.otherCharges) - feeRecord.depositedFees;
        if (p <= 0) return '#10b981';
        if (p < feeRecord.totalFees * 0.5) return '#f59e0b';
        return '#ef4444';
    };

    const [overviewRecords, setOverviewRecords] = useState([]);
    const [overallStats, setOverallStats] = useState({ students: 0, totalFees: 0, depositedFees: 0, pendingFees: 0, feeRate: 0 });

    useEffect(() => {
        fetchOverview();
        fetchOverallStats();
    }, []);

    const fetchOverview = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/fees/overview', {
                headers: config.headers
            });
            setOverviewRecords(data || []);
        } catch (err) {
            console.error('Error fetching fee overview:', err);
        }
    };

    const fetchOverallStats = async () => {
        try {
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/stats', {
                headers: config.headers
            });
            if (data) {
                setOverallStats({
                    students: data.students || 0,
                    totalFees: data.totalFees || 0,
                    depositedFees: data.depositedFees || 0,
                    pendingFees: data.pendingFees || 0,
                    feeRate: data.feeRate || 0
                });
            }
        } catch (err) {
            console.error('Error fetching overall stats:', err);
        }
    };

    // Filter overview records
    const filteredOverview = overviewRecords.filter(r => {
        const matchesMed = !selectedMedium || selectedMedium === 'All Mediums' || r.med === selectedMedium;
        return matchesMed;
    });

    // Pagination for overview
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentOverviewRecords = filteredOverview.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredOverview.length / recordsPerPage) || 1;

    const paginate = (num) => setCurrentPage(num);

    const handleSelectClassFromOverview = (classNameStr) => {
        const clsNumber = classNameStr.replace('Class ', '');
        setSelectedClass(clsNumber);
        fetchStudents(clsNumber, selectedMedium, selectedStream);
    };

    return (
        <div className="dashboard-container" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Sidebar role="principal" />
            
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
                
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', textAlign: 'left' }}>
                        {selectedClass ? (
                            <button 
                                onClick={() => { setSelectedClass(''); setSelectedStudent(null); }}
                                style={{ 
                                    backgroundColor: 'var(--card-bg)', 
                                    border: '1.5px solid var(--border-color)', 
                                    color: 'var(--text-primary)', 
                                    padding: '0.5rem', 
                                    borderRadius: '10px', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <ArrowLeft size={16} />
                            </button>
                        ) : (
                            <div style={{ backgroundColor: '#fffbeb', color: '#ea580c', padding: '0.6rem', borderRadius: '12px', display: 'flex' }} className="fees-money-bag">
                                <Coins size={24} />
                            </div>
                        )}
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                {selectedClass ? `Class ${selectedClass} Fees` : 'Fee Management'}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.2rem', margin: 0 }}>
                                {selectedClass ? `Manage student fee records for class ${selectedClass}` : 'Class-wise student fee tracking & management'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter and Dashboard Stats Row */}
                <div className="glass-card" style={{ 
                    padding: '1.2rem', 
                    border: '1.5px solid var(--border-color)', 
                    backgroundColor: 'var(--card-bg)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    textAlign: 'left'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Class</label>
                        <select 
                            value={selectedClass} 
                            onChange={(e) => { 
                                setSelectedClass(e.target.value); 
                                if(e.target.value) {
                                    fetchStudents(e.target.value, selectedMedium, selectedStream); 
                                } else {
                                    setStudents([]);
                                    setSelectedStudent(null);
                                }
                            }}
                            style={{ 
                                border: '1.5px solid var(--border-color)', 
                                borderRadius: '10px', 
                                padding: '0.6rem 1.2rem', 
                                fontSize: '0.85rem', 
                                fontWeight: '600', 
                                backgroundColor: 'var(--card-bg)', 
                                color: 'var(--text-primary)',
                                minWidth: '130px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Select Class</option>
                            {CLASS_LIST.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Medium</label>
                        <select 
                            value={selectedMedium} 
                            onChange={(e) => { 
                                setSelectedMedium(e.target.value); 
                                if (selectedClass) fetchStudents(selectedClass, e.target.value, selectedStream); 
                            }}
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
                            <option>All Mediums</option>
                            <option>Hindi</option>
                            <option>English</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Stream</label>
                        <select 
                            value={selectedStream} 
                            onChange={(e) => { 
                                setSelectedStream(e.target.value); 
                                if (selectedClass) fetchStudents(selectedClass, selectedMedium, e.target.value); 
                            }}
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
                            <option>All Streams</option>
                            <option>None</option>
                            <option>Science</option>
                            <option>Commerce</option>
                            <option>Arts</option>
                        </select>
                    </div>

                    <button 
                        onClick={() => fetchStudents()} 
                        disabled={!selectedClass}
                        style={{ 
                            background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                            color: 'white', 
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.6rem 1.5rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            cursor: selectedClass ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            height: '42px',
                            marginLeft: 'auto',
                            opacity: selectedClass ? 1 : 0.6
                        }}
                    >
                        <RefreshCw size={15} />
                        Refresh
                    </button>
                </div>

                {/* Overall Stats Cards Grid Row (Screenshot 3) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                    
                    {/* Total Students */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ backgroundColor: '#faf5ff', color: '#8b5cf6', padding: '0.7rem', borderRadius: '12px' }}>
                            <Users size={22} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Total Students</span>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{overallStats.students}</h2>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>All Students</span>
                        </div>
                    </div>

                    {/* Total Collection */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.7rem', borderRadius: '12px' }}>
                            <Coins size={22} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Total Collection (This Year)</span>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>₹{overallStats.depositedFees.toLocaleString('en-IN')}</h2>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Till Date</span>
                        </div>
                    </div>

                    {/* Pending Amount */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.7rem', borderRadius: '12px' }}>
                            <Clock size={22} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Pending Amount</span>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>₹{overallStats.pendingFees.toLocaleString('en-IN')}</h2>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>From All Students</span>
                        </div>
                    </div>

                    {/* Collection Rate */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                        <div style={{ backgroundColor: '#fff3eb', color: '#ea580c', padding: '0.7rem', borderRadius: '12px' }}>
                            <TrendingUp size={22} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>Collection Rate</span>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0' }}>{overallStats.feeRate}%</h2>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Overall Collection</span>
                        </div>
                    </div>

                </div>

                {loading && <Spinner text="Loading fee data..." />}

                {/* Conditional Rendering: Overview Table vs. Class Details List */}
                {!loading && !selectedClass && (
                    /* Main Overview Dashboard Table (Screenshot 3) */
                    <div className="glass-card" style={{ 
                        border: '1.5px solid var(--border-color)', 
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.01)'
                    }}>
                        {/* Table Card Header Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '1.5px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                Fee Collection Overview
                            </h3>
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                                    <Filter size={14} color="#8b5cf6" />
                                    Filters
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                                    <Download size={14} color="#8b5cf6" />
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Overview Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '50px' }}>#</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Class</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Medium</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Total Students</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Fee (₹)</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Collected (₹)</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pending (₹)</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', width: '180px' }}>Collection %</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center', width: '80px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOverviewRecords.map((r, index) => {
                                        const serialNum = String(indexOfFirstRecord + index + 1).padStart(2, '0');
                                        return (
                                            <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="fee-tr-hover">
                                                <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{serialNum}</td>
                                                <td style={{ padding: '1.1rem 1rem', fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)' }}>{r.c}</td>
                                                <td style={{ padding: '1.1rem 1rem' }}>
                                                    <span style={{ 
                                                        padding: '0.25rem 0.75rem', 
                                                        borderRadius: '6px', 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: '800',
                                                        backgroundColor: r.med === 'Hindi' ? '#fff3eb' : '#e0f2fe',
                                                        color: r.med === 'Hindi' ? '#ea580c' : '#0284c7'
                                                    }}>
                                                        {r.med}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.1rem 1rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center' }}>{r.stud}</td>
                                                <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{r.total.toLocaleString()}</td>
                                                <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: '#16a34a' }}>{r.coll.toLocaleString()}</td>
                                                <td style={{ padding: '1.1rem 1rem', fontSize: '0.85rem', fontWeight: '700', color: '#ef4444' }}>{r.pend.toLocaleString()}</td>
                                                
                                                {/* Progress Bar Cell */}
                                                <td style={{ padding: '1.1rem 1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${r.pct}%`, backgroundColor: '#8b5cf6', height: '100%', borderRadius: '3px' }}></div>
                                                        </div>
                                                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)', width: '32px', textAlign: 'right' }}>{r.pct}%</span>
                                                    </div>
                                                </td>

                                                {/* Action View Icon */}
                                                <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>
                                                    <button 
                                                        onClick={() => handleSelectClassFromOverview(r.c)}
                                                        style={{ 
                                                            background: 'none', 
                                                            padding: '6px', 
                                                            cursor: 'pointer', 
                                                            color: 'var(--text-secondary)',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            borderRadius: '6px',
                                                            border: '1.5px solid var(--border-color)',
                                                            backgroundColor: 'var(--card-bg)'
                                                        }}
                                                        className="view-fee-btn"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Overview Pagination Footer */}
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
                                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredOverview.length)} of {filteredOverview.length} records
                            </span>

                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                    <span>Rows per page:</span>
                                    <select 
                                        value={recordsPerPage}
                                        onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                        style={{ 
                                            border: '1.5px solid var(--border-color)', 
                                            borderRadius: '6px', 
                                            padding: '2px 6px', 
                                            fontWeight: '600',
                                            backgroundColor: 'var(--card-bg)',
                                            color: 'var(--text-primary)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                    </select>
                                </div>

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
                                            opacity: currentPage === 1 ? 0.5 : 1
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
                                            opacity: currentPage === totalPages ? 0.5 : 1
                                        }}
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactive Student Fee Management List Layout */}
                {!loading && selectedClass && students.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '320px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }} className="students-fee-split">
                        
                        {/* Student Selector List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }} className="students-selector-column">
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '800', textAlign: 'left' }}>
                                Class {selectedClass} • {students.length} Students
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
                                {students.map(s => {
                                    const statusColor = getStatusColor(s.feeRecord);
                                    const pend = s.feeRecord ? (s.feeRecord.totalFees + s.feeRecord.fine + s.feeRecord.otherCharges) - s.feeRecord.depositedFees : null;
                                    const isSelected = selectedStudent?._id === s._id;
                                    return (
                                        <div 
                                            key={s._id} 
                                            onClick={() => selectStudent(s)}
                                            style={{
                                                padding: '1rem', 
                                                borderRadius: '12px', 
                                                cursor: 'pointer',
                                                background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'var(--card-bg)',
                                                border: `1.5px solid ${isSelected ? '#8b5cf6' : 'var(--border-color)'}`,
                                                transition: 'all 0.25s ease',
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center'
                                            }}
                                            className="student-fee-list-card"
                                        >
                                            <div style={{ textAlign: 'left' }}>
                                                <p style={{ fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontSize: '0.9rem' }}>{s.studentName}</p>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: '2px 0 0 0', fontWeight: '500' }}>Father: {s.fatherName}</p>
                                            </div>
                                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }} />
                                                {pend !== null && (
                                                    <p style={{ color: pend > 0 ? '#ef4444' : '#10b981', fontWeight: '800', fontSize: '0.82rem', margin: 0 }}>
                                                        {pend > 0 ? `₹${pend}` : 'Paid'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Student Fee Detail Form Panel */}
                        {selectedStudent ? (
                            <div className="glass-card" style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', border: '1.5px solid var(--border-color)', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.35rem', fontWeight: '800' }}>{selectedStudent.studentName}</h2>
                                        <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.85rem', fontWeight: '500' }}>
                                            Class {selectedStudent.className} • Father: {selectedStudent.fatherName}
                                        </p>
                                    </div>
                                    {/* Dynamic Pending Alert */}
                                    <div style={{ textAlign: 'right', background: pending() > 0 ? '#fee2e2' : '#dcfce7', padding: '0.5rem 1rem', borderRadius: '10px', color: pending() > 0 ? '#ef4444' : '#10b981', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Pending Amount</span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                                            ₹{pending().toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {msg && (
                                    <div style={{ 
                                        padding: '0.6rem 1rem', 
                                        borderRadius: '8px', 
                                        marginBottom: '1rem', 
                                        background: msg.includes('✅') ? '#dcfce7' : '#fee2e2', 
                                        color: msg.includes('✅') ? '#15803d' : '#ef4444', 
                                        fontWeight: '700', 
                                        fontSize: '0.85rem' 
                                    }}>
                                        {msg}
                                    </div>
                                )}

                                {/* Form Tabs layout */}
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                    {[
                                        { id: 'details', label: 'Fee Details', icon: CreditCard },
                                        { id: 'payment', label: 'Add Payment', icon: Coins },
                                        { id: 'history', label: 'History', icon: History }
                                    ].map(t => {
                                        const Icon = t.icon;
                                        return (
                                            <button 
                                                key={t.id} 
                                                onClick={() => setTab(t.id)} 
                                                style={{
                                                    padding: '0.5rem 1.2rem', 
                                                    border: 'none', 
                                                    borderRadius: '8px',
                                                    background: tab === t.id ? '#8b5cf6' : 'transparent',
                                                    color: tab === t.id ? 'white' : 'var(--text-secondary)',
                                                    fontWeight: '700', 
                                                    cursor: 'pointer', 
                                                    transition: 'all 0.2s',
                                                    fontSize: '0.82rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <Icon size={14} />
                                                {t.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Fee Details Editor Form */}
                                {tab === 'details' && (
                                    <form onSubmit={handleSaveFee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            {[
                                                { label: 'Total Fees (₹)', key: 'totalFees', type: 'number' },
                                                { label: 'Deposited Fees (₹)', key: 'depositedFees', type: 'number' },
                                                { label: 'Fine Amount (₹)', key: 'fine', type: 'number' },
                                                { label: 'Fine Description', key: 'fineDescription', type: 'text' },
                                                { label: 'Other Charges (₹)', key: 'otherCharges', type: 'number' },
                                                { label: 'Other Charges Description', key: 'otherChargesDescription', type: 'text' },
                                            ].map(f => (
                                                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{f.label}</label>
                                                    <input 
                                                        type={f.type} 
                                                        value={feeForm[f.key]} 
                                                        onChange={e => setFeeForm({ ...feeForm, [f.key]: e.target.value })}
                                                        style={{ 
                                                            padding: '0.6rem 0.8rem', 
                                                            borderRadius: '8px', 
                                                            border: '1.5px solid var(--border-color)', 
                                                            backgroundColor: 'var(--bg-light)', 
                                                            color: 'var(--text-primary)',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600'
                                                        }} 
                                                    />
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Due Date</label>
                                                <input 
                                                    type="date" 
                                                    value={feeForm.dueDate} 
                                                    onChange={e => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                                                    style={{ 
                                                        padding: '0.6rem 0.8rem', 
                                                        borderRadius: '8px', 
                                                        border: '1.5px solid var(--border-color)', 
                                                        backgroundColor: 'var(--bg-light)', 
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600'
                                                    }} 
                                                />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Remarks</label>
                                                <textarea 
                                                    value={feeForm.remarks} 
                                                    onChange={e => setFeeForm({ ...feeForm, remarks: e.target.value })} 
                                                    rows="2"
                                                    style={{ 
                                                        padding: '0.6rem 0.8rem', 
                                                        borderRadius: '8px', 
                                                        border: '1.5px solid var(--border-color)', 
                                                        backgroundColor: 'var(--bg-light)', 
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        resize: 'vertical'
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={saving} 
                                            style={{ 
                                                marginTop: '0.5rem', 
                                                width: '100%', 
                                                padding: '0.75rem', 
                                                fontSize: '0.88rem',
                                                fontWeight: '700',
                                                background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Save size={16} />
                                            {saving ? 'Saving...' : 'Save Fee Details'}
                                        </button>
                                    </form>
                                )}

                                {/* Add Payment Form */}
                                {tab === 'payment' && (
                                    <form onSubmit={handleAddPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Amount (₹)</label>
                                                <input 
                                                    type="number" 
                                                    value={paymentForm.amount} 
                                                    onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} 
                                                    required
                                                    style={{ 
                                                        padding: '0.6rem 0.8rem', 
                                                        borderRadius: '8px', 
                                                        border: '1.5px solid var(--border-color)', 
                                                        backgroundColor: 'var(--bg-light)', 
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600'
                                                    }} 
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Payment Mode</label>
                                                <select 
                                                    value={paymentForm.mode} 
                                                    onChange={e => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                                                    style={{ 
                                                        padding: '0.6rem 0.8rem', 
                                                        borderRadius: '8px', 
                                                        border: '1.5px solid var(--border-color)', 
                                                        backgroundColor: 'var(--bg-light)', 
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {['Cash', 'Online', 'Cheque', 'DD'].map(m => <option key={m}>{m}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Note</label>
                                                <input 
                                                    type="text" 
                                                    value={paymentForm.note} 
                                                    onChange={e => setPaymentForm({ ...paymentForm, note: e.target.value })} 
                                                    placeholder="Optional note"
                                                    style={{ 
                                                        padding: '0.6rem 0.8rem', 
                                                        borderRadius: '8px', 
                                                        border: '1.5px solid var(--border-color)', 
                                                        backgroundColor: 'var(--bg-light)', 
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500'
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={saving} 
                                            style={{ 
                                                marginTop: '0.5rem', 
                                                width: '100%', 
                                                padding: '0.75rem', 
                                                fontSize: '0.88rem',
                                                fontWeight: '700',
                                                background: 'linear-gradient(to right, #16a34a, #22c55e)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Coins size={16} />
                                            {saving ? 'Processing...' : 'Add Payment'}
                                        </button>
                                    </form>
                                )}

                                {/* Payment History Log list */}
                                {tab === 'history' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        {!selectedStudent.feeRecord?.paymentHistory?.length ? (
                                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem', fontWeight: '600' }}>
                                                No payment history recorded yet.
                                            </p>
                                        ) : (
                                            [...selectedStudent.feeRecord.paymentHistory].reverse().map((p, i) => (
                                                <div 
                                                    key={i} 
                                                    style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center', 
                                                        padding: '1rem', 
                                                        background: 'var(--bg-light)', 
                                                        borderRadius: '12px', 
                                                        border: '1.5px solid var(--border-color)'
                                                    }}
                                                >
                                                    <div style={{ textAlign: 'left' }}>
                                                        <p style={{ margin: 0, fontWeight: '800', color: '#16a34a', fontSize: '1rem' }}>₹{p.amount.toLocaleString()}</p>
                                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{p.note || 'No description'}</p>
                                                    </div>
                                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
                                                        <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '800' }}>{p.mode}</span>
                                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Card asking to select student */
                            <div className="glass-card" style={{ padding: '4rem 2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <div style={{ backgroundColor: '#f3e8ff', color: '#8b5cf6', padding: '0.8rem', borderRadius: '50%', display: 'flex', marginBottom: '0.5rem' }}>
                                    <CreditCard size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Select a Student</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', maxWidth: '280px', margin: 0 }}>
                                    Choose a student from the list to view detailed fee logs, check pending amounts or register a payment.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                .fee-tr-hover:hover {
                    background-color: var(--bg-light) !important;
                }
                .student-fee-list-card:hover {
                    background-color: var(--bg-light) !important;
                    border-color: var(--border-color) !important;
                }
                body.dark .fees-money-bag {
                    background-color: rgba(249, 115, 22, 0.1) !important;
                    color: #f97316 !important;
                }
            `}</style>
        </div>
    );
};

export default PrincipalFees;
