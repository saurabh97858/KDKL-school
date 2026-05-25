import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Trophy, Users, BookOpen, CheckCircle2 } from 'lucide-react';

const Admission = () => {
    const [formData, setFormData] = useState({
        studentName: '', mobileNumber: '', className: '', emailId: '', motherName: '', 
        fatherName: '', contactNumber: '', permanentAddress: '', currentAddress: '', previousSchool: '',
        medium: 'Hindi', stream: 'None'
    });
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/apply', formData);
            setStatus('Application submitted successfully! Our admissions team will contact you shortly.');
            setFormData({
                studentName: '', mobileNumber: '', className: '', emailId: '', motherName: '', 
                fatherName: '', contactNumber: '', permanentAddress: '', currentAddress: '', previousSchool: '',
                medium: 'Hindi', stream: 'None'
            });
        } catch (error) {
            setStatus('Error submitting application. Please try again.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatus(''), 8000); // clear status after 8s
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="premium-light-page">
            <Navbar />
            
            {/* Aesthetic Background Blobs */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <div className="admission-wrapper">
                {/* Left Side: Legacy & Values */}
                <motion.div 
                    className="admission-info-side"
                    initial="hidden" animate="visible" variants={staggerContainer}
                >
                    <motion.h4 variants={fadeInUp} className="section-kicker">Admission Portal</motion.h4>
                    <motion.h1 variants={fadeInUp} className="main-title text-navy">Join The Legacy of <br/><span className="text-crimson">Excellence</span></motion.h1>
                    <motion.div variants={fadeInUp} className="divider-line bg-crimson"></motion.div>
                    
                    <motion.p variants={fadeInUp} className="info-description text-slate">
                        At KDKL Shastri Inter College, we look beyond academic potential. We seek students who are curious, ambitious, and driven to make a positive impact in the world. Secure your child's future today.
                    </motion.p>
                    
                    <motion.div variants={fadeInUp} className="value-props">
                        <div className="value-prop-item">
                            <div className="value-icon"><Trophy size={20} color="#b21f1f"/></div>
                            <div className="value-text">
                                <h3 className="text-navy">Outstanding Academics</h3>
                                <p className="text-gray">Consistently achieving top-tier board results for decades.</p>
                            </div>
                        </div>
                        <div className="value-prop-item">
                            <div className="value-icon"><Users size={20} color="#b21f1f"/></div>
                            <div className="value-text">
                                <h3 className="text-navy">Holistic Development</h3>
                                <p className="text-gray">Focus on character, sports, and leadership skills.</p>
                            </div>
                        </div>
                        <div className="value-prop-item">
                            <div className="value-icon"><BookOpen size={20} color="#b21f1f"/></div>
                            <div className="value-text">
                                <h3 className="text-navy">Modern Facilities</h3>
                                <p className="text-gray">State-of-the-art labs, libraries, and smart classrooms.</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side: Glassmorphic Application Form */}
                <motion.div 
                    className="admission-form-side"
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="light-glass-heavy form-container">
                        <div className="form-header">
                            <div className="form-header-icon"><GraduationCap size={28} color="#1a2a6c"/></div>
                            <h2 className="text-navy">Online Application</h2>
                            <p className="text-gray">Fill out the form below to begin the enrollment process.</p>
                        </div>

                        <AnimatePresence>
                            {status && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`status-message ${status.includes('Error') ? 'error-status' : 'success-status'}`}
                                >
                                    {!status.includes('Error') && <CheckCircle2 size={18} className="status-icon" />}
                                    {status}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="input-group">
                                <label>Student Full Name *</label>
                                <input type="text" name="studentName" required onChange={handleChange} value={formData.studentName} className="glass-input light" />
                            </div>
                            
                            <div className="form-row">
                                <div className="input-group">
                                    <label>WhatsApp Number *</label>
                                    <input type="text" name="mobileNumber" required onChange={handleChange} value={formData.mobileNumber} className="glass-input light" />
                                </div>
                                <div className="input-group">
                                    <label>Class Applying For *</label>
                                    <input type="text" name="className" placeholder="e.g. 5th, 10th" required onChange={handleChange} value={formData.className} className="glass-input light" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Parent's Contact *</label>
                                    <input type="text" name="contactNumber" required onChange={handleChange} value={formData.contactNumber} className="glass-input light" />
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" name="emailId" onChange={handleChange} value={formData.emailId} className="glass-input light" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Medium *</label>
                                    <select name="medium" required onChange={handleChange} value={formData.medium} className="glass-input light">
                                        <option value="Hindi">Hindi Medium</option>
                                        <option value="English">English Medium</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Stream (For Class 11th/12th)</label>
                                    <select name="stream" onChange={handleChange} value={formData.stream} className="glass-input light">
                                        <option value="None">None</option>
                                        <option value="Science">Science</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Father's Name *</label>
                                    <input type="text" name="fatherName" required onChange={handleChange} value={formData.fatherName} className="glass-input light" />
                                </div>
                                <div className="input-group">
                                    <label>Mother's Name *</label>
                                    <input type="text" name="motherName" required onChange={handleChange} value={formData.motherName} className="glass-input light" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Previous School (If any)</label>
                                <input type="text" name="previousSchool" onChange={handleChange} value={formData.previousSchool} className="glass-input light" />
                            </div>
                            
                            <div className="input-group full-width">
                                <label>Current Address *</label>
                                <textarea name="currentAddress" rows="2" required onChange={handleChange} value={formData.currentAddress} className="glass-input light"></textarea>
                            </div>
                            <div className="input-group full-width">
                                <label>Permanent Address *</label>
                                <textarea name="permanentAddress" rows="2" required onChange={handleChange} value={formData.permanentAddress} className="glass-input light"></textarea>
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`submit-btn-premium nav-gradient ${isSubmitting ? 'submitting' : ''}`}>
                                {isSubmitting ? 'Submitting Application...' : 'Submit Admission Application'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            <Footer />

            <style>{`
                .premium-light-page {
                    background-color: #fdf6b2;
                    min-height: 100vh;
                    font-family: 'Inter', system-ui, sans-serif;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                /* Aesthetic Light Blobs */
                .bg-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    z-index: 0;
                    opacity: 0.35;
                    animation: floatLight 15s infinite ease-in-out alternate;
                }
                .blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(26,42,108,0.2) 0%, transparent 70%); top: -100px; left: -150px; }
                .blob-2 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(178,31,31,0.15) 0%, transparent 70%); bottom: -100px; right: -200px; animation-delay: -5s; }
                .blob-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%); top: 40%; left: 30%; animation-delay: -10s; }
                
                @keyframes floatLight {
                    0% { transform: translateY(0) scale(1) rotate(0deg); }
                    100% { transform: translateY(-30px) scale(1.05) rotate(5deg); }
                }

                /* Light Glassmorphism */
                .light-glass-heavy {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.9);
                    box-shadow: 0 25px 60px rgba(15, 23, 42, 0.08);
                    border-radius: 28px;
                }

                /* Typography */
                .text-navy { color: #1a2a6c; }
                .text-crimson { color: #b21f1f; }
                .text-slate { color: #475569; }
                .text-gray { color: #64748b; }
                
                /* Layout */
                .admission-wrapper {
                    flex: 1;
                    max-width: 1100px;
                    margin: 0 auto 1.5rem;
                    padding: 0.5rem 5%;
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 3rem;
                    align-items: flex-start;
                    position: relative;
                    z-index: 10;
                }
                
                /* Left Side - Info */
                .admission-info-side { padding-top: 1rem; }
                .section-kicker { margin: 0 0 0.5rem 0; color: #b21f1f; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; }
                .main-title { font-size: 2.8rem; font-weight: 800; line-height: 1.1; letter-spacing: -1px; margin: 0 0 1rem 0; }
                .divider-line { height: 4px; width: 60px; margin-bottom: 1.5rem; border-radius: 2px; background: #b21f1f; }
                .info-description { font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem; }
                
                .value-props { display: flex; flex-direction: column; gap: 1.5rem; }
                .value-prop-item { display: flex; gap: 1rem; align-items: flex-start; }
                .value-icon { background: #ffe4e6; padding: 0.8rem; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .value-text h3 { margin: 0 0 0.2rem 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }
                .value-text p { margin: 0; font-size: 0.9rem; line-height: 1.4; }

                /* Right Side - Form */
                .form-container { padding: 1.5rem 2rem; }
                .form-header { text-align: center; margin-bottom: 1rem; }
                .form-header-icon {
                    width: 50px; height: 50px; background: #e0e7ff; margin: 0 auto 0.8rem;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                }
                .form-header h2 { margin: 0 0 0.3rem 0; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; }
                .form-header p { margin: 0; font-size: 0.85rem; }

                .status-message {
                    padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: center;
                    font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                }
                .success-status { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
                .error-status { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

                /* Premium Input Styling */
                .premium-form { display: flex; flex-direction: column; gap: 0.8rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.3rem; }
                .full-width { grid-column: 1 / -1; }
                
                .input-group label { font-size: 0.75rem; font-weight: 600; color: #475569; padding-left: 0.2rem; }
                
                .glass-input.light {
                    padding: 0.6rem 1rem;
                    background: rgba(255, 255, 255, 0.6);
                    border: 1px solid rgba(203, 213, 225, 0.6);
                    border-radius: 8px;
                    font-size: 0.85rem;
                    color: #0f172a;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.3s ease;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);
                }
                .glass-input.light:focus {
                    outline: none;
                    background: #ffffff;
                    border-color: #1a2a6c;
                    box-shadow: 0 0 0 4px rgba(26, 42, 108, 0.15);
                }
                .glass-input.light::placeholder { color: #94a3b8; }
                textarea.glass-input { resize: vertical; min-height: 80px; }

                /* Action Button */
                .submit-btn-premium {
                    margin-top: 1rem;
                    background: linear-gradient(135deg, #1a2a6c 0%, #3b5998 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 20px rgba(26, 42, 108, 0.25);
                }
                .submit-btn-premium:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(26, 42, 108, 0.35);
                }
                .submit-btn-premium:disabled { opacity: 0.7; cursor: not-allowed; }

                /* Elegant Footer */
                .elegant-footer { background: linear-gradient(to right, #0f172a, #1a2a6c); color: white; padding: 5rem 10% 2rem; text-align: center; position: relative; z-index: 10; margin-top: auto;}
                .elegant-footer h2 { margin: 0 0 1rem 0; font-size: 2rem; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .elegant-footer p { opacity: 0.9; font-size: 1.1rem; max-width: 600px; margin: 0 auto 3rem; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
                .footer-bottom { border-top: 1px solid rgba(255,255,255,0.3); padding-top: 2rem; }
                .footer-bottom p { font-size: 0.9rem; margin: 0; opacity: 0.8; }

                /* Responsiveness */
                @media (max-width: 1024px) {
                    .admission-wrapper { grid-template-columns: 1fr; gap: 3rem; margin-top: 3rem; padding: 1rem 5%; }
                    .admission-info-side { padding-top: 0; max-width: 800px; margin: 0 auto; text-align: center; }
                    .divider-line { margin: 1.5rem auto 2rem; }
                    .value-props { text-align: left; }
                }
                @media (max-width: 768px) {
                    .form-row { grid-template-columns: 1fr; gap: 0.5rem; }
                    .form-container { padding: 1.2rem; }
                    .main-title { font-size: 2.22rem; }
                    .value-prop-item { flex-direction: column; align-items: center; text-align: center; }
                }
            `}</style>
        </div>
    );
};

export default Admission;
