// components/ProjectForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { createProject, updateProject, fetchProjectById, loading, error } = useProjects();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'pendiente'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del proyecto si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      const loadProject = async () => {
        const project = await fetchProjectById(id);
        if (project) {
          // Formatear fechas para input type="date"
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };
          
          setFormData({
            name: project.name,
            description: project.description,
            startDate: formatDate(project.startDate),
            endDate: formatDate(project.endDate),
            status: project.status
          });
        }
      };
      
      loadProject();
    }
  }, [id, isEditMode, fetchProjectById]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario lo modifica
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar el formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre del proyecto es obligatorio';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'La fecha de inicio es obligatoria';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'La fecha de fin es obligatoria';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        await updateProject(id, formData);
        alert('Proyecto actualizado con éxito');
      } else {
        await createProject(formData);
        alert('Proyecto creado con éxito');
      }
      navigate('/projects');
    } catch (err) {
      console.error('Error al guardar el proyecto:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className={`w-full p-2 border rounded ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className={`w-full p-2 border rounded ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.startDate}
                onChange={handleChange}
              />
              {formErrors.startDate && (
                <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                Fecha de Fin *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className={`w-full p-2 border rounded ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.endDate}
                onChange={handleChange}
              />
              {formErrors.endDate && (
                <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
              Estado
            </label>
            <select
              id="status"
              name="status"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              onClick={() => navigate('/projects')}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar Proyecto' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;