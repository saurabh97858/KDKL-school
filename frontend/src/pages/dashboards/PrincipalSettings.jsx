import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Save, Info, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const PrincipalSettings = () => {
    const [settings, setSettings] = useState({
        address: '',
        phone1: '',
        phone2: '',
        email: '',
        instagramUrl: '',
        facebookUrl: '',
        admissionCloudText: '',
        showFeeStructureInNavbar: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/settings');
                setSettings({
                    address: data.address || '',
                    phone1: data.phone1 || '',
                    phone2: data.phone2 || '',
                    email: data.email || '',
                    instagramUrl: data.instagramUrl || '',
                    facebookUrl: data.facebookUrl || '',
                    admissionCloudText: data.admissionCloudText || 'Admission Open 2026-27',
                    showFeeStructureInNavbar: data.showFeeStructureInNavbar || false
                });
            } catch (err) {
                console.error('Failed to fetch settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/settings', settings, config);
            alert('Settings updated successfully');
        } catch (err) {
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Info size={32} color="#1a2a6c" />
                    <h1>School Contact Settings</h1>
                </div>

                <div className="glass-card" style={{ padding: '2.5rem', backgroundColor: 'white', maxWidth: '800px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>School Address</label>
                                <textarea 
                                    name="address"
                                    value={settings.address}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                                    placeholder="Enter full school address"
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        <Phone size={16} /> Phone Number 1
                                    </label>
                                    <input 
                                        type="text"
                                        name="phone1"
                                        value={settings.phone1}
                                        onChange={handleChange}
                                        className="form-input"
                                        style={{ width: '100%' }}
                                        placeholder="+91 XXXXXXXXXX"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        <Phone size={16} /> Phone Number 2
                                    </label>
                                    <input 
                                        type="text"
                                        name="phone2"
                                        value={settings.phone2}
                                        onChange={handleChange}
                                        className="form-input"
                                        style={{ width: '100%' }}
                                        placeholder="+91 XXXXXXXXXX"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    <Mail size={16} /> Contact Email ID
                                </label>
                                <input 
                                    type="email"
                                    name="email"
                                    value={settings.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ width: '100%' }}
                                    placeholder="school@example.com"
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        <Instagram size={16} /> Instagram URL
                                    </label>
                                    <input 
                                        type="url"
                                        name="instagramUrl"
                                        value={settings.instagramUrl}
                                        onChange={handleChange}
                                        className="form-input"
                                        style={{ width: '100%' }}
                                        placeholder="https://instagram.com/your-school"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        <Facebook size={16} /> Facebook URL
                                    </label>
                                    <input 
                                        type="url"
                                        name="facebookUrl"
                                        value={settings.facebookUrl}
                                        onChange={handleChange}
                                        className="form-input"
                                        style={{ width: '100%' }}
                                        placeholder="https://facebook.com/your-school"
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '1rem', border: '1px solid #fee2e2', borderRadius: '12px', background: '#fff5f5' }}>
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 'bold', color: '#b91c1c' }}>Admission Cloud Management</label>
                                <input 
                                    type="text"
                                    name="admissionCloudText"
                                    value={settings.admissionCloudText}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ width: '100%', border: '1px solid #fecaca' }}
                                    placeholder="Enter text for the red shining cloud"
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                <input 
                                    type="checkbox"
                                    checked={settings.showFeeStructureInNavbar}
                                    onChange={(e) => setSettings({ ...settings, showFeeStructureInNavbar: e.target.checked })}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <label style={{ fontWeight: '600' }}>Show "Fee Structure" in Public Navbar</label>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                <Save size={20} /> {saving ? 'Saving...' : 'Save School Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style jsx>{`
                .form-input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; }
            `}</style>
        </div>
    );
};

export default PrincipalSettings;
