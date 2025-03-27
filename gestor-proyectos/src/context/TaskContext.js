// context/TaskContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import taskService from '../services/taskService';

// Crear el contexto
export const TaskContext = createContext();

// Proveedor del contexto
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las tareas al iniciar
  useEffect(() => {
    fetchAllTasks();
  }, []);

  // Obtener todas las tareas
  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tareas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener tareas de un proyecto específico
  const fetchTasksByProjectId = async (projectId) => {
    setLoading(true);
    try {
      const data = await taskService.getTasksByProjectId(projectId);
      setProjectTasks(data);
      setError(null);
      return data;
    } catch (err) {
      setError('Error al cargar las tareas del proyecto: ' + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener una tarea por ID
  const fetchTaskById = async (id) => {
    setLoading(true);
    try {
      const data = await taskService.getTaskById(id);
      setSelectedTask(data);
      setError(null);
      return data;
    } catch (err) {
      setError('Error al cargar la tarea: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva tarea
  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks([...tasks, newTask]);
      
      // Si la tarea pertenece al proyecto actual, actualizar también las tareas del proyecto
      if (taskData.projectId && projectTasks.length > 0 && projectTasks[0].projectId === taskData.projectId) {
        setProjectTasks([...projectTasks, newTask]);
      }
      
      setError(null);
      return newTask;
    } catch (err) {
      setError('Error al crear la tarea: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una tarea existente
  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      
      // Actualizar la tarea en la lista de todas las tareas
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      
      // Actualizar también en la lista de tareas del proyecto si es necesario
      if (projectTasks.length > 0) {
        setProjectTasks(projectTasks.map(t => t.id === id ? updatedTask : t));
      }
      
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(updatedTask);
      }
      
      setError(null);
      return updatedTask;
    } catch (err) {
      setError('Error al actualizar la tarea: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una tarea
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await taskService.deleteTask(id);
      
      // Eliminar la tarea de la lista de todas las tareas
      setTasks(tasks.filter(t => t.id !== id));
      
      // Eliminar también de la lista de tareas del proyecto si es necesario
      if (projectTasks.length > 0) {
        setProjectTasks(projectTasks.filter(t => t.id !== id));
      }
      
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(null);
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError('Error al eliminar la tarea: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar el progreso de una tarea
  const updateTaskProgress = async (id, progress) => {
    setLoading(true);
    try {
      const updatedTask = await taskService.updateTaskProgress(id, progress);
      
      // Actualizar en ambas listas de tareas
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      
      if (projectTasks.length > 0) {
        setProjectTasks(projectTasks.map(t => t.id === id ? updatedTask : t));
      }
      
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(updatedTask);
      }
      
      setError(null);
      return updatedTask;
    } catch (err) {
      setError('Error al actualizar el progreso: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar fechas de una tarea (para diagrama Gantt interactivo)
  const updateTaskDates = async (id, startDate, endDate) => {
    setLoading(true);
    try {
      const updatedTask = await taskService.updateTaskDates(id, startDate, endDate);
      
      // Actualizar en ambas listas de tareas
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      
      if (projectTasks.length > 0) {
        setProjectTasks(projectTasks.map(t => t.id === id ? updatedTask : t));
      }
      
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(updatedTask);
      }
      
      setError(null);
      return updatedTask;
    } catch (err) {
      setError('Error al actualizar las fechas: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Objeto de valor del contexto
  const value = {
    tasks,
    projectTasks,
    selectedTask,
    loading,
    error,
    fetchAllTasks,
    fetchTasksByProjectId,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskProgress,
    updateTaskDates,
    setSelectedTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks debe usarse dentro de un TaskProvider');
  }
  return context;
};