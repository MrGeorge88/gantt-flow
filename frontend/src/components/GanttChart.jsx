import React, { useState } from 'react';
import _ from 'lodash';
import './GanttChart.css';

const GanttApp = () => {
  // Datos de ejemplo basados en la imagen
  const initialTasks = [
    {
      id: 'phase1',
      name: 'Cyber Day Campaign - Phase 1:',
      isPhase: true,
      effort: '109h',
      startDate: '01/Apr',
      endDate: '29/Apr',
      progress: 100,
      expanded: true,
    },
    {
      id: 'task1',
      name: 'Decide theme',
      assignee: 'Alexandra Cuant',
      effort: '10h',
      startDate: '01/Apr',
      endDate: '05/Apr',
      progress: 100,
      phaseId: 'phase1',
      color: '#62B0F6',
    },
    {
      id: 'task2',
      name: 'Define campaign mechanism',
      assignee: 'Alexandra Cuant',
      effort: '30h',
      startDate: '08/Apr',
      endDate: '12/Apr',
      progress: 100,
      phaseId: 'phase1',
      color: '#5271FF',
    },
    {
      id: 'task3',
      name: 'Work on campaign\'s design',
      assignee: 'Andrew Rodriguez',
      effort: '60h',
      startDate: '09/Apr',
      endDate: '19/Apr',
      progress: 100,
      phaseId: 'phase1',
      color: '#E64A19',
    },
    {
      id: 'task4',
      name: 'Copywriting',
      assignee: 'Andrew Rodriguez',
      effort: '8h',
      startDate: '15/Apr',
      endDate: '19/Apr',
      progress: 100,
      phaseId: 'phase1',
      color: '#AB47BC',
    },
    {
      id: 'task5',
      name: 'Define landing page',
      assignee: 'Alexandra Cuant',
      effort: '11h',
      startDate: '22/Apr',
      endDate: '26/Apr',
      progress: 100,
      phaseId: 'phase1',
      color: '#2E7D32',
    },
    {
      id: 'task6',
      name: 'Set landing page live',
      assignee: 'Unassigned',
      effort: '',
      startDate: '29/Apr',
      endDate: '29/Apr',
      progress: 100,
      phaseId: 'phase1',
      color: '#4CAF50',
    },
    {
      id: 'phase2',
      name: 'Cyber Day Campaign - Phase 2:',
      isPhase: true,
      effort: '14h',
      startDate: '11/Apr',
      endDate: '19/Apr',
      progress: 100,
      expanded: true,
    },
    {
      id: 'task7',
      name: 'Prepare what should be going live first',
      assignee: 'Alexandra Cuant',
      effort: '14h',
      startDate: '11/Apr',
      endDate: '17/Apr',
      progress: 100,
      phaseId: 'phase2',
      color: '#AB47BC',
    },
    {
      id: 'task8',
      name: 'Make sure copywrite is on point',
      assignee: 'Unassigned',
      effort: '',
      startDate: '16/Apr',
      endDate: '18/Apr',
      progress: 100,
      phaseId: 'phase2',
      color: '#5271FF',
    },
    {
      id: 'phase3',
      name: 'Cyber Day Campaign Phase 3:',
      isPhase: true,
      effort: '7h',
      startDate: '15/Apr',
      endDate: '03/May',
      progress: 100,
      expanded: true,
    },
    {
      id: 'task9',
      name: 'Execute campaign',
      assignee: 'Alexandra Cuant',
      effort: '7h',
      startDate: '15/Apr',
      endDate: '19/Apr',
      progress: 100,
      phaseId: 'phase3',
      color: '#4CAF50',
    },
    {
      id: 'task10',
      name: 'Send 1st batch of emails',
      assignee: 'Unassigned',
      effort: '',
      startDate: '01/May',
      endDate: '03/May',
      progress: 100,
      phaseId: 'phase3',
      color: '#F57C00',
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [activeView] = useState('Gantt');
  
  // Filtrar tareas para mostrar solo las visibles según el estado de expansión de las fases
  const getVisibleTasks = () => {
    const expandedPhases = tasks.filter(t => t.isPhase && t.expanded).map(t => t.id);
    return tasks.filter(t => t.isPhase || expandedPhases.includes(t.phaseId));
  };
  
  // Manejar clics en las fases para expandir/colapsar
  const togglePhase = (phaseId) => {
    setTasks(tasks.map(task => 
      task.id === phaseId ? { ...task, expanded: !task.expanded } : task
    ));
  };
  
  // Generar iniciales para avatares
  const getInitials = (name) => {
    if (name === 'Unassigned') return '?';
    return name.split(' ').map(n => n[0]).join('');
  };

  // Función para convertir fechas de formato "01/Apr" a objetos Date
  const parseDate = (dateStr) => {
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const parts = dateStr.split('/');
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    
    return new Date(2019, month, day);
  };
  
  // Función para obtener el color de tarea
  const getTaskColor = (task) => {
    return task.color || '#5271FF';
  };
  
  // Configuración del diagrama de Gantt
  const ganttConfig = {
    startDate: new Date(2019, 3, 1),  // 1 de abril de 2019
    endDate: new Date(2019, 4, 15),   // 15 de mayo de 2019
    cellWidth: 24,                    // Ancho de celda en píxeles (1 día)
    rowHeight: 30,                    // Altura de fila en píxeles
    headerHeight: 50,                 // Altura del encabezado en píxeles
  };
  
  // Calcular el ancho total del gráfico
  const getDaysInRange = () => {
    const diffTime = ganttConfig.endDate.getTime() - ganttConfig.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const totalDays = getDaysInRange();
  const chartWidth = totalDays * ganttConfig.cellWidth;
  
  // Generar el encabezado del diagrama (días, semanas, meses)
  const renderGanttHeader = () => {
    const days = [];
    const weeks = [];
    const months = [];
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let currentDate = new Date(ganttConfig.startDate);
    let lastMonth = currentDate.getMonth();
    let monthStartX = 0;
    let weekNumber = Math.ceil(currentDate.getDate() / 7) + (currentDate.getDay() === 0 ? 0 : 1);
    
    for (let i = 0; i < totalDays; i++) {
      const day = currentDate.getDate();
      const month = currentDate.getMonth();
      
      // Días
      days.push(
        <text 
          key={`day-${i}`} 
          x={i * ganttConfig.cellWidth + ganttConfig.cellWidth / 2} 
          y={ganttConfig.headerHeight - 5}
          textAnchor="middle"
          fontSize="10"
        >
          {day}
        </text>
      );
      
      // Líneas verticales de cuadrícula
      days.push(
        <line 
          key={`grid-${i}`} 
          x1={i * ganttConfig.cellWidth} 
          y1={ganttConfig.headerHeight}
          x2={i * ganttConfig.cellWidth} 
          y2={ganttConfig.headerHeight + (getVisibleTasks().length * ganttConfig.rowHeight)}
          stroke="#e0e0e0"
          strokeWidth="1"
        />
      );
      
      // Semanas
      if (day === 1 || i === 0 || currentDate.getDay() === 1) { // Primer día del mes, primer día o lunes
        const weekWidth = Math.min(7, totalDays - i) * ganttConfig.cellWidth;
        
        weeks.push(
          <g key={`week-${i}`}>
            <rect 
              x={i * ganttConfig.cellWidth}
              y={ganttConfig.headerHeight - 25}
              width={weekWidth}
              height={20}
              fill="#f5f5f5"
              stroke="#e0e0e0"
            />
            <text 
              x={i * ganttConfig.cellWidth + weekWidth / 2}
              y={ganttConfig.headerHeight - 10}
              textAnchor="middle"
              fontSize="11"
            >
              W{weekNumber}
            </text>
          </g>
        );
        
        weekNumber = (weekNumber % 52) + 1;
      }
      
      // Meses
      if (month !== lastMonth || i === 0) {
        if (i > 0) {
          const monthWidth = (i * ganttConfig.cellWidth) - monthStartX;
          
          months.push(
            <g key={`month-${lastMonth}`}>
              <rect 
                x={monthStartX}
                y={0}
                width={monthWidth}
                height={20}
                fill="#e3f2fd"
                stroke="#90caf9"
              />
              <text 
                x={monthStartX + monthWidth / 2}
                y={15}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
              >
                {monthNames[lastMonth]} 2019
              </text>
            </g>
          );
        }
        
        monthStartX = i * ganttConfig.cellWidth;
        lastMonth = month;
      }
      
      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Añadir el último mes
    const monthWidth = chartWidth - monthStartX;
    months.push(
      <g key={`month-${lastMonth}`}>
        <rect 
          x={monthStartX}
          y={0}
          width={monthWidth}
          height={20}
          fill="#e3f2fd"
          stroke="#90caf9"
        />
        <text 
          x={monthStartX + monthWidth / 2}
          y={15}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
        >
          {monthNames[lastMonth]} 2019
        </text>
      </g>
    );
    
    return (
      <g>
        {months}
        {weeks}
        {days}
      </g>
    );
  };
  
  // Renderizar barras de tareas en el diagrama
  const renderTaskBars = () => {
    const visibleTasks = getVisibleTasks();
    const bars = [];
    const today = new Date(2019, 3, 15); // 15 de abril de 2019 como "hoy"
    
    // Línea vertical para "hoy"
    const todayX = Math.floor((today - ganttConfig.startDate) / (1000 * 60 * 60 * 24)) * ganttConfig.cellWidth;
    
    bars.push(
      <line 
        key="today-line"
        x1={todayX} 
        y1={0}
        x2={todayX} 
        y2={ganttConfig.headerHeight + (visibleTasks.length * ganttConfig.rowHeight)}
        stroke="#F44336"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    );
    
    // Renderizar barras para cada tarea visible
    visibleTasks.forEach((task, index) => {
      if (task.isPhase) {
        // Barra de resumen para fases
        const phaseTasks = tasks.filter(t => t.phaseId === task.id);
        if (phaseTasks.length > 0) {
          const earliestStart = _.minBy(phaseTasks, t => parseDate(t.startDate).getTime());
          const latestEnd = _.maxBy(phaseTasks, t => parseDate(t.endDate).getTime());
          
          if (earliestStart && latestEnd) {
            const startX = Math.floor((parseDate(earliestStart.startDate) - ganttConfig.startDate) / (1000 * 60 * 60 * 24)) * ganttConfig.cellWidth;
            const endX = Math.floor((parseDate(latestEnd.endDate) - ganttConfig.startDate) / (1000 * 60 * 60 * 24) + 1) * ganttConfig.cellWidth;
            const width = endX - startX;
            
            bars.push(
              <g key={`phase-${task.id}`}>
                <rect 
                  x={startX}
                  y={ganttConfig.headerHeight + (index * ganttConfig.rowHeight) + 5}
                  width={width}
                  height={ganttConfig.rowHeight - 10}
                  fill="#4B4B4B"
                  rx={3}
                  ry={3}
                />
                <text 
                  x={startX + 5}
                  y={ganttConfig.headerHeight + (index * ganttConfig.rowHeight) + ganttConfig.rowHeight / 2 + 5}
                  fontSize="12"
                  fill="white"
                >
                  {task.name}
                </text>
              </g>
            );
          }
        }
      } else {
        // Barra para tareas regulares
        const startX = Math.floor((parseDate(task.startDate) - ganttConfig.startDate) / (1000 * 60 * 60 * 24)) * ganttConfig.cellWidth;
        const endX = Math.floor((parseDate(task.endDate) - ganttConfig.startDate) / (1000 * 60 * 60 * 24) + 1) * ganttConfig.cellWidth;
        const width = endX - startX;
        
        bars.push(
          <g key={`task-${task.id}`}>
            <rect 
              x={startX}
              y={ganttConfig.headerHeight + (index * ganttConfig.rowHeight) + 5}
              width={width}
              height={ganttConfig.rowHeight - 10}
              fill={getTaskColor(task)}
              rx={3}
              ry={3}
            />
            <text 
              x={startX + 5}
              y={ganttConfig.headerHeight + (index * ganttConfig.rowHeight) + ganttConfig.rowHeight / 2 + 5}
              fontSize="12"
              fill="white"
            >
              {task.name}
            </text>
          </g>
        );
      }
    });
    
    return bars;
  };

  return (
    <div className="gantt-container">
      {/* Header con logo y título */}
      <div className="gantt-header">
        <div className="gantt-logo">
          ≡
        </div>
        <div className="gantt-title-bar">
          <div className="gantt-project-title">Email Marketing</div>
          <div>⭐</div>
        </div>
      </div>
      
      {/* Selector de vistas */}
      <div className="gantt-view-selector">
        <div className={`gantt-view-option ${activeView === 'Gantt' ? 'gantt-view-active' : ''}`}>
          📊 Gantt
        </div>
        <div className="gantt-view-option">📋 Table</div>
        <div className="gantt-view-option">📌 Board</div>
        <div className="gantt-view-option">👥 Workload</div>
        <div className="gantt-view-option">📈 Overview</div>
      </div>
      
      {/* Toolbar con botones */}
      <div className="gantt-toolbar">
        <div className="gantt-button">Export & Share ▼</div>
        <div className="gantt-button">Baselines ▼</div>
        <div className="gantt-button">Options ▼</div>
        <div className="gantt-button">Columns ▼</div>
        <div className="gantt-button">Segments ▼</div>
        <div className="gantt-spacer"></div>
        <div className="gantt-manual-button">⚡ Manual</div>
        <div className="gantt-flexer"></div>
        <div className="gantt-button">Apr 2019</div>
      </div>
      
      {/* Contenido principal */}
      <div className="gantt-content">
        {/* Panel izquierdo: Lista de tareas */}
        <div className="gantt-task-list">
          {/* Barra de búsqueda */}
          <div className="gantt-search-bar">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="gantt-search-input"
            />
          </div>
          
          {/* Cabeceras de columna */}
          <div className="gantt-column-headers">
            <div className="gantt-column-name">Task Name</div>
            <div className="gantt-column-center">Assigned</div>
            <div className="gantt-column-center">EH</div>
            <div className="gantt-column-center">Start</div>
            <div className="gantt-column-center">Due</div>
            <div className="gantt-column-center">%</div>
          </div>
          
          {/* Lista de tareas */}
          {getVisibleTasks().map(task => (
            <div 
              key={task.id} 
              className={task.isPhase ? "gantt-phase-row" : "gantt-task-row"}
              onClick={() => task.isPhase && togglePhase(task.id)}
            >
              {task.isPhase ? (
                <>
                  <div className="gantt-phase-icon">▶</div>
                  <div className="gantt-task-name">{task.name}</div>
                  <div className="gantt-column-center"></div>
                  <div className="gantt-column-center">{task.effort}</div>
                  <div className="gantt-column-center">{task.startDate}</div>
                  <div className="gantt-column-center">{task.endDate}</div>
                  <div className="gantt-column-center">{task.progress}%</div>
                </>
              ) : (
                <>
                  <input type="checkbox" className="gantt-task-checkbox" checked={task.progress === 100} readOnly />
                  <div className="gantt-task-name">{task.name}</div>
                  <div className="gantt-column-center">
                    {task.assignee !== 'Unassigned' && (
                      <div className="gantt-avatar">
                        {getInitials(task.assignee)}
                      </div>
                    )}
                  </div>
                  <div className="gantt-column-center">{task.effort}</div>
                  <div className="gantt-column-center">{task.startDate}</div>
                  <div className="gantt-column-center">{task.endDate}</div>
                  <div className="gantt-column-center">{task.progress}%</div>
                </>
              )}
            </div>
          ))}
          
          {/* Botón para añadir tarea */}
          <button className="gantt-add-button">
            + Add task
          </button>
        </div>
        
        {/* Panel derecho: Vista de Gantt */}
        <div className="gantt-view">
          <svg width={chartWidth} height={ganttConfig.headerHeight + (getVisibleTasks().length * ganttConfig.rowHeight)}>
            {renderGanttHeader()}
            {renderTaskBars()}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GanttApp;
