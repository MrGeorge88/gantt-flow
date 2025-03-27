// components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'text-blue-500' : 'text-gray-700 hover:text-blue-500';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-blue-600">ProjectManager</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                to="/projects" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 
                  ${location.pathname.startsWith('/projects') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Proyectos
              </Link>
              <Link 
                to="/gantt" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 
                  ${location.pathname.startsWith('/gantt') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Diagrama de Gantt
              </Link>
              <Link 
                to="/tasks" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 
                  ${location.pathname.startsWith('/tasks') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Tareas
              </Link>
              <Link 
                to="/team" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 
                  ${location.pathname.startsWith('/team') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Equipo
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex md:items-center">
              <div className="ml-3 relative">
                <div>
                  <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300">
                    <img 
                      className="h-8 w-8 rounded-full" 
                      src="https://via.placeholder.com/40" 
                      alt="Foto de perfil"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button 
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/projects" 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location.pathname.startsWith('/projects') 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Proyectos
          </Link>
          <Link 
            to="/gantt" 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location.pathname.startsWith('/gantt') 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Diagrama de Gantt
          </Link>
          <Link 
            to="/tasks" 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location.pathname.startsWith('/tasks') 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Tareas
          </Link>
          <Link 
            to="/team" 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location.pathname.startsWith('/team') 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Equipo
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <img 
                className="h-10 w-10 rounded-full" 
                src="https://via.placeholder.com/40" 
                alt="Foto de perfil"
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">Usuario Ejemplo</div>
              <div className="text-sm font-medium text-gray-500">usuario@ejemplo.com</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link 
              to="/profile" 
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Tu Perfil
            </Link>
            <Link 
              to="/settings" 
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Configuración
            </Link>
            <button 
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => {
                // Lógica para cerrar sesión
                setIsMenuOpen(false);
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;