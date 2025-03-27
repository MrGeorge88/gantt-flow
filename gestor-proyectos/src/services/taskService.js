// services/taskService.js
import Task from '../models/Task';

// Simulamos almacenamiento local para desarrollo
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskService = {
  // Obtener todas las tareas
  getAllTasks: () => {
    return Promise.resolve([...tasks]);
  },
  
  // Obtener tareas de un proyecto específico
  getTasksByProjectId: (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    return Promise.resolve(projectTasks);
  },
  
  // Obtener una tarea por ID
  getTaskById: (id) => {
    const task = tasks.find(t => t.id === id);
    return Promise.resolve(task || null);
  },
  
  // Crear una nueva tarea
  createTask: (taskData) => {
    const id = Date.now().toString();
    const newTask = new Task(
      id,
      taskData.projectId,
      taskData.title,
      taskData.description,
      taskData.startDate,
      taskData.endDate,
      taskData.progress || 0,
      taskData.dependencies || [],
      taskData.assignedTo || [],
      taskData.priority || 'media'
    );
    
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return Promise.resolve(newTask);
  },
  
  // Actualizar una tarea existente
  updateTask: (id, updatedData) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Tarea no encontrada'));
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updatedData,
      updatedAt: new Date()
    };
    
    tasks[index] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return Promise.resolve(updatedTask);
  },
  
  // Eliminar una tarea
  deleteTask: (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Tarea no encontrada'));
    }
    
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return Promise.resolve({ id, deleted: true });
  },

  // Actualizar progreso de una tarea
  updateTaskProgress: (id, progress) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Tarea no encontrada'));
    }
    
    const updatedTask = {
      ...tasks[index],
      progress: progress,
      updatedAt: new Date()
    };
    
    tasks[index] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return Promise.resolve(updatedTask);
  },

  // Actualizar fechas de una tarea (para arrastrar y soltar en el diagrama Gantt)
  updateTaskDates: (id, startDate, endDate) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Tarea no encontrada'));
    }
    
    const updatedTask = {
      ...tasks[index],
      startDate: startDate,
      endDate: endDate,
      updatedAt: new Date()
    };
    
    tasks[index] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return Promise.resolve(updatedTask);
  }
};

export default taskService;