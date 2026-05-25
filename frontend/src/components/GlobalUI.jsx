import React, { useState, useEffect } from 'react';

// ===== LOADING SPINNER =====
export const Spinner = ({ text = 'Loading...' }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        minHeight: '60vh', gap: '1.5rem'
    }}>
        <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            border: '5px solid #e2e8f0',
            borderTop: '5px solid #1a2a6c',
            animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#64748b', fontWeight: '600', fontSize: '1rem', letterSpacing: '0.5px' }}>{text}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

// ===== SCROLL TO TOP =====
export const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
                position: 'fixed', bottom: '90px', right: '24px',
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a2a6c, #2563eb)',
                color: 'white', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(26,42,108,0.3)',
                transition: 'all 0.3s ease',
                fontSize: '1.2rem', zIndex: 999
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-3px) scale(1.1)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            title="Scroll to top"
        >
            ↑
        </button>
    );
};

// ===== WHATSAPP FLOATING BUTTON =====
export const WhatsAppButton = ({ phone = '919999999999', message = 'Hello! I am interested in KDKL School.' }) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed', bottom: '24px', right: '24px',
                width: '56px', height: '56px', borderRadius: '50%',
                background: '#25D366',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
                zIndex: 999, textDecoration: 'none',
                animation: 'waPulse 2s ease infinite'
            }}
            title="Chat on WhatsApp"
        >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <style>{`
                @keyframes waPulse {
                    0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
                    50% { box-shadow: 0 4px 30px rgba(37,211,102,0.7), 0 0 0 8px rgba(37,211,102,0.1); }
                }
            `}</style>
        </a>
    );
};

// ===== IMAGE LIGHTBOX =====
export const Lightbox = ({ images, startIndex, onClose }) => {
    const [current, setCurrent] = useState(startIndex);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % images.length);
            if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + images.length) % images.length);
        };
        window.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [images.length, onClose]);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, flexDirection: 'column', gap: '1rem'
            }}
        >
            {/* Close */}
            <button onClick={onClose} style={{
                position: 'absolute', top: '16px', right: '20px',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: 'white', fontSize: '1.5rem', width: '40px', height: '40px',
                borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)'
            }}>✕</button>

            {/* Counter */}
            <p style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                {current + 1} / {images.length}
            </p>

            {/* Prev */}
            {images.length > 1 && (
                <button onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); }} style={{
                    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                    fontSize: '1.5rem', width: '48px', height: '48px', borderRadius: '50%',
                    cursor: 'pointer', backdropFilter: 'blur(4px)'
                }}>‹</button>
            )}

            {/* Image */}
            <img
                onClick={e => e.stopPropagation()}
                src={images[current]}
                alt={`img-${current}`}
                style={{
                    maxWidth: '90vw', maxHeight: '80vh',
                    objectFit: 'contain', borderRadius: '12px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
                }}
            />

            {/* Next */}
            {images.length > 1 && (
                <button onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); }} style={{
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                    fontSize: '1.5rem', width: '48px', height: '48px', borderRadius: '50%',
                    cursor: 'pointer', backdropFilter: 'blur(4px)'
                }}>›</button>
            )}
        </div>
    );
};
