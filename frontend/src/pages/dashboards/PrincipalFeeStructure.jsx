import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { CreditCard, Save, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PrincipalFeeStructure = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(null);
    const [filterMedium, setFilterMedium] = useState('All');
    const [formData, setFormData] = useState({
        className: '', medium: 'Hindi', tuitionFee: 0, booksFee: 0, dressFee: 0, admissionCharges: 0, otherCharges: 0
    });

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

    const filteredFees = filterMedium === 'All' ? fees : fees.filter(f => f.medium === filterMedium);

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ color: '#1a2a6c', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <CreditCard color="#166534" size={32} /> Fee Structure Management
                    </h1>
                    <p style={{ color: '#64748b' }}>Define and adjust fees for each class and medium.</p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', background: 'white', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#1a2a6c' }}>{editing ? `Editing: ${editing}` : 'Add/Update Class Fees'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.2rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px' }}>Class</label>
                            <select className="form-input" required value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })}>
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px' }}>Medium</label>
                            <select className="form-input" required value={formData.medium} onChange={(e) => setFormData({ ...formData, medium: e.target.value })}>
                                {mediums.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px' }}>Tuition</label>
                            <input type="number" className="form-input" value={formData.tuitionFee} onChange={(e) => setFormData({ ...formData, tuitionFee: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px' }}>Books</label>
                            <input type="number" className="form-input" value={formData.booksFee} onChange={(e) => setFormData({ ...formData, booksFee: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px' }}>Dress</label>
                            <input type="number" className="form-input" value={formData.dressFee} onChange={(e) => setFormData({ ...formData, dressFee: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px' }}>Admission</label>
                            <input type="number" className="form-input" value={formData.admissionCharges} onChange={(e) => setFormData({ ...formData, admissionCharges: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px' }}>Other</label>
                            <input type="number" className="form-input" value={formData.otherCharges} onChange={(e) => setFormData({ ...formData, otherCharges: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Save size={18} /> {editing ? 'Update' : 'Save'}
                        </button>
                    </form>
                </div>

                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#1a2a6c' }}>Filter by Medium:</span>
                    {['All', 'Hindi', 'English'].map(m => (
                        <button 
                            key={m} 
                            onClick={() => setFilterMedium(m)}
                            style={{ 
                                padding: '6px 16px', 
                                borderRadius: '20px', 
                                border: 'none', 
                                background: filterMedium === m ? '#1a2a6c' : '#e2e8f0',
                                color: filterMedium === m ? 'white' : '#1a2a6c',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: '0.3s'
                            }}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div className="glass-card" style={{ background: 'white', overflowX: 'auto' }}>
                    <table className="data-table" style={{ width: '100%' }}>
                        <thead>
                            <tr style={{ background: '#1a2a6c', color: 'white' }}>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', borderRadius: '12px 0 0 0', fontWeight: '800', textTransform: 'uppercase' }}>Class</th>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', fontWeight: '800', textTransform: 'uppercase' }}>Medium</th>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', fontWeight: '800', textTransform: 'uppercase' }}>Tuition</th>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', fontWeight: '800', textTransform: 'uppercase' }}>Books</th>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', fontWeight: '800', textTransform: 'uppercase' }}>Dress</th>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', fontWeight: '800', textTransform: 'uppercase' }}>Admission</th>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', fontWeight: '800', textTransform: 'uppercase' }}>Other</th>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', fontWeight: '800', textTransform: 'uppercase' }}>Total</th>
                                <th style={{ padding: '1.2rem', background: '#1a2a6c !important', backgroundColor: '#1a2a6c', color: 'white !important', borderRadius: '0 12px 0 0', fontWeight: '800', textTransform: 'uppercase' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFees.map(f => (
                                <tr key={f._id}>
                                    <td style={{ fontWeight: '600' }}>Class {f.className}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '12px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '700',
                                            background: f.medium === 'English' ? '#e0f2fe' : '#fef3c7',
                                            color: f.medium === 'English' ? '#0369a1' : '#92400e'
                                        }}>
                                            {f.medium}
                                        </span>
                                    </td>
                                    <td>₹{f.tuitionFee}</td>
                                    <td>₹{f.booksFee}</td>
                                    <td>₹{f.dressFee}</td>
                                    <td>₹{f.admissionCharges}</td>
                                    <td>₹{f.otherCharges}</td>
                                    <td style={{ fontWeight: '800', color: '#166534' }}>₹{f.total}</td>
                                    <td>
                                        <button onClick={() => startEdit(f)} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredFees.length === 0 && <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No fee data found for this medium.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PrincipalFeeStructure;
