import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { Lock, Key, ShieldCheck, Eye, EyeOff, Info } from 'lucide-react';

const ChangePassword = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Password visibility toggles
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Dynamic strength calculator
    const getStrength = (pwd) => {
        if (!pwd) return { label: 'None', color: '#cbd5e1', width: '0%', text: '' };
        if (pwd.length < 6) return { label: 'Weak', color: '#ef4444', width: '25%', text: 'Weak' };
        
        const hasNumbers = /\d/.test(pwd);
        const hasSymbols = /[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\,\<\>\.\?\/\~]/.test(pwd);
        const hasCaps = /[A-Z]/.test(pwd);
        
        if (pwd.length >= 10 && hasNumbers && hasSymbols && hasCaps) {
            return { label: 'Strong', color: '#10b981', width: '100%', text: 'Strong' };
        }
        return { label: 'Medium', color: '#f59e0b', width: '60%', text: 'Medium' };
    };

    const strength = getStrength(formData.newPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return setStatus({ type: 'error', msg: 'New passwords do not match' });
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/change-password', 
                { oldPassword: formData.oldPassword, newPassword: formData.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus({ type: 'success', msg: 'Password changed successfully' });
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Error changing password' });
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role={user?.role} />
            <div className="dashboard-content change-password-panel">
                {/* Header Section */}
                <div className="panel-header-section" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                    <div className="header-icon-container" style={{
                        background: '#f5f3ff',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Lock color="#6d28d9" size={24} />
                    </div>
                    <div>
                        <h1 style={{ color: '#1e1b4b', margin: 0, fontSize: '1.85rem', fontWeight: '800' }} className="panel-title">
                            Change Password
                        </h1>
                        <p style={{ color: '#6b7280', margin: '4px 0 0' }} className="panel-subtitle">Update your account security by changing your password periodically.</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-card form-card-wrapper" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '20px', border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', maxWidth: '800px', marginBottom: '1.5rem' }}>
                    {status.msg && (
                        <div style={{ 
                            padding: '1rem', 
                            borderRadius: '10px', 
                            marginBottom: '1.5rem', 
                            backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                            color: status.type === 'success' ? '#166534' : '#991b1b',
                            textAlign: 'center',
                            fontWeight: '600'
                        }}>
                            {status.msg}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }} className="password-form">
                        
                        {/* Current Password Field */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937' }}>Current Password</label>
                            <div className="input-with-prefix-suffix" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div className="prefix-icon-container" style={{
                                    position: 'absolute', left: '10px', width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Key size={16} color="#6d28d9" />
                                </div>
                                <input 
                                    type={showOld ? "text" : "password"} 
                                    placeholder="Enter your current password" 
                                    className="form-input custom-password-input" 
                                    required 
                                    value={formData.oldPassword}
                                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })} 
                                    style={{ paddingLeft: '3.4rem', paddingRight: '2.8rem', height: '48px', borderRadius: '10px', width: '100%', border: '1px solid #e5e7eb' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowOld(!showOld)}
                                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                                >
                                    {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937' }}>New Password</label>
                            <div className="input-with-prefix-suffix" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div className="prefix-icon-container" style={{
                                    position: 'absolute', left: '10px', width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Lock size={16} color="#6d28d9" />
                                </div>
                                <input 
                                    type={showNew ? "text" : "password"} 
                                    placeholder="Enter your new password" 
                                    className="form-input custom-password-input" 
                                    required 
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} 
                                    style={{ paddingLeft: '3.4rem', paddingRight: '2.8rem', height: '48px', borderRadius: '10px', width: '100%', border: '1px solid #e5e7eb' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowNew(!showNew)}
                                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Strength Meter Bar */}
                            {formData.newPassword && (
                                <div style={{ marginTop: '0.4rem' }}>
                                    <div style={{ display: 'flex', gap: '4px', height: '4px', width: '100%', maxWidth: '280px', background: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: strength.width, background: strength.color, height: '100%', borderRadius: '2px', transition: 'width 0.3s ease' }} />
                                    </div>
                                    <p style={{ margin: '6px 0 0', fontSize: '0.78rem', fontWeight: '600', color: '#6b7280' }}>
                                        Password strength: <span style={{ color: strength.color }}>{strength.text}</span>
                                    </p>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>Use at least 8 characters with a mix of letters, numbers & symbols.</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password Field */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937' }}>Confirm New Password</label>
                            <div className="input-with-prefix-suffix" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div className="prefix-icon-container" style={{
                                    position: 'absolute', left: '10px', width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <ShieldCheck size={16} color="#6d28d9" />
                                </div>
                                <input 
                                    type={showConfirm ? "text" : "password"} 
                                    placeholder="Confirm your new password" 
                                    className="form-input custom-password-input" 
                                    required 
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                                    style={{ paddingLeft: '3.4rem', paddingRight: '2.8rem', height: '48px', borderRadius: '10px', width: '100%', border: '1px solid #e5e7eb' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="btn update-password-btn" style={{ height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', color: 'white', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                            <Lock size={18} /> Update Password
                        </button>
                    </form>
                </div>

                {/* Security Tips Box */}
                <div className="glass-card security-tips-card" style={{ padding: '1.2rem 1.5rem', background: '#f5f3ff', border: '1px solid rgba(109, 40, 217, 0.1)', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center', maxWidth: '800px' }}>
                    <div style={{
                        background: '#eedeff',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <ShieldCheck size={20} color="#6d28d9" />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, color: '#4c1d95', fontSize: '0.9rem', fontWeight: '700' }}>Security Tips</h4>
                        <p style={{ margin: '2px 0 0', color: '#5b21b6', fontSize: '0.8rem', fontWeight: '500' }}>Use a strong password and change it regularly to keep your account secure.</p>
                    </div>
                </div>
            </div>

            <style>{`
                /* === LIGHT MODE OVERRIDES SCOPED ONLY IN LIGHT THEME === */
                body:not(.dark) .change-password-panel {
                    background-color: #fcfbf7 !important;
                }
                
                body:not(.dark) .change-password-panel .form-card-wrapper {
                    background: #ffffff !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.02) !important;
                    border: 1px solid rgba(243, 244, 246, 0.9) !important;
                }

                body:not(.dark) .custom-password-input {
                    background-color: #ffffff !important;
                    border: 1.5px solid #e5e7eb !important;
                    color: #1f2937 !important;
                }

                body:not(.dark) .custom-password-input:focus {
                    border-color: #6d28d9 !important;
                    box-shadow: 0 0 0 4px rgba(109, 40, 217, 0.08) !important;
                }

                body:not(.dark) .update-password-btn {
                    background: linear-gradient(to right, #4f46e5, #db2777) !important;
                    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.2) !important;
                    transition: all 0.3s ease;
                }

                body:not(.dark) .update-password-btn:hover {
                    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3) !important;
                    transform: translateY(-1px);
                }

                body:not(.dark) .security-tips-card {
                    background: #f5f3ff !important;
                }
            `}</style>
        </div>
    );
};

export default ChangePassword;
