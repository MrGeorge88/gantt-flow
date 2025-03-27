import React, { useState, useEffect } from 'react';
import GanttChart from './components/GanttChart';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app">
      {user ? (
        <div className="app-container">
          <div className="app-header">
            <h1 className="app-title">GanttFlow</h1>
            <div className="user-info">
              <span className="user-greeting">Hola, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
          <GanttChart />
        </div>
      ) : (
        showRegister ? (
          <Register 
            onLogin={handleLogin} 
            onBackToLogin={() => setShowRegister(false)} 
          />
        ) : (
          <Login 
            onLogin={handleLogin} 
            onRegister={() => setShowRegister(true)} 
          />
        )
      )}
    </div>
  );
}

export default App;
