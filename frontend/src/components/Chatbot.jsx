import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Chatbot = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    
    // Auto-hide chatbot on admin/portal dashboard routes
    const isDashboardPath = location.pathname.startsWith('/principal') || 
                            location.pathname.startsWith('/teacher') || 
                            location.pathname.startsWith('/student') || 
                            location.pathname.startsWith('/settings') ||
                            location.pathname === '/login' ||
                            location.pathname === '/principal-dashboard' ||
                            location.pathname === '/teacher-dashboard' ||
                            location.pathname === '/student-dashboard';

    if (isDashboardPath) return null;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Namaste! 🙏 Welcome to KDKL Shastri Inter College & Kavita Public School support. How can I help you regarding admissions, fee structures, timings, or location today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMsg = { role: 'user', content: message };
        setMessages(prev => [...prev, userMsg]);
        const currentMsg = message;
        setMessage('');
        setLoading(true);

        try {
            // Gather history in structured form: [{ role: 'user'|'model', content: '...' }]
            const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
            
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${apiUrl}/api/public/chat`, {
                message: currentMsg,
                history: chatHistory
            });

            setMessages(prev => [...prev, { role: 'model', content: data.response }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { 
                role: 'model', 
                content: 'Sorry, I am facing a connection issue right now. Please try again in a few moments, or check if the backend server is running.' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
            {/* Expandable Chat Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        className="chatbot-window glass-card"
                        style={{
                            width: '390px',
                            height: '380px',
                            maxHeight: 'calc(100vh - 150px)',
                            backgroundColor: 'var(--glass)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            marginBottom: '15px',
                            transition: 'background-color 0.3s ease, border-color 0.3s ease'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.1rem 1.4rem',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ 
                                    background: 'rgba(255,255,255,0.2)', 
                                    padding: '6px', 
                                    borderRadius: '50%', 
                                    display: 'flex',
                                    animation: 'pulseGlow 2s infinite alternate' 
                                }}>
                                    <Sparkles size={16} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: '700', letterSpacing: '0.3px' }}>KDKL Support Bot</h3>
                                        <span style={{ 
                                            width: '8px', 
                                            height: '8px', 
                                            borderRadius: '50%', 
                                            backgroundColor: '#22c55e', 
                                            display: 'inline-block',
                                            boxShadow: '0 0 8px #22c55e'
                                        }}></span>
                                    </div>
                                    <p style={{ fontSize: '0.65rem', margin: 0, opacity: 0.85, fontWeight: '500' }}>Admissions Assistant</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                style={{ 
                                    background: 'rgba(255,255,255,0.15)', 
                                    border: 'none', 
                                    color: 'white', 
                                    cursor: 'pointer', 
                                    padding: '6px', 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages Stream */}
                        <div className="chatbot-messages" style={{
                            flex: 1,
                            padding: '1.2rem',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.9rem',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                        }}>
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%',
                                        padding: '0.7rem 0.95rem',
                                        borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                        fontSize: '0.85rem',
                                        lineHeight: '1.45',
                                        background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'var(--card-bg)',
                                        color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                        border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                                        boxShadow: msg.role === 'user' ? '0 4px 12px rgba(26,42,108,0.15)' : '0 2px 8px rgba(0,0,0,0.02)',
                                        whiteSpace: 'pre-wrap',
                                        animation: 'messagePop 0.3s ease-out forwards',
                                        transformOrigin: msg.role === 'user' ? 'bottom right' : 'bottom left'
                                    }}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {loading && (
                                <div style={{
                                    alignSelf: 'flex-start',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '18px',
                                    backgroundColor: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    gap: '4px',
                                    alignItems: 'center'
                                }}>
                                    <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'typing 1s infinite alternate' }}></div>
                                    <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'typing 1s infinite alternate', animationDelay: '0.2s' }}></div>
                                    <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'typing 1s infinite alternate', animationDelay: '0.4s' }}></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Footer Form */}
                        <form onSubmit={handleSend} style={{
                            padding: '0.8rem 1.1rem',
                            backgroundColor: 'var(--card-bg)',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            gap: '0.6rem',
                            alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem 1rem',
                                    border: '1.5px solid var(--border-color)',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    outline: 'none',
                                    backgroundColor: 'var(--bg-light)',
                                    color: 'var(--text-primary)',
                                    transition: 'all 0.2s ease',
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || loading}
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                    color: 'white',
                                    border: 'none',
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    opacity: (!message.trim() || loading) ? 0.6 : 1,
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 10px rgba(26, 42, 108, 0.2)'
                                }}
                            >
                                <Send size={14} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    color: 'white',
                    border: 'none',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(26, 42, 108, 0.25)',
                    cursor: 'pointer',
                    outline: 'none',
                    marginLeft: 'auto',
                    transition: 'box-shadow 0.3s ease'
                }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Custom Animations and Scrollbar styles */}
            <style>{`
                @keyframes typing {
                    from { transform: translateY(0); opacity: 0.5; }
                    to { transform: translateY(-5px); opacity: 1; }
                }
                @keyframes messagePop {
                    from { opacity: 0; transform: scale(0.95) translateY(5px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes pulseGlow {
                    from { transform: scale(1); }
                    to { transform: scale(1.05); }
                }
                .chatbot-messages::-webkit-scrollbar {
                    width: 5px;
                }
                .chatbot-messages::-webkit-scrollbar-track {
                    background: transparent;
                }
                .chatbot-messages::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
                .chatbot-messages::-webkit-scrollbar-thumb:hover {
                    background: var(--text-secondary);
                }
                @media (max-width: 480px) {
                    .chatbot-window {
                        width: calc(100vw - 40px) !important;
                        height: 350px !important;
                        maxHeight: calc(100vh - 140px) !important;
                        right: 20px !important;
                        bottom: 80px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
