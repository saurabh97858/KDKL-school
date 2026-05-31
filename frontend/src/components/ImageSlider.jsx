import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageSlider = () => {
    const [images, setImages] = useState([
        'https://images.unsplash.com/photo-1523050853051-f750c7582efd?auto=format&fit=crop&w=1200',
        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200'
    ]);

    const getPicUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
    };

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/gallery');
                const sliderItems = data.filter(item => !item.category || item.category.toLowerCase() === 'slider');
                
                if (sliderItems.length > 0) {
                    setImages(sliderItems.map(img => getPicUrl(img.imageUrl)));
                }
            } catch (error) {
                console.error('Error fetching slider:', error);
            }
        };
        fetchGallery();
    }, []);

    const trackWidth = images.length * 200; // Double the count for seamless loop

    return (
        <div className="slider-container" style={{ height: '400px', background: '#000', overflow: 'hidden', position: 'relative' }}>
            <div className="slider-track" style={{ 
                display: 'flex', 
                width: `${trackWidth}%`, 
                height: '100%', 
                animation: `scroll ${images.length * 10}s linear infinite` 
            }}>
                {/* Original set */}
                {images.map((img, idx) => (
                    <div 
                        key={`orig-${idx}`} 
                        style={{ 
                            flex: `0 0 ${100 / (images.length * 2)}%`, 
                            backgroundImage: `url('${img}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '100%'
                        }}
                    >
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }}></div>
                    </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {images.map((img, idx) => (
                    <div 
                        key={`dup-${idx}`} 
                        style={{ 
                            flex: `0 0 ${100 / (images.length * 2)}%`, 
                            backgroundImage: `url('${img}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '100%'
                        }}
                    >
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }}></div>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default ImageSlider;
