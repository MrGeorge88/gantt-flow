// services/projectService.js
import Project from '../models/Project';

// Simulamos almacenamiento local para desarrollo
let projects = JSON.parse(localStorage.getItem('projects')) || [];

const projectService = {
  // Obtener todos los proyectos
  getAllProjects: () => {
    return Promise.resolve([...projects]);
  },
  
  // Obtener un proyecto por ID
  getProjectById: (id) => {
    const project = projects.find(p => p.id === id);
    return Promise.resolve(project || null);
  },
  
  // Crear un nuevo proyecto
  createProject: (projectData) => {
    const id = Date.now().toString();
    const newProject = new Project(
      id,
      projectData.name,
      projectData.description,
      projectData.startDate,
      projectData.endDate,
      projectData.status || 'pendiente',
      projectData.members || [],
      projectData.tasks || []
    );
    
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    return Promise.resolve(newProject);
  },
  
  // Actualizar un proyecto existente
  updateProject: (id, updatedData) => {
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Proyecto no encontrado'));
    }
    
    const updatedProject = {
      ...projects[index],
      ...updatedData,
      updatedAt: new Date()
    };
    
    projects[index] = updatedProject;
    localStorage.setItem('projects', JSON.stringify(projects));
    return Promise.resolve(updatedProject);
  },
  
  // Eliminar un proyecto
  deleteProject: (id) => {
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Proyecto no encontrado'));
    }
    
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects));
    return Promise.resolve({ id, deleted: true });
  }
};

export default projectService;