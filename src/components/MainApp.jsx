// src/components/MainApp.jsx - UPDATED WITH LOTTIE SIZE CONTROL
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import lottie from 'lottie-web';
import './MainApp.css';

export default function MainApp({ user }) {
  const [backgroundStars, setBackgroundStars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const lottieContainer = useRef(null);
  const [animationSize, setAnimationSize] = useState(120); // Control size in px

  // Generate background stars
  useEffect(() => {
    const stars = Array.from({ length: 150 }, (_, i) => ({
      id: `star-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      twinkleSpeed: Math.random() * 20 + 10,
      blur: Math.random() * 3
    }));
    setBackgroundStars(stars);
    
    // Initial load complete
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Load Lottie animation with size control
  useEffect(() => {
    let anim;
    if (lottieContainer.current) {
      // Clear previous animation
      lottieContainer.current.innerHTML = '';
      
      anim = lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/lottie/X11-cosmic.json',
        // You can also scale the animation directly
      });
      
      // Apply scale transformation to the SVG
      if (anim && anim.renderer && anim.renderer.svgElement) {
        const svg = anim.renderer.svgElement;
        svg.style.transform = `scale(0.5)`; // Adjust this scale factor
        svg.style.transformOrigin = 'center center';
      }
    }

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, [animationSize]); // Re-run when size changes

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      await auth.signOut();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      alert(`Logout failed: ${error.message}`);
    }
  };

  const handleUpload = () => {
    document.getElementById('file-input').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('📁 File selected:', file.name);
      alert(`Ready to upload: ${file.name}`);
    }
  };

  // Size control buttons (optional - you can remove these)
  const decreaseSize = () => {
    if (animationSize > 50) {
      setAnimationSize(prev => prev - 20);
    }
  };

  const increaseSize = () => {
    if (animationSize < 300) {
      setAnimationSize(prev => prev + 20);
    }
  };

  return (
    <div className="main-app">
      {/* Cosmic Background */}
      <div className="cosmic-sky">
        {/* Background Stars */}
        <div className="background-stars">
          {backgroundStars.map(star => (
            <div
              key={star.id}
              className="background-star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                filter: `blur(${star.blur}px)`,
                animationDuration: `${star.twinkleSpeed}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Central Lottie Animation - WITH SIZE CONTROL */}
        <div className="central-animation" style={{ width: `${animationSize}px`, height: `${animationSize}px` }}>
          <div 
            ref={lottieContainer} 
            className="lottie-center"
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Orbital Rings - Adjusted based on animation size */}
          <div className="orbital-ring ring-1" style={{ 
            width: `${animationSize * 1.5}px`,
            height: `${animationSize * 1.5}px`
          }}></div>
          <div className="orbital-ring ring-2" style={{ 
            width: `${animationSize * 2}px`,
            height: `${animationSize * 2}px`
          }}></div>
          <div className="orbital-ring ring-3" style={{ 
            width: `${animationSize * 2.5}px`,
            height: `${animationSize * 2.5}px`
          }}></div>
          
          {/* Floating Particles - Adjusted for size */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="floating-particle" 
              style={{
                '--delay': `${i * 0.5}s`,
                '--angle': `${(i * 30)}deg`,
                '--orbit-radius': `${animationSize * 0.75}px`
              }}
            />
          ))}
        </div>

        {/* Optional: Size control buttons (can be removed) */}
        <div className="size-controls" style={{ position: 'absolute', top: '100px', right: '20px', zIndex: 100 }}>
          <button onClick={decreaseSize} style={{ margin: '5px', padding: '5px 10px' }}>−</button>
          <span style={{ color: 'white', margin: '0 10px' }}>{animationSize}px</span>
          <button onClick={increaseSize} style={{ margin: '5px', padding: '5px 10px' }}>+</button>
        </div>

        {/* User Info Panel */}
        <div className="user-panel">
          <div className="user-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} />
            ) : (
              <div className="avatar-fallback">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="user-info">
            <h3 className="user-name">{user.displayName || 'User'}</h3>
            <p className="user-email">{user.email}</p>
          </div>
          <div className="current-time">
            <div className="time-icon">🕒</div>
            <div className="time-text">{currentTime}</div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <button className="control-btn upload-btn" onClick={handleUpload}>
            <span className="btn-icon">📁</span>
            <span className="btn-text">Upload</span>
          </button>
          
          <button className="control-btn connect-btn">
            <span className="btn-icon">🌐</span>
            <span className="btn-text">Connect</span>
          </button>
          
          <button className="control-btn explore-btn">
            <span className="btn-icon">🔭</span>
            <span className="btn-text">Explore</span>
          </button>
          
          <button className="control-btn settings-btn">
            <span className="btn-icon">⚙️</span>
            <span className="btn-text">Settings</span>
          </button>
          
          <button className="control-btn logout-btn" onClick={handleLogout}>
            <span className="btn-icon">🚪</span>
            <span className="btn-text">Logout</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          id="file-input"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Cosmic Grid */}
        <div className="cosmic-grid">
          <div className="grid-line horizontal"></div>
          <div className="grid-line vertical"></div>
          <div className="grid-line diagonal-1"></div>
          <div className="grid-line diagonal-2"></div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Entering Cosmic Space...</div>
          </div>
        )}
      </div>
    </div>
  );
}