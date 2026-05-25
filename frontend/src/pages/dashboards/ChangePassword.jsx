import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

const ChangePassword = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });

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
            <div className="dashboard-content">
                <h1>Change Password</h1>
                <p>Update your account security by changing your password periodically.</p>

                <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', maxWidth: '500px', backgroundColor: 'white' }}>
                    {status.msg && (
                        <div style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            marginBottom: '1.5rem', 
                            backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                            color: status.type === 'success' ? '#166534' : '#991b1b',
                            textAlign: 'center'
                        }}>
                            {status.msg}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <input 
                            type="password" 
                            placeholder="Current Password" 
                            className="form-input" 
                            required 
                            value={formData.oldPassword}
                            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })} 
                        />
                        <input 
                            type="password" 
                            placeholder="New Password" 
                            className="form-input" 
                            required 
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} 
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            className="form-input" 
                            required 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                        />
                        <button type="submit" className="btn btn-primary">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
