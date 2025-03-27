import React, { useState, useEffect } from 'react';
import GanttChart from './components/GanttChart';
import Login from './components/auth/Login';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="App">
      {user ? (
        <div className="flex flex-col h-screen">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">GanttFlow</h1>
            <div className="flex items-center">
              <span className="mr-4">Hola, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-400"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
          <GanttChart />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
