// src/components/MainApp.jsx - WITH 60px LOTTIE AND USER ORBITS
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import lottie from 'lottie-web';
import './MainApp.css';

// Mock user data for the 11 circular tiles
const mockUsers = [
  { id: 1, name: 'Alex', color: '#FF6B6B', initials: 'A' },
  { id: 2, name: 'Sam', color: '#4ECDC4', initials: 'S' },
  { id: 3, name: 'Taylor', color: '#FFD166', initials: 'T' },
  { id: 4, name: 'Jordan', color: '#06D6A0', initials: 'J' },
  { id: 5, name: 'Casey', color: '#118AB2', initials: 'C' },
  { id: 6, name: 'Riley', color: '#EF476F', initials: 'R' },
  { id: 7, name: 'Morgan', color: '#9D4EDD', initials: 'M' },
  { id: 8, name: 'Drew', color: '#FF9E00', initials: 'D' },
  { id: 9, name: 'Quinn', color: '#7209B7', initials: 'Q' },
  { id: 10, name: 'Blake', color: '#3A86FF', initials: 'B' },
  { id: 11, name: 'Sky', color: '#FF0054', initials: 'S' },
];

export default function MainApp({ user }) {
  const [backgroundStars, setBackgroundStars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const lottieContainer = useRef(null);
  const [activeOrbitUser, setActiveOrbitUser] = useState(null);

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

  // Load Lottie animation
  useEffect(() => {
    let anim;
    if (lottieContainer.current) {
      anim = lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/lottie/X11-cosmic.json'
      });

      // Force small size for Lottie
      setTimeout(() => {
        if (anim && anim.renderer && anim.renderer.svgElement) {
          const svg = anim.renderer.svgElement;
          svg.style.width = '60px';
          svg.style.height = '60px';
          svg.style.maxWidth = '100%';
          svg.style.maxHeight = '100%';
        }
      }, 100);
    }

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, []);

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

  const handleOrbitUserClick = (user) => {
    console.log('👤 Orbit user clicked:', user.name);
    setActiveOrbitUser(user);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setActiveOrbitUser(null);
    }, 3000);
  };

  // Calculate positions for 11 users in a circular orbit
  const orbitRadius = 140; // Distance from center
  const userOrbitRadius = 20; // Size of user circles
  const totalUsers = 11;
  
  const orbitUsers = mockUsers.map((user, index) => {
    // Calculate angle for each user (evenly distributed)
    const angle = (index / totalUsers) * Math.PI * 2;
    
    // Calculate position
    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;
    
    // Calculate orbit position (for CSS animation)
    const orbitAngle = (index / totalUsers) * 360;
    
    return {
      ...user,
      x,
      y,
      angle: orbitAngle,
      style: {
        '--angle': `${orbitAngle}deg`,
        '--delay': `${index * 0.5}s`
      }
    };
  });

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

        {/* Central Lottie Animation - 60px fixed size */}
        <div className="central-animation">
          <div ref={lottieContainer} className="lottie-center" />
          
          {/* Orbital Path (visual guide) */}
          <div className="orbital-path"></div>
          
          {/* 11 User Circles in Orbit */}
          <div className="user-orbit-container">
            {orbitUsers.map(user => (
              <div
                key={user.id}
                className="orbit-user"
                style={user.style}
                onClick={() => handleOrbitUserClick(user)}
              >
                <div 
                  className="user-circle"
                  style={{ backgroundColor: user.color }}
                >
                  <span className="user-initials">{user.initials}</span>
                </div>
                <div className="user-glow"></div>
              </div>
            ))}
          </div>

          {/* Connection Lines between users */}
          <svg className="connection-lines" width="400" height="400">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(120, 219, 255, 0.3)" />
                <stop offset="50%" stopColor="rgba(120, 219, 255, 0.6)" />
                <stop offset="100%" stopColor="rgba(120, 219, 255, 0.3)" />
              </linearGradient>
            </defs>
            {orbitUsers.map((user, index) => {
              const nextUser = orbitUsers[(index + 1) % totalUsers];
              return (
                <line
                  key={`line-${index}`}
                  x1="200"
                  y1="200"
                  x2={200 + user.x}
                  y2={200 + user.y}
                  stroke="url(#line-gradient)"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              );
            })}
          </svg>
        </div>

        {/* Active User Info Display */}
        {activeOrbitUser && (
          <div className="active-user-info">
            <div className="active-user-card">
              <div 
                className="active-user-avatar"
                style={{ backgroundColor: activeOrbitUser.color }}
              >
                {activeOrbitUser.initials}
              </div>
              <div className="active-user-details">
                <h4>{activeOrbitUser.name}</h4>
                <p>Orbit Member</p>
              </div>
            </div>
          </div>
        )}

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