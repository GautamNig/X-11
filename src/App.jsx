// src/App.jsx - SIMPLIFIED VERSION
import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from './firebase'; // Import from your firebase config
import LoginPage from './components/LoginPage';
import MainApp from './components/MainApp';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('✅ Auth state changed - User:', user?.email);
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('❌ Auth state error:', error);
      setLoading(false);
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Initializing X-11...</div>
        </div>
      </div>
    );
  }

  console.log('🎯 Current user state:', user ? 'Logged in' : 'Not logged in');
  
  return user ? <MainApp user={user} /> : <LoginPage />;
}

export default App;