import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2a6c 100%)', color: 'white', padding: '4rem 10% 2rem', margin: '0', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem', textAlign: 'left' }}>
                <div>
                    <h2 style={{ fontSize: '1.6rem', letterSpacing: '1px', marginBottom: '1.5rem', color: '#fdbb2d' }}>KDKL SHASTRI</h2>
                    <p style={{ opacity: 0.8, lineHeight: '1.8' }}>Established with a vision to provide world-class education with strong moral values. We nurture the leaders of tomorrow.</p>
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '2px solid #b21f1f', paddingBottom: '0.5rem', display: 'inline-block' }}>Admission</h3>
                    <ul className="footer-links" style={{ listStyle: 'none', padding: 0, opacity: 0.8 }}>
                        <li style={{ marginBottom: '0.8rem' }}>• <Link to="/admission" style={{ color: 'white', textDecoration: 'none' }}>Admission Procedure</Link></li>
                        <li style={{ marginBottom: '0.8rem' }}>• <Link to="/fee-structure" style={{ color: 'white', textDecoration: 'none' }}>Fee Structure</Link></li>
                        <li style={{ marginBottom: '0.8rem' }}>• Transfer Certificate</li>
                        <li style={{ marginBottom: '0.8rem' }}>• Scholarship Info</li>
                    </ul>
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '2px solid #138808', paddingBottom: '0.5rem', display: 'inline-block' }}>Education</h3>
                    <ul className="footer-links" style={{ listStyle: 'none', padding: 0, opacity: 0.8 }}>
                        <li style={{ marginBottom: '0.8rem' }}>• Primary Schooling (KPS)</li>
                        <li style={{ marginBottom: '0.8rem' }}>• Inter College (UP Board)</li>
                        <li style={{ marginBottom: '0.8rem' }}>• Science & Commerce Labs</li>
                        <li style={{ marginBottom: '0.8rem' }}>• Digital Classrooms</li>
                    </ul>
                </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                <p>&copy; 2026 KDKL School Management System. All Rights Reserved. | <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Staff Login</Link></p>
            </div>
        </footer>
    );
};

export default Footer;
