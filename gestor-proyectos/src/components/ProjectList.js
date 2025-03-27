// components/ProjectList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

const ProjectList = () => {
  const { projects, loading, error, fetchProjects, deleteProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [sortOption, setSortOption] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filtrar y ordenar proyectos
  useEffect(() => {
    if (projects) {
      let filtered = [...projects];
      
      // Aplicar filtro de búsqueda
      if (searchTerm) {
        filtered = filtered.filter(
          project => 
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Aplicar ordenamiento
      filtered = filtered.sort((a, b) => {
        if (sortOption === 'name') {
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else if (sortOption === 'status') {
          return sortDirection === 'asc' 
            ? a.status.localeCompare(b.status) 
            : b.status.localeCompare(a.status);
        } else if (sortOption === 'startDate') {
          return sortDirection === 'asc' 
            ? new Date(a.startDate) - new Date(b.startDate) 
            : new Date(b.startDate) - new Date(a.startDate);
        } else if (sortOption === 'endDate') {
          return sortDirection === 'asc' 
            ? new Date(a.endDate) - new Date(b.endDate) 
            : new Date(b.endDate) - new Date(a.endDate);
        } else { // updatedAt por defecto
          return sortDirection === 'asc' 
            ? new Date(a.updatedAt) - new Date(b.updatedAt) 
            : new Date(b.updatedAt) - new Date(a.updatedAt);
        }
      });
      
      setFilteredProjects(filtered);
    }
  }, [projects, searchTerm, sortOption, sortDirection]);

  // Manejar cambio de ordenamiento
  const handleSortChange = (option) => {
    if (sortOption === option) {
      // Si ya estamos ordenando por esta opción, cambiamos la dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es una nueva opción, establecemos esta opción y dirección por defecto
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  // Función para confirmar y eliminar un proyecto
  const handleDeleteProject = (id, name) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${name}"?`)) {
      deleteProject(id).then(success => {
        if (success) {
          alert('Proyecto eliminado con éxito');
        }
      });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-200 text-yellow-800';
      case 'en_progreso': return 'bg-blue-200 text-blue-800';
      case 'completado': return 'bg-green-200 text-green-800';
      case 'cancelado': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'en_progreso': return 'En Progreso';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) return <div className="text-center my-8">Cargando proyectos...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Proyectos</h1>
        <Link to="/projects/new" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Nuevo Proyecto
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar proyectos..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('name')}
              >
                Nombre
                {sortOption === 'name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('status')}
              >
                Estado
                {sortOption === 'status' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('startDate')}
              >
                Fecha de Inicio
                {sortOption === 'startDate' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('endDate')}
              >
                Fecha de Fin
                {sortOption === 'endDate' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                      {project.name}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1 truncate max-w-xs">{project.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      Ver
                    </Link>
                    <Link to={`/projects/${project.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No se encontraron proyectos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;