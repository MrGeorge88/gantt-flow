import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getProjectById(id);
      setProject(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Error al cargar los detalles del proyecto. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_progreso':
        return 'En Progreso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'status-pending';
      case 'en_progreso':
        return 'status-in-progress';
      case 'completado':
        return 'status-completed';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const calculateProgress = () => {
    if (!project || !project.tasks || project.tasks.length === 0) {
      return 0;
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.progress === 100).length;
    
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const handleDeleteProject = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        await projectService.deleteProject(id);
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Error al eliminar el proyecto. Por favor, intenta nuevamente.');
      }
    }
  };

  if (isLoading) {
    return <div className="project-detail-loading">Cargando detalles del proyecto...</div>;
  }

  if (error) {
    return (
      <div className="project-detail-error">
        <p>{error}</p>
        <button onClick={() => navigate('/projects')} className="back-to-list-button">
          Volver a la lista de proyectos
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-not-found">
        <p>Proyecto no encontrado</p>
        <button onClick={() => navigate('/projects')} className="back-to-list-button">
          Volver a la lista de proyectos
        </button>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <div className="project-detail-header">
        <div className="project-header-left">
          <h1 className="project-title">{project.name}</h1>
          <div className={`project-status ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
          </div>
        </div>
        <div className="project-actions">
          <Link to={`/gantt/${id}`} className="gantt-button">
            Ver Diagrama Gantt
          </Link>
          <button 
            onClick={() => navigate(`/projects/${id}/edit`)}
            className="edit-project-button"
          >
            Editar
          </button>
          <button 
            onClick={handleDeleteProject}
            className="delete-project-button"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="project-progress-section">
        <div className="progress-info">
          <span className="progress-label">Progreso general:</span>
          <span className="progress-percentage">{calculateProgress()}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      <div className="project-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Resumen
        </button>
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tareas
        </button>
        <button 
          className={`tab-button ${activeTab === 'members' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Miembros
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="info-card">
              <h2 className="info-card-title">Información del Proyecto</h2>
              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">Descripción:</span>
                  <p className="info-value">{project.description || 'Sin descripción'}</p>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha de inicio:</span>
                  <span className="info-value">{formatDate(project.startDate)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha de finalización:</span>
                  <span className="info-value">{formatDate(project.endDate)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha de creación:</span>
                  <span className="info-value">{formatDate(project.createdAt)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Última actualización:</span>
                  <span className="info-value">{formatDate(project.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2 className="info-card-title">Estadísticas</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">{project.tasks?.length || 0}</span>
                  <span className="stat-label">Tareas totales</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">
                    {project.tasks?.filter(task => task.progress === 100).length || 0}
                  </span>
                  <span className="stat-label">Tareas completadas</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{project.members?.length || 0}</span>
                  <span className="stat-label">Miembros</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <div className="tasks-header">
              <h2 className="section-title">Tareas del Proyecto</h2>
              <button className="add-task-button">+ Agregar tarea</button>
            </div>

            {project.tasks && project.tasks.length > 0 ? (
              <div className="tasks-list">
                <div className="task-list-header">
                  <span className="task-name-header">Nombre</span>
                  <span className="task-assignee-header">Asignado a</span>
                  <span className="task-dates-header">Fechas</span>
                  <span className="task-priority-header">Prioridad</span>
                  <span className="task-progress-header">Progreso</span>
                </div>
                
                {project.tasks.map(task => (
                  <div key={task.id} className="task-item">
                    <div className="task-name">
                      <input 
                        type="checkbox" 
                        checked={task.progress === 100} 
                        readOnly 
                        className="task-checkbox"
                      />
                      <span>{task.title}</span>
                    </div>
                    <div className="task-assignee">
                      {task.assignedTo && task.assignedTo.length > 0 ? (
                        <div className="assignee-avatar">
                          {task.assignedTo[0].substring(0, 2).toUpperCase()}
                        </div>
                      ) : (
                        <span className="no-assignee">Sin asignar</span>
                      )}
                    </div>
                    <div className="task-dates">
                      <span>{formatDate(task.startDate)}</span>
                      <span>-</span>
                      <span>{formatDate(task.endDate)}</span>
                    </div>
                    <div className="task-priority">
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="task-progress">
                      <div className="task-progress-bar-container">
                        <div 
                          className="task-progress-bar" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="task-progress-text">{task.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-tasks-message">
                <p>No hay tareas creadas para este proyecto</p>
                <button className="add-first-task-button">Crear la primera tarea</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-tab">
            <div className="members-header">
              <h2 className="section-title">Miembros del Proyecto</h2>
              <button className="invite-member-button">+ Invitar miembro</button>
            </div>

            {project.members && project.members.length > 0 ? (
              <div className="members-list">
                {project.members.map((member, index) => (
                  <div key={index} className="member-card">
                    <div className="member-avatar">
                      {member.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member}</span>
                      <span className="member-role">Miembro</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-members-message">
                <p>No hay miembros en este proyecto</p>
                <button className="invite-first-member-button">Invitar al primer miembro</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;