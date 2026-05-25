import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Info } from 'lucide-react';

const FeeStructureViewer = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedium, setSelectedMedium] = useState('Hindi');

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/fee-structure');
                setFees(data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchFees();
    }, []);

    const filteredFees = fees.filter(f => f.medium === selectedMedium);

    return (
        <div style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '1rem', transition: 'color 0.3s ease' }}>Academic Fee Structure</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', transition: 'color 0.3s ease' }}>Detailed breakdown of school fees for the academic year 2026-27.</p>
                </motion.div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'var(--bg-light)', padding: '5px', borderRadius: '30px', display: 'flex', gap: '5px', border: '1px solid var(--border-color)', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                        {['Hindi', 'English'].map(m => (
                            <button 
                                key={m}
                                onClick={() => setSelectedMedium(m)}
                                style={{
                                    padding: '10px 30px',
                                    borderRadius: '25px',
                                    border: 'none',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    background: selectedMedium === m ? 'var(--primary)' : 'transparent',
                                    color: selectedMedium === m ? 'white' : 'var(--primary)'
                                }}
                            >
                                {m} Medium
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                        <p style={{ color: 'var(--primary)', fontWeight: '600' }}>Fetching latest fee details...</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', padding: '2rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflowX: 'auto', transition: 'background 0.3s ease, color 0.3s ease' }}>
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', minWidth: '800px', background: 'transparent' }}>
                            <thead>
                                <tr style={{ background: 'var(--primary)', color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                                    <th style={{ padding: '1.5rem 1.2rem', background: 'var(--primary) !important', backgroundColor: 'var(--primary)', color: 'white !important', borderRadius: '12px 0 0 12px', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Class</th>
                                    <th style={{ padding: '1.5rem 1.2rem', background: 'var(--primary) !important', backgroundColor: 'var(--primary)', color: 'white !important', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Tuition Fee</th>
                                    <th style={{ padding: '1.5rem 1.2rem', background: 'var(--primary) !important', backgroundColor: 'var(--primary)', color: 'white !important', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Books Fee</th>
                                    <th style={{ padding: '1.5rem 1.2rem', background: 'var(--primary) !important', backgroundColor: 'var(--primary)', color: 'white !important', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Dress Fee</th>
                                    <th style={{ padding: '1.5rem 1.2rem', background: 'var(--primary) !important', backgroundColor: 'var(--primary)', color: 'white !important', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Admission</th>
                                    <th style={{ padding: '1.5rem 1.2rem', background: 'var(--primary) !important', backgroundColor: 'var(--primary)', color: 'white !important', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Other</th>
                                    <th style={{ padding: '1.5rem 1.2rem', background: 'var(--primary) !important', backgroundColor: 'var(--primary)', color: 'white !important', borderRadius: '0 12px 12px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Total (Yearly)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFees.map(f => (
                                    <tr key={f._id} className="fee-row" style={{ background: 'var(--bg-light)', transition: 'background-color 0.3s ease, border-color 0.3s ease', borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1.2rem', fontWeight: '700', color: 'var(--primary)', borderRadius: '12px 0 0 12px', transition: 'color 0.3s ease' }}>Class {f.className}</td>
                                        <td style={{ padding: '1.2rem', fontWeight: '600' }}>₹{f.tuitionFee}</td>
                                        <td style={{ padding: '1.2rem', fontWeight: '600' }}>₹{f.booksFee}</td>
                                        <td style={{ padding: '1.2rem', fontWeight: '600' }}>₹{f.dressFee}</td>
                                        <td style={{ padding: '1.2rem', fontWeight: '600' }}>₹{f.admissionCharges}</td>
                                        <td style={{ padding: '1.2rem', fontWeight: '600' }}>₹{f.otherCharges}</td>
                                        <td style={{ padding: '1.2rem', fontWeight: '800', color: 'var(--secondary)', fontSize: '1.25rem', borderRadius: '0 12px 12px 0', transition: 'color 0.3s ease' }}>₹{f.total}</td>
                                    </tr>
                                ))}
                                {filteredFees.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                            No fee structure defined for {selectedMedium} Medium yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-light)', borderRadius: '16px', border: '1.5px solid var(--border-color)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                            <Info color="var(--secondary)" size={24} style={{ marginTop: '0.2rem' }} />
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', transition: 'color 0.3s ease' }}>Fee Policies & Breakdown:</h4>
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', transition: 'color 0.3s ease' }}>
                                    <li><strong>Tuition Fee</strong>: Covering primary academic instruction, labs, and interactive sessions.</li>
                                    <li><strong>Admission Charges</strong>: One-time fee for new enrollments only.</li>
                                    <li><strong>Books & Dress</strong>: Estimated costs; may vary slightly based on specific requirements.</li>
                                    <li><strong>Installments</strong>: Tuition fees can be paid in monthly or quarterly installments.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default FeeStructureViewer;
