import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import './ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Aplicar filtro y ordenamiento cuando cambian los proyectos o criterios
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejar fechas
      if (sortBy === 'startDate' || sortBy === 'endDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProjects(sorted);
  }, [projects, searchTerm, sortBy, sortOrder]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Error al cargar los proyectos. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Si ya estamos ordenando por este campo, cambiamos el orden
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es un nuevo campo, lo establecemos y ponemos orden descendente por defecto
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteProject = async (id, e) => {
    e.preventDefault(); // Evitar que el evento se propague al enlace
    e.stopPropagation();

    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        await projectService.deleteProject(id);
        // Actualizar la lista de proyectos después de eliminar
        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Error al eliminar el proyecto. Por favor, intenta nuevamente.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="project-list-container">
      <div className="project-list-header">
        <h1 className="project-list-title">Mis Proyectos</h1>
        <button 
          className="create-project-button"
          onClick={() => navigate('/projects/new')}
        >
          + Nuevo Proyecto
        </button>
      </div>

      <div className="project-list-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="sort-controls">
          <span>Ordenar por:</span>
          <select 
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="sort-select"
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="updatedAt-desc">Última modificación</option>
            <option value="createdAt-desc">Fecha de creación</option>
            <option value="startDate-asc">Fecha de inicio</option>
            <option value="endDate-asc">Fecha de finalización</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading-message">Cargando proyectos...</div>
      ) : filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <Link 
              to={`/projects/${project.id}`} 
              key={project.id}
              className="project-card"
            >
              <div className="project-card-header">
                <h2 className="project-card-title">{project.name}</h2>
                <div className={`project-status ${getStatusColor(project.status)}`}>
                  {project.status?.replace('_', ' ')}
                </div>
              </div>
              
              <p className="project-card-description">
                {project.description || 'Sin descripción'}
              </p>
              
              <div className="project-card-footer">
                <div className="project-card-dates">
                  {project.startDate && (
                    <span>Inicio: {new Date(project.startDate).toLocaleDateString()}</span>
                  )}
                  {project.endDate && (
                    <span>Fin: {new Date(project.endDate).toLocaleDateString()}</span>
                  )}
                </div>
                
                <div className="project-card-actions">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/projects/${project.id}/edit`);
                    }}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-projects-message">
          {searchTerm ? (
            <p>No se encontraron proyectos que coincidan con "{searchTerm}"</p>
          ) : (
            <>
              <p>No tienes proyectos creados</p>
              <button 
                onClick={() => navigate('/projects/new')}
                className="create-first-project-button"
              >
                Crear mi primer proyecto
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectList;