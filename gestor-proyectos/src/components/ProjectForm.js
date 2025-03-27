import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import './ProjectForm.css';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'pendiente'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      const projectData = await projectService.getProjectById(id);
      
      // Formatear fechas para el formato de input date
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        startDate: formatDate(projectData.startDate),
        endDate: formatDate(projectData.endDate),
        status: projectData.status || 'pendiente'
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Error al cargar los detalles del proyecto. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return false;
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        setError('La fecha de finalización no puede ser anterior a la fecha de inicio');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await projectService.updateProject(id, formData);
      } else {
        await projectService.createProject(formData);
      }
      
      // Redirigir a la lista de proyectos después de guardar
      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el proyecto. Por favor, intenta nuevamente.`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="project-form-loading">Cargando datos del proyecto...</div>;
  }

  return (
    <div className="project-form-container">
      <div className="project-form-header">
        <h1 className="project-form-title">
          {isEditMode ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
        </h1>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="back-button"
        >
          Volver a la lista
        </button>
      </div>

      {error && (
        <div className="form-error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nombre del Proyecto <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              Fecha de Inicio
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate" className="form-label">
              Fecha de Finalización
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="save-button"
          >
            {isSaving ? (
              isEditMode ? 'Actualizando...' : 'Creando...'
            ) : (
              isEditMode ? 'Actualizar Proyecto' : 'Crear Proyecto'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;