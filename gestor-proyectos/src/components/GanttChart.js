// components/GanttChart.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useProjects } from '../context/ProjectContext';
import GanttTask from './GanttTask';
import GanttHeader from './GanttHeader';
import GanttTimeline from './GanttTimeline';

const GanttChart = () => {
  const { id: projectId } = useParams();
  const { projectTasks, fetchTasksByProjectId, updateTaskDates, loading, error } = useTasks();
  const { selectedProject, fetchProjectById } = useProjects();
  
  const [dates, setDates] = useState([]);
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'
  const [zoom, setZoom] = useState(1); // Factor de zoom: 0.5, 1, 1.5, 2
  const [scrollPosition, setScrollPosition] = useState(0);
  const [draggingTask, setDraggingTask] = useState(null);
  const [startX, setStartX] = useState(0);
  const [resizingTask, setResizingTask] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null); // 'start' o 'end'
  const [hoveredTask, setHoveredTask] = useState(null);
  
  const scrollContainerRef = useRef(null);
  
  // Cargar datos del proyecto y sus tareas
  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
      fetchTasksByProjectId(projectId);
    }
  }, [projectId, fetchProjectById, fetchTasksByProjectId]);
  
  // Generar fechas para la línea de tiempo
  useEffect(() => {
    if (selectedProject) {
      const startDate = new Date(selectedProject.startDate);
      const endDate = new Date(selectedProject.endDate);
      
      // Asegurarse de que hay un rango mínimo de fechas
      const minDays = 30; // Mínimo un mes de fechas
      const diffTime = Math.abs(endDate - startDate);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < minDays) {
        // Si el proyecto es muy corto, extender la línea de tiempo
        endDate.setDate(startDate.getDate() + minDays);
        diffDays = minDays;
      }
      
      const allDates = [];
      const currentDate = new Date(startDate);
      
      // Añadir fechas según el modo de visualización
      while (currentDate <= endDate) {
        allDates.push(new Date(currentDate));
        
        if (viewMode === 'day') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (viewMode === 'week') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (viewMode === 'month') {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
      
      setDates(allDates);
    }
  }, [selectedProject, viewMode]);
  
  // Función para calcular la posición X según la fecha
  const getPositionX = (date) => {
    if (!selectedProject || !dates.length) return 0;
    
    const projectStart = new Date(selectedProject.startDate);
    const dateObj = new Date(date);
    const diffTime = Math.abs(dateObj - projectStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Ajustar según el modo de visualización y zoom
    let dayWidth;
    if (viewMode === 'day') {
      dayWidth = 30 * zoom; // 30px por día
    } else if (viewMode === 'week') {
      dayWidth = 100 * zoom; // 100px por semana
    } else if (viewMode === 'month') {
      dayWidth = 120 * zoom; // 120px por mes
    }
    
    return diffDays * (dayWidth / (viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30));
  };
  
  // Función para calcular la anchura según la duración
  const getWidthFromDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Ajustar según el modo de visualización y zoom
    let dayWidth;
    if (viewMode === 'day') {
      dayWidth = 30 * zoom; // 30px por día
    } else if (viewMode === 'week') {
      dayWidth = 100 / 7 * zoom; // 100px por semana, dividido por 7 para obtener el ancho por día
    } else if (viewMode === 'month') {
      dayWidth = 120 / 30 * zoom; // 120px por mes, dividido por 30 para obtener el ancho por día
    }
    
    return diffDays * dayWidth;
  };
  
  // Función para convertir posición X a fecha
  const getDateFromPositionX = (posX) => {
    if (!selectedProject || !dates.length) return new Date();
    
    const projectStart = new Date(selectedProject.startDate);
    
    // Ajustar según el modo de visualización y zoom
    let dayWidth;
    if (viewMode === 'day') {
      dayWidth = 30 * zoom; // 30px por día
    } else if (viewMode === 'week') {
      dayWidth = 100 / 7 * zoom; // Ancho por día en vista semanal
    } else if (viewMode === 'month') {
      dayWidth = 120 / 30 * zoom; // Ancho por día en vista mensual
    }
    
    const diffDays = Math.round(posX / dayWidth);
    const newDate = new Date(projectStart);
    newDate.setDate(projectStart.getDate() + diffDays);
    return newDate;
  };
  
  // Manejador de inicio de arrastre de tarea
  const handleTaskDragStart = (taskId, e) => {
    const task = projectTasks.find(t => t.id === taskId);
    if (task) {
      setDraggingTask(task);
      setStartX(e.clientX);
      e.currentTarget.style.cursor = 'grabbing';
    }
  };
  
  // Manejador de arrastre de tarea
  const handleTaskDrag = (e) => {
    if (!draggingTask) return;
    
    const dx = e.clientX - startX;
    setStartX(e.clientX);
    
    // Convertir el cambio de posición en días
    let dayWidth;
    if (viewMode === 'day') {
      dayWidth = 30 * zoom;
    } else if (viewMode === 'week') {
      dayWidth = 100 / 7 * zoom;
    } else if (viewMode === 'month') {
      dayWidth = 120 / 30 * zoom;
    }
    
    const daysDiff = Math.round(dx / dayWidth);
    
    if (daysDiff !== 0) {
      const newStartDate = new Date(draggingTask.startDate);
      const newEndDate = new Date(draggingTask.endDate);
      
      newStartDate.setDate(newStartDate.getDate() + daysDiff);
      newEndDate.setDate(newEndDate.getDate() + daysDiff);
      
      setDraggingTask({
        ...draggingTask,
        startDate: newStartDate.toISOString().split('T')[0],
        endDate: newEndDate.toISOString().split('T')[0]
      });
    }
  };
  
  // Manejador de finalización de arrastre de tarea
  const handleTaskDragEnd = () => {
    if (draggingTask) {
      updateTaskDates(
        draggingTask.id,
        draggingTask.startDate,
        draggingTask.endDate
      );
      setDraggingTask(null);
      document.body.style.cursor = 'default';
    }
  };
  
  // Manejador de inicio de redimensión de tarea
  const handleTaskResizeStart = (taskId, direction, e) => {
    e.stopPropagation();
    const task = projectTasks.find(t => t.id === taskId);
    if (task) {
      setResizingTask(task);
      setResizeDirection(direction);
      setStartX(e.clientX);
      e.currentTarget.style.cursor = direction === 'start' ? 'w-resize' : 'e-resize';
    }
  };
  
  // Manejador de redimensión de tarea
  const handleTaskResize = (e) => {
    if (!resizingTask) return;
    
    const dx = e.clientX - startX;
    setStartX(e.clientX);
    
    // Convertir el cambio de posición en días
    let dayWidth;
    if (viewMode === 'day') {
      dayWidth = 30 * zoom;
    } else if (viewMode === 'week') {
      dayWidth = 100 / 7 * zoom;
    } else if (viewMode === 'month') {
      dayWidth = 120 / 30 * zoom;
    }
    
    const daysDiff = Math.round(dx / dayWidth);
    
    if (daysDiff !== 0) {
      const newStartDate = new Date(resizingTask.startDate);
      const newEndDate = new Date(resizingTask.endDate);
      
      if (resizeDirection === 'start') {
        newStartDate.setDate(newStartDate.getDate() + daysDiff);
        // Evitar que la fecha de inicio sea posterior a la fecha de fin
        if (newStartDate < newEndDate) {
          setResizingTask({
            ...resizingTask,
            startDate: newStartDate.toISOString().split('T')[0]
          });
        }
      } else if (resizeDirection === 'end') {
        newEndDate.setDate(newEndDate.getDate() + daysDiff);
        // Evitar que la fecha de fin sea anterior a la fecha de inicio
        if (newEndDate > newStartDate) {
          setResizingTask({
            ...resizingTask,
            endDate: newEndDate.toISOString().split('T')[0]
          });
        }
      }
    }
  };
  
  // Manejador de finalización de redimensión de tarea
  const handleTaskResizeEnd = () => {
    if (resizingTask) {
      updateTaskDates(
        resizingTask.id,
        resizingTask.startDate,
        resizingTask.endDate
      );
      setResizingTask(null);
      setResizeDirection(null);
      document.body.style.cursor = 'default';
    }
  };
  
  // Manejadores de eventos de mouse para todo el documento
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingTask) {
        handleTaskDrag(e);
      } else if (resizingTask) {
        handleTaskResize(e);
      }
    };
    
    const handleMouseUp = () => {
      if (draggingTask) {
        handleTaskDragEnd();
      } else if (resizingTask) {
        handleTaskResizeEnd();
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingTask, resizingTask]);
  
  // Manejador de desplazamiento horizontal
  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft);
  };
  
  // Cambiar modo de visualización
  const changeViewMode = (mode) => {
    setViewMode(mode);
  };
  
  // Cambiar nivel de zoom
  const changeZoom = (newZoom) => {
    setZoom(newZoom);
  };
  
  // Mostrar hoy en el diagrama
  const scrollToToday = () => {
    if (scrollContainerRef.current && selectedProject) {
      const today = new Date();
      const projectStart = new Date(selectedProject.startDate);
      
      // Si hoy está dentro del rango del proyecto
      if (today >= projectStart && today <= new Date(selectedProject.endDate)) {
        const posX = getPositionX(today);
        scrollContainerRef.current.scrollLeft = posX - scrollContainerRef.current.clientWidth / 2;
      }
    }
  };
  
  if (loading) return <div className="text-center my-8">Cargando diagrama de Gantt...</div>;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }
  
  if (!selectedProject) return <div className="text-center my-8">Proyecto no encontrado</div>;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{selectedProject.name} - Diagrama de Gantt</h1>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button
              onClick={() => changeViewMode('day')}
              className={`px-3 py-1 rounded ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Día
            </button>
            <button
              onClick={() => changeViewMode('week')}
              className={`px-3 py-1 rounded ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Semana
            </button>
            <button
              onClick={() => changeViewMode('month')}
              className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Mes
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => changeZoom(0.5)}
              className={`px-3 py-1 rounded ${zoom === 0.5 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              50%
            </button>
            <button
              onClick={() => changeZoom(1)}
              className={`px-3 py-1 rounded ${zoom === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              100%
            </button>
            <button
              onClick={() => changeZoom(1.5)}
              className={`px-3 py-1 rounded ${zoom === 1.5 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              150%
            </button>
            <button
              onClick={() => changeZoom(2)}
              className={`px-3 py-1 rounded ${zoom === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              200%
            </button>
          </div>
          
          <button
            onClick={scrollToToday}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Hoy
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex">
          {/* Columna de información de tareas */}
          <div className="w-64 flex-shrink-0 border-r border-gray-200">
            <div className="p-3 font-semibold bg-gray-100 border-b border-gray-200">
              Tarea
            </div>
            
            {projectTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border-b border-gray-200 flex flex-col justify-center h-16"
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div className="font-medium truncate">{task.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Diagrama de Gantt */}
          <div
            className="flex-grow overflow-x-auto"
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            {/* Encabezado con fechas */}
            <GanttHeader
              dates={dates}
              viewMode={viewMode}
              zoom={zoom}
            />
            
            {/* Línea de tiempo con líneas de cuadrícula */}
            <GanttTimeline
              dates={dates}
              viewMode={viewMode}
              zoom={zoom}
            >
              {/* Tareas */}
              {projectTasks.map((task) => {
                const isActive = draggingTask?.id === task.id || resizingTask?.id === task.id;
                const taskToRender = 
                  draggingTask?.id === task.id ? draggingTask : 
                  resizingTask?.id === task.id ? resizingTask : 
                  task;
                
                return (
                  <GanttTask
                    key={task.id}
                    task={taskToRender}
                    positionX={getPositionX(taskToRender.startDate)}
                    width={getWidthFromDuration(taskToRender.startDate, taskToRender.endDate)}
                    onDragStart={(e) => handleTaskDragStart(task.id, e)}
                    onResizeStart={(direction, e) => handleTaskResizeStart(task.id, direction, e)}
                    isActive={isActive}
                    isHovered={hoveredTask === task.id}
                  />
                );
              })}
            </GanttTimeline>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;