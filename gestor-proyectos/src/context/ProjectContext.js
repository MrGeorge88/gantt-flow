import React, { createContext, useState, useContext, useEffect } from 'react';
import { projectService } from '../services/api';

// Crear el contexto
const ProjectContext = createContext();

// Hook personalizado para usar el contexto
export const useProjects = () => useContext(ProjectContext);

// Proveedor del contexto
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los proyectos
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyecto por ID
  const getProjectById = async (id) => {
    setLoading(true);
    try {
      const data = await projectService.getProjectById(id);
      setSelectedProject(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Error al cargar el proyecto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo proyecto
  const createProject = async (projectData) => {
    setLoading(true);
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects([...projects, newProject]);
      setError(null);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Error al crear el proyecto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar proyecto
  const updateProject = async (id, projectData) => {
    setLoading(true);
    try {
      const updatedProject = await projectService.updateProject(id, projectData);
      
      // Actualizar la lista de proyectos
      setProjects(projects.map(project => 
        project.id === id ? updatedProject : project
      ));
      
      // Actualizar el proyecto seleccionado si es el mismo
      if (selectedProject && selectedProject.id === id) {
        setSelectedProject(updatedProject);
      }
      
      setError(null);
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Error al actualizar el proyecto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar proyecto
  const deleteProject = async (id) => {
    setLoading(true);
    try {
      await projectService.deleteProject(id);
      
      // Actualizar la lista de proyectos
      setProjects(projects.filter(project => project.id !== id));
      
      // Limpiar el proyecto seleccionado si es el mismo
      if (selectedProject && selectedProject.id === id) {
        setSelectedProject(null);
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Error al eliminar el proyecto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
  }, []);

  // Valores y funciones que se compartirán a través del contexto
  const value = {
    projects,
    selectedProject,
    loading,
    error,
    loadProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    setSelectedProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;