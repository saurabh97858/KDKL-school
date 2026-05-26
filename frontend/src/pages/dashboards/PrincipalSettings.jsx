import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Save, Info, Phone, Mail, Instagram, Facebook, MapPin } from 'lucide-react';

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
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get(
                    (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/settings'
                );
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
        setSaved(false);
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(
                (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/principal/settings',
                settings,
                config
            );
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <Sidebar role="principal" />
                <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading settings...</p>
                </div>
            </div>
        );
    }

    const maxAddress = 300;

    return (
        <div className="dashboard-container">
            <Sidebar role="principal" />
            <div className="dashboard-content settings-panel">

                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                    <div style={{
                        background: '#f5f3ff',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Info color="#6d28d9" size={24} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: '800' }} className="panel-title settings-title">
                            School Contact Settings
                        </h1>
                        <p style={{ margin: '4px 0 0', color: '#6b7280' }} className="panel-subtitle">
                            Update your school's contact information.
                        </p>
                    </div>
                </div>

                {/* Success Banner */}
                {saved && (
                    <div style={{
                        padding: '0.9rem 1.2rem',
                        borderRadius: '10px',
                        marginBottom: '1.5rem',
                        background: '#dcfce7',
                        color: '#166534',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        maxWidth: '900px'
                    }}>
                        ✅ School settings saved successfully!
                    </div>
                )}

                {/* Main Form Card */}
                <div className="glass-card settings-form-card" style={{
                    padding: '2.2rem',
                    borderRadius: '20px',
                    maxWidth: '900px',
                    marginBottom: '2rem'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

                            {/* School Address */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }} className="field-label">
                                    School Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div className="prefix-icon-block" style={{
                                        position: 'absolute', left: '12px', top: '14px',
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        background: '#f5f3ff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <MapPin size={16} color="#6d28d9" />
                                    </div>
                                    <textarea
                                        name="address"
                                        value={settings.address}
                                        onChange={(e) => {
                                            if (e.target.value.length <= maxAddress) handleChange(e);
                                        }}
                                        className="form-input settings-textarea"
                                        placeholder="Enter full school address"
                                        required
                                        style={{
                                            paddingLeft: '3.4rem',
                                            paddingTop: '1rem',
                                            paddingRight: '5rem',
                                            minHeight: '90px',
                                            borderRadius: '12px',
                                            resize: 'vertical',
                                            width: '100%'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute', bottom: '10px', right: '14px',
                                        fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500'
                                    }}>
                                        {settings.address.length}/{maxAddress}
                                    </span>
                                </div>
                            </div>

                            {/* Phone Numbers */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="two-col-grid">
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }} className="field-label">
                                        <Phone size={14} color="#6d28d9" /> Phone Number 1
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div className="prefix-icon-block" style={{
                                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            background: '#f5f3ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Phone size={15} color="#6d28d9" />
                                        </div>
                                        <input
                                            type="text"
                                            name="phone1"
                                            value={settings.phone1}
                                            onChange={handleChange}
                                            className="form-input settings-input"
                                            placeholder="+91 XXXXXXXXXX"
                                            required
                                            style={{ paddingLeft: '3.4rem', borderRadius: '10px', height: '46px', width: '100%' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }} className="field-label">
                                        <Phone size={14} color="#6d28d9" /> Phone Number 2
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div className="prefix-icon-block" style={{
                                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            background: '#f5f3ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Phone size={15} color="#6d28d9" />
                                        </div>
                                        <input
                                            type="text"
                                            name="phone2"
                                            value={settings.phone2}
                                            onChange={handleChange}
                                            className="form-input settings-input"
                                            placeholder="+91 XXXXXXXXXX"
                                            style={{ paddingLeft: '3.4rem', borderRadius: '10px', height: '46px', width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Email */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }} className="field-label">
                                    <Mail size={14} color="#6d28d9" /> Contact Email ID
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div className="prefix-icon-block" style={{
                                        position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        background: '#f5f3ff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Mail size={15} color="#6d28d9" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={settings.email}
                                        onChange={handleChange}
                                        className="form-input settings-input"
                                        placeholder="school@example.com"
                                        required
                                        style={{ paddingLeft: '3.4rem', borderRadius: '10px', height: '46px', width: '100%' }}
                                    />
                                </div>
                            </div>

                            {/* Social URLs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="two-col-grid">
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }} className="field-label">
                                        <Instagram size={14} color="#6d28d9" /> Instagram URL
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div className="prefix-icon-block" style={{
                                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            background: '#fdf2f8',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Instagram size={15} color="#c026d3" />
                                        </div>
                                        <input
                                            type="url"
                                            name="instagramUrl"
                                            value={settings.instagramUrl}
                                            onChange={handleChange}
                                            className="form-input settings-input"
                                            placeholder="https://instagram.com/your-school"
                                            style={{ paddingLeft: '3.4rem', borderRadius: '10px', height: '46px', width: '100%' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }} className="field-label">
                                        <Facebook size={14} color="#6d28d9" /> Facebook URL
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div className="prefix-icon-block" style={{
                                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            background: '#eff6ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Facebook size={15} color="#1d4ed8" />
                                        </div>
                                        <input
                                            type="url"
                                            name="facebookUrl"
                                            value={settings.facebookUrl}
                                            onChange={handleChange}
                                            className="form-input settings-input"
                                            placeholder="https://facebook.com/your-school"
                                            style={{ paddingLeft: '3.4rem', borderRadius: '10px', height: '46px', width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Admission Cloud Text */}
                            <div style={{ padding: '1.2rem', border: '1px solid #fee2e2', borderRadius: '12px', background: '#fff5f5' }} className="admission-cloud-section">
                                <label style={{ display: 'block', marginBottom: '0.7rem', fontWeight: '700', color: '#b91c1c', fontSize: '0.9rem' }}>
                                    Admission Cloud Text
                                </label>
                                <input
                                    type="text"
                                    name="admissionCloudText"
                                    value={settings.admissionCloudText}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter text for the floating admission cloud"
                                    style={{ borderRadius: '10px', border: '1px solid #fecaca', width: '100%' }}
                                />
                            </div>

                            {/* Show Fee Structure Toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-light)', transition: 'all 0.3s ease' }} className="toggle-row">
                                <input
                                    type="checkbox"
                                    id="showFeeStructure"
                                    checked={settings.showFeeStructureInNavbar}
                                    onChange={(e) => setSettings({ ...settings, showFeeStructureInNavbar: e.target.checked })}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6d28d9' }}
                                />
                                <label htmlFor="showFeeStructure" style={{ fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }} className="field-label">
                                    Show "Fee Structure" in Public Navbar
                                </label>
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                className="btn save-settings-btn"
                                disabled={saving}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.6rem',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    opacity: saving ? 0.7 : 1,
                                    width: '100%',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                /* === LIGHT THEME SCOPED OVERRIDES === */
                body:not(.dark) .settings-panel {
                    background-color: #fcfbf7 !important;
                }

                body:not(.dark) .settings-title {
                    color: #1e1b4b !important;
                }

                body:not(.dark) .settings-form-card {
                    background: #ffffff !important;
                    border: 1px solid #f3f4f6 !important;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02) !important;
                }

                body:not(.dark) .field-label {
                    color: #374151 !important;
                }

                body:not(.dark) .settings-input,
                body:not(.dark) .settings-textarea {
                    background: #ffffff !important;
                    border: 1.5px solid #e5e7eb !important;
                    color: #1f2937 !important;
                }

                body:not(.dark) .settings-input:focus,
                body:not(.dark) .settings-textarea:focus {
                    border-color: #6d28d9 !important;
                    box-shadow: 0 0 0 4px rgba(109, 40, 217, 0.08) !important;
                }

                body:not(.dark) .save-settings-btn {
                    background: linear-gradient(to right, #4f46e5, #db2777) !important;
                    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.2) !important;
                }
                body:not(.dark) .save-settings-btn:not(:disabled):hover {
                    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3) !important;
                    transform: translateY(-1px);
                }

                body:not(.dark) .toggle-row {
                    background: #f9fafb !important;
                    border-color: #e5e7eb !important;
                }

                /* === DARK MODE PRESERVED EXACTLY === */
                body.dark .settings-form-card {
                    background: var(--card-bg) !important;
                    border-color: var(--border-color) !important;
                }
                body.dark .settings-input,
                body.dark .settings-textarea {
                    background: var(--card-bg) !important;
                    border-color: var(--border-color) !important;
                    color: var(--text-primary) !important;
                }
                body.dark .prefix-icon-block {
                    background: rgba(109, 40, 217, 0.15) !important;
                }
                body.dark .settings-title {
                    color: var(--primary) !important;
                }
                body.dark .save-settings-btn {
                    background: linear-gradient(to right, var(--primary), var(--secondary)) !important;
                }
                body.dark .admission-cloud-section {
                    background: rgba(185, 28, 28, 0.08) !important;
                    border-color: rgba(185, 28, 28, 0.2) !important;
                }

                @media (max-width: 768px) {
                    .two-col-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default PrincipalSettings;
