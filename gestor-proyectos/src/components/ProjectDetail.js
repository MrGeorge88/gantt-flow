// components/ProjectDetail.js
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProjectById, deleteProject, loading, error } = useProjects();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      const projectData = await fetchProjectById(id);
      setProject(projectData);
    };
    
    loadProject();
  }, [id, fetchProjectById]);

  const handleDeleteProject = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?`)) {
      deleteProject(id).then(success => {
        if (success) {
          alert('Proyecto eliminado con éxito');
          navigate('/projects');
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center my-8">Cargando detalles del proyecto...</div>;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate('/projects')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Volver a Proyectos
        </button>
      </div>
    );
  }

  if (!project) return <div className="text-center my-8">Proyecto no encontrado</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="space-x-2">
          <Link 
            to="/projects" 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            Volver
          </Link>
          <Link 
            to={`/projects/${id}/edit`} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Editar
          </Link>
          <button
            onClick={handleDeleteProject}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                <p className="text-gray-700">{project.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Estado</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Fechas</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Inicio</p>
                    <p className="font-medium">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Fin</p>
                    <p className="font-medium">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Miembros</h2>
                {project.members && project.members.length > 0 ? (
                  <ul className="space-y-2">
                    {project.members.map((member, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{member.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay miembros asignados</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Tareas</h2>
            {project.tasks && project.tasks.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="divide-y divide-gray-200">
                  {project.tasks.map((task, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          readOnly
                          className="mr-3"
                        />
                        <div>
                          <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No hay tareas para este proyecto</p>
            )}
            
            <div className="mt-4">
              <Link 
                to={`/projects/${id}/tasks/new`} 
                className="text-blue-600 hover:text-blue-800"
              >
                + Añadir nueva tarea
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;