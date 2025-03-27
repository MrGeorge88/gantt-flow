// context/ProjectContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import projectService from '../services/projectService';

// Crear el contexto
export const ProjectContext = createContext();

// Proveedor del contexto
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los proyectos al iniciar
  useEffect(() => {
    fetchProjects();
  }, []);

  // Obtener todos los proyectos
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los proyectos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un proyecto por ID
  const fetchProjectById = async (id) => {
    setLoading(true);
    try {
      const data = await projectService.getProjectById(id);
      setSelectedProject(data);
      setError(null);
      return data;
    } catch (err) {
      setError('Error al cargar el proyecto: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo proyecto
  const createProject = async (projectData) => {
    setLoading(true);
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects([...projects, newProject]);
      setError(null);
      return newProject;
    } catch (err) {
      setError('Error al crear el proyecto: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un proyecto existente
  const updateProject = async (id, projectData) => {
    setLoading(true);
    try {
      const updatedProject = await projectService.updateProject(id, projectData);
      setProjects(projects.map(p => p.id === id ? updatedProject : p));
      if (selectedProject && selectedProject.id === id) {
        setSelectedProject(updatedProject);
      }
      setError(null);
      return updatedProject;
    } catch (err) {
      setError('Error al actualizar el proyecto: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un proyecto
  const deleteProject = async (id) => {
    setLoading(true);
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject && selectedProject.id === id) {
        setSelectedProject(null);
      }
      setError(null);
      return true;
    } catch (err) {
      setError('Error al eliminar el proyecto: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Objeto de valor del contexto
  const value = {
    projects,
    selectedProject,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
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

// Hook personalizado para usar el contexto
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects debe usarse dentro de un ProjectProvider');
  }
  return context;
};