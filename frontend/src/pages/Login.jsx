import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(username, password);
            if (user.role === 'principal') navigate('/principal-dashboard');
            else if (user.role === 'teacher') navigate('/teacher-dashboard');
            else if (user.role === 'student') navigate('/student-dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-page-wrapper">
            {/* Decorative Orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>

            <Navbar />

            <div className="login-content-wrapper">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="split-layout"
                >
                    {/* Left Motivational Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="quote-section"
                    >
                        <div className="school-badge">★ KDKL</div>
                        <h1 className="quote-heading">अपनी सर्वोच्च<br/>क्षमता की खोज करें</h1>
                        <blockquote className="gita-quote">
                            <span className="shlok">
                                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br/>
                                मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
                            </span>
                            <br/><br/>
                            <span className="translation">
                                "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं!"
                            </span>
                        </blockquote>
                        <p className="gita-source">— श्रीमद्भगवद्गीता, अध्याय २, श्लोक ४७</p>
                    </motion.div>

                    {/* Divider */}
                    <div className="login-divider"></div>

                    {/* Right Login Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="login-form-section"
                    >
                        {/* Circle Blue Lock Badge overlapping soft translucent rings */}
                        <div className="lock-icon-outer-ring">
                            <div className="lock-icon-inner-ring">
                                <div className="login-icon-wrapper">
                                    <span style={{ fontSize: '1.4rem' }}>🔒</span>
                                </div>
                            </div>
                        </div>
                        
                        <h2 className="login-title">Secure Login</h2>
                        <p className="login-subtitle">Welcome back, please sign in</p>

                        {error && (
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="login-error"
                            >
                                ⚠️ {error}
                            </motion.p>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <span className="input-icon" style={{ color: '#2563eb' }}>👤</span>
                                <input 
                                    type="text" 
                                    placeholder="Username" 
                                    className="login-input" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="input-group" style={{ position: 'relative' }}>
                                <span className="input-icon" style={{ color: '#d97706' }}>🔑</span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Password" 
                                    className="login-input" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        color: '#64748b',
                                        zIndex: 10,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        outline: 'none',
                                        padding: 0
                                    }}
                                >
                                    👁️
                                </button>
                            </div>
                            <button type="submit" className="login-btn">
                                Enter Dashboard →
                            </button>
                        </form>

                        <p className="login-hint">Contact Admin for access credentials if not provided.</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Dark Blue Footer Bar */}
            <footer className="login-footer-bar">
                <p>© 2026 KDKL SHASTRI INTER COLLEGE & KPS. All rights reserved.</p>
            </footer>

            <style>{`
                /* === PAGE WRAPPER === */
                .login-page-wrapper {
                    height: 100vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    background: linear-gradient(-45deg, #fffde7, #fef9c3, #fde68a, #fef3c7, #fffde7);
                    background-size: 400% 400%;
                    animation: gradientBG 12s ease infinite;
                    position: relative;
                }

                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                /* === FLOATING ORBS === */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.35;
                    animation: floatOrb 8s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 0;
                }
                .orb-1 { width: 350px; height: 350px; background: #fbbf24; top: -80px; left: -80px; animation-duration: 9s; }
                .orb-2 { width: 250px; height: 250px; background: #f97316; bottom: -60px; right: -60px; animation-duration: 11s; animation-delay: -3s; }
                .orb-3 { width: 200px; height: 200px; background: #a78bfa; top: 50%; right: 10%; animation-duration: 13s; animation-delay: -6s; }
                .orb-4 { width: 180px; height: 180px; background: #34d399; bottom: 10%; left: 15%; animation-duration: 10s; animation-delay: -2s; }

                @keyframes floatOrb {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }

                /* === CONTENT WRAPPER === */
                .login-content-wrapper {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 5%;
                    margin-top: 20px;
                    position: relative;
                    z-index: 1;
                }

                /* === CARD === */
                .split-layout {
                    display: grid;
                    grid-template-columns: 1.15fr auto 1fr;
                    gap: 0;
                    max-width: 820px;
                    width: 100%;
                    align-items: center;
                    background: #ffffff;
                    padding: 3rem 2.8rem;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
                    border: 1px solid rgba(243, 244, 246, 0.8);
                }

                /* === LEFT QUOTE SECTION === */
                .quote-section { padding: 0.5rem 2rem 0.5rem 0; }

                .school-badge {
                    display: inline-block;
                    background: #0f172a;
                    color: white;
                    padding: 0.35rem 1rem;
                    border-radius: 50px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    margin-bottom: 1.2rem;
                }

                .quote-heading {
                    color: #7c1a22;
                    font-size: 1.85rem;
                    font-weight: 800;
                    line-height: 1.3;
                    letter-spacing: -0.4px;
                    margin-bottom: 1.2rem;
                }

                .gita-quote {
                    border-left: 3px solid #7c1a22;
                    padding-left: 1.2rem;
                    margin: 0;
                    color: #7c1a22;
                    line-height: 1.8;
                }

                .shlok {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #1e3a8a;
                }

                .translation {
                    font-size: 0.88rem;
                    color: #475569;
                    font-style: italic;
                    display: block;
                    margin-top: 0.5rem;
                }

                .gita-source {
                    text-align: left;
                    font-weight: 600;
                    color: #94a3b8;
                    margin-top: 0.8rem;
                    margin-left: 1.5rem;
                    font-size: 0.82rem;
                }

                /* === DIVIDER === */
                .login-divider {
                    width: 1px;
                    align-self: stretch;
                    background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.06), transparent);
                    margin: 0 1.5rem;
                }

                /* === RIGHT LOGIN SECTION === */
                .login-form-section { padding: 0.5rem 0 0.5rem 2rem; text-align: center; }

                /* Premium overlapping ring icon styling */
                .lock-icon-outer-ring {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: rgba(139, 92, 246, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.2rem;
                }

                .lock-icon-inner-ring {
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    background: rgba(139, 92, 246, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .login-icon-wrapper {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #1d4ed8, #2563eb);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
                }

                .login-title {
                    text-align: center;
                    color: #0f172a;
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 0.2rem;
                }

                .login-subtitle {
                    text-align: center;
                    color: #6b7280;
                    font-size: 0.85rem;
                    margin-bottom: 1.5rem;
                }

                .login-error {
                    background: #fee2e2;
                    color: #991b1b;
                    padding: 0.5rem 0.8rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    margin-bottom: 0.8rem;
                    text-align: center;
                }

                .login-form { display: flex; flex-direction: column; gap: 1rem; }

                .input-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    font-size: 1rem;
                    z-index: 1;
                    pointer-events: none;
                }

                .login-input {
                    width: 100%;
                    padding: 0.8rem 1rem 0.8rem 2.8rem;
                    border-radius: 12px;
                    border: 1.5px solid #e5e7eb;
                    font-size: 0.92rem;
                    background-color: #ffffff;
                    color: #1f2937;
                    transition: all 0.3s ease;
                    font-family: 'Inter', sans-serif;
                }

                .login-input:focus {
                    outline: none;
                    border-color: #2563eb;
                    background-color: #ffffff;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
                }

                .login-btn {
                    margin-top: 0.5rem;
                    padding: 0.85rem;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #1d4ed8, #2563eb);
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    letter-spacing: 0.3px;
                }

                .login-btn:hover {
                    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
                    transform: translateY(-1.5px);
                }

                .login-hint {
                    text-align: center;
                    margin-top: 1.2rem;
                    font-size: 0.78rem;
                    color: #9ca3af;
                }

                /* === FOOTER BAR === */
                .login-footer-bar {
                    background: #0f172a;
                    padding: 1.2rem 2rem;
                    text-align: center;
                    color: #ffffff;
                    font-size: 0.85rem;
                    margin-top: auto;
                    font-weight: 500;
                    z-index: 1;
                }
                .login-footer-bar p {
                    margin: 0;
                }

                /* === RESPONSIVE === */
                @media (max-width: 820px) {
                    .login-page-wrapper { height: auto; min-height: 100vh; overflow-y: auto; }
                    .login-content-wrapper { padding: 2rem 5% 4rem; margin-top: 0; }
                    .split-layout { grid-template-columns: 1fr; padding: 2rem; gap: 0; }
                    .login-divider { width: 100%; height: 1px; margin: 1.8rem 0; background: linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent); }
                    .quote-section { padding: 0; text-align: center; }
                    .gita-quote { border-left: none; border-top: 2px solid #7c1a22; padding-left: 0; padding-top: 1rem; }
                    .gita-source { text-align: center; margin-left: 0; }
                    .login-form-section { padding: 0; }
                    .quote-heading { font-size: 1.8rem; }
                }

                /* === LIGHT THEME OVERRIDES SCOPED ONLY IN LIGHT MODE === */
                body:not(.dark) .login-page-wrapper {
                    background: #fdfbf7 !important;
                    background-image: 
                        radial-gradient(circle at 10% 20%, rgba(251, 191, 36, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 90% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
                        radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.1) 0%, transparent 40%),
                        radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 45%) !important;
                    animation: none !important;
                }
                
                /* Scoped Premium Navbar Overrides to match Screenshot 1 */
                body:not(.dark) .login-page-wrapper .premium-navbar {
                    background: #ffffff !important;
                    border-top: none !important;
                    border-bottom: 2px solid #138808 !important; /* Thin green border */
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03) !important;
                    padding: 0.8rem 5% !important;
                }
                body:not(.dark) .login-page-wrapper .nav-links li a {
                    color: #1f2937 !important;
                    font-family: 'Outfit', sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 0.95rem !important;
                }
                body:not(.dark) .login-page-wrapper .login-btn-premium {
                    background: #7c1a22 !important; /* Maroon button */
                    color: #ffffff !important;
                    border-radius: 8px !important;
                    padding: 0.55rem 1.3rem !important;
                    font-size: 0.85rem !important;
                    font-weight: 700 !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                    box-shadow: 0 4px 10px rgba(124, 26, 34, 0.15) !important;
                }
                body:not(.dark) .login-page-wrapper .login-btn-premium::before {
                    content: "👤";
                    font-size: 0.85rem;
                }
                body:not(.dark) .login-page-wrapper .nav-theme-toggle {
                    background: #ffffff !important;
                    border: 1px solid #cbd5e1 !important;
                    color: #1e293b !important;
                }

                /* === DARK MODE PRESERVED EXACTLY === */
                body.dark .login-page-wrapper {
                    background: linear-gradient(-45deg, #0b1329, #0f172a, #020617, #0b1329);
                }
                body.dark .split-layout {
                    background: rgba(30, 41, 59, 0.7);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.08);
                }
                body.dark .quote-heading {
                    color: var(--secondary);
                }
                body.dark .school-badge {
                    background: var(--primary);
                }
                body.dark .gita-quote {
                    color: var(--text-primary);
                    border-left-color: var(--secondary);
                }
                body.dark .shlok {
                    color: var(--text-primary);
                }
                body.dark .translation {
                    color: var(--text-secondary);
                }
                body.dark .login-title {
                    color: var(--primary);
                }
                body.dark .login-input {
                    background-color: rgba(15, 23, 42, 0.6);
                    border-color: var(--border-color);
                    color: var(--text-primary);
                }
                body.dark .login-input:focus {
                    border-color: var(--primary);
                    background-color: rgba(15, 23, 42, 0.85);
                }
                body.dark .login-hint {
                    color: var(--text-secondary);
                }
                body.dark .login-divider {
                    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
                }
                @media (max-width: 820px) {
                    body.dark .login-divider {
                        background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
                    }
                    body.dark .gita-quote {
                        border-top-color: var(--secondary);
                    }
                }
                body.dark .login-footer-bar {
                    background: #020617;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    );
};

export default Login;
