import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                        <div className="school-badge">🏫 KDKL</div>
                        <h1 className="quote-heading">अपनी सर्वोच्च<br/>क्षमता की खोज करें</h1>
                        <blockquote className="gita-quote">
                            <span className="shlok">
                                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br/>
                                मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
                            </span>
                            <br/><br/>
                            <span className="translation">
                                "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं।"
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
                        <div className="login-icon-wrapper">
                            <span style={{ fontSize: '2rem' }}>🔐</span>
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
                                <span className="input-icon">👤</span>
                                <input 
                                    type="text" 
                                    placeholder="Username" 
                                    className="login-input" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <span className="input-icon">🔑</span>
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    className="login-input" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="login-btn">
                                Enter Dashboard →
                            </button>
                        </form>

                        <p className="login-hint">Contact Admin for access credentials if not provided.</p>
                    </motion.div>
                </motion.div>
            </div>

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
                    margin-top: 65px;
                    position: relative;
                    z-index: 1;
                }

                /* === CARD === */
                .split-layout {
                    display: grid;
                    grid-template-columns: 1.2fr auto 1fr;
                    gap: 0;
                    max-width: 740px;
                    width: 100%;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(28px);
                    -webkit-backdrop-filter: blur(28px);
                    padding: 1rem 1.8rem;
                    border-radius: 20px;
                    box-shadow: 0 20px 50px rgba(26, 42, 108, 0.08), 0 0 0 1px rgba(255,255,255,0.8);
                }

                /* === LEFT QUOTE SECTION === */
                .quote-section { padding: 0.5rem 1rem 0.5rem 0; }

                .school-badge {
                    display: inline-block;
                    background: linear-gradient(135deg, #1a2a6c, #2563eb);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.8px;
                    margin-bottom: 0.8rem;
                }

                .quote-heading {
                    color: #b21f1f;
                    font-size: 1.45rem;
                    font-weight: 800;
                    line-height: 1.2;
                    letter-spacing: -0.4px;
                    margin-bottom: 0.8rem;
                }

                .gita-quote {
                    border-left: 3px solid #b21f1f;
                    padding-left: 1rem;
                    margin: 0;
                    color: #1a2a6c;
                    font-style: italic;
                    line-height: 1.6;
                }

                .shlok {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #1a2a6c;
                }

                .translation {
                    font-size: 0.88rem;
                    color: #475569;
                }

                .gita-source {
                    text-align: right;
                    font-weight: 600;
                    color: #94a3b8;
                    margin-top: 0.6rem;
                    font-size: 0.82rem;
                }

                /* === DIVIDER === */
                .login-divider {
                    width: 1px;
                    align-self: stretch;
                    background: linear-gradient(to bottom, transparent, rgba(26,42,108,0.15), transparent);
                    margin: 0 1.2rem;
                }

                /* === RIGHT LOGIN SECTION === */
                .login-form-section { padding: 0.5rem 0 0.5rem 1rem; }

                .login-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #1a2a6c, #2563eb);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.8rem;
                    box-shadow: 0 6px 15px rgba(26,42,108,0.2);
                }

                .login-title {
                    text-align: center;
                    color: #1a2a6c;
                    font-size: 1.4rem;
                    font-weight: 800;
                    margin-bottom: 0.2rem;
                }

                .login-subtitle {
                    text-align: center;
                    color: #94a3b8;
                    font-size: 0.82rem;
                    margin-bottom: 1.2rem;
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

                .login-form { display: flex; flex-direction: column; gap: 0.8rem; }

                .input-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    left: 12px;
                    font-size: 0.9rem;
                    z-index: 1;
                    pointer-events: none;
                }

                .login-input {
                    width: 100%;
                    padding: 0.7rem 0.7rem 0.7rem 2.4rem;
                    border-radius: 10px;
                    border: 1.5px solid #cbd5e1;
                    font-size: 0.9rem;
                    background-color: rgba(255,255,255,0.85);
                    color: #0f172a;
                    transition: all 0.3s ease;
                    font-family: 'Inter', sans-serif;
                }

                .login-input:focus {
                    outline: none;
                    border-color: #1a2a6c;
                    background-color: #ffffff;
                    box-shadow: 0 0 0 3px rgba(26,42,108,0.08);
                }

                .login-btn {
                    margin-top: 0.2rem;
                    padding: 0.75rem;
                    border-radius: 10px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #1a2a6c, #2563eb);
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    letter-spacing: 0.3px;
                }

                .login-btn:hover {
                    box-shadow: 0 6px 20px rgba(26,42,108,0.25);
                    transform: translateY(-1.5px);
                }

                .login-hint {
                    text-align: center;
                    margin-top: 1rem;
                    font-size: 0.78rem;
                    color: #94a3b8;
                }

                /* === RESPONSIVE === */
                @media (max-width: 768px) {
                    .login-page-wrapper { height: auto; min-height: 100vh; overflow-y: auto; }
                    .login-content-wrapper { padding: 2rem 5% 4rem; margin-top: 0; }
                    .split-layout { grid-template-columns: 1fr; padding: 2rem; gap: 0; }
                    .login-divider { width: 100%; height: 1px; margin: 1.5rem 0; background: linear-gradient(to right, transparent, rgba(26,42,108,0.15), transparent); }
                    .quote-section { padding: 0; }
                    .login-form-section { padding: 0; }
                    .quote-heading { font-size: 1.8rem; }
                }

                /* === DARK MODE OVERRIDES === */
                body.dark .login-page-wrapper {
                    background: linear-gradient(-45deg, #0b1329, #0f172a, #020617, #0b1329);
                }
                body.dark .split-layout {
                    background: rgba(30, 41, 59, 0.7);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
                }
                body.dark .quote-heading {
                    color: var(--secondary);
                }
                body.dark .gita-quote {
                    color: var(--text-primary);
                    border-left-color: var(--secondary);
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
                @media (max-width: 768px) {
                    body.dark .login-divider {
                        background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
