import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

  // Si el usuario no está autenticado, mostrar el formulario de login/registro
  if (!user) {
    return (
      <div className="app">
        {showRegister ? (
          <Register 
            onLogin={handleLogin} 
            onBackToLogin={() => setShowRegister(false)} 
          />
        ) : (
          <Login 
            onLogin={handleLogin} 
            onRegister={() => setShowRegister(true)} 
          />
        )}
      </div>
    );
  }

  // Si el usuario está autenticado, mostrar la aplicación con rutas
  return (
    <BrowserRouter>
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
        
        <Routes>
          {/* Ruta principal redirige a la lista de proyectos */}
          <Route path="/" element={<Navigate to="/projects" />} />
          
          {/* Rutas para proyectos */}
          <Route path="/projects" element={<GanttChart />} />
          <Route path="/projects/:id" element={<GanttChart />} />
          
          {/* Rutas para diagrama de Gantt */}
          <Route path="/gantt" element={<GanttChart />} />
          <Route path="/gantt/:id" element={<GanttChart />} />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;