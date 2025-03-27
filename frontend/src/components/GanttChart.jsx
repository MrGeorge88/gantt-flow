import React, { useState } from 'react';
import _ from 'lodash';

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
    <div className="flex flex-col h-screen font-sans">
      {/* Header con logo y título */}
      <div className="flex p-3 border-b border-gray-200 bg-white items-center">
        <div className="w-10 h-10 bg-indigo-900 rounded flex justify-center items-center text-white mr-4">
          ≡
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="text-lg font-bold">Email Marketing</div>
          <div>⭐</div>
        </div>
      </div>
      
      {/* Selector de vistas */}
      <div className="flex border-b border-gray-200 px-4">
        <div className={`py-2 px-4 cursor-pointer relative ${activeView === 'Gantt' ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : ''}`}>
          📊 Gantt
        </div>
        <div className="py-2 px-4 cursor-pointer">📋 Table</div>
        <div className="py-2 px-4 cursor-pointer">📌 Board</div>
        <div className="py-2 px-4 cursor-pointer">👥 Workload</div>
        <div className="py-2 px-4 cursor-pointer">📈 Overview</div>
      </div>
      
      {/* Toolbar con botones */}
      <div className="flex p-2 border-b border-gray-200 bg-gray-100 items-center">
        <div className="px-3 py-1.5 border border-gray-300 rounded bg-white mr-2 flex items-center text-sm">
          Export & Share ▼
        </div>
        <div className="px-3 py-1.5 border border-gray-300 rounded bg-white mr-2 flex items-center text-sm">
          Baselines ▼
        </div>
        <div className="px-3 py-1.5 border border-gray-300 rounded bg-white mr-2 flex items-center text-sm">
          Options ▼
        </div>
        <div className="px-3 py-1.5 border border-gray-300 rounded bg-white mr-2 flex items-center text-sm">
          Columns ▼
        </div>
        <div className="px-3 py-1.5 border border-gray-300 rounded bg-white mr-2 flex items-center text-sm">
          Segments ▼
        </div>
        <div className="w-5"></div>
        <div className="px-3 py-1.5 rounded bg-yellow-200 mr-2 flex items-center text-sm">
          ⚡ Manual
        </div>
        <div className="flex-1"></div>
        <div className="px-3 py-1.5 border border-gray-300 rounded bg-white text-sm">
          Apr 2019
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel izquierdo: Lista de tareas */}
        <div className="w-2/5 overflow-auto border-r border-gray-200">
          {/* Barra de búsqueda */}
          <div className="flex items-center p-3 border-b border-gray-200">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full p-1.5 border border-gray-300 rounded"
            />
          </div>
          
          {/* Cabeceras de columna */}
          <div className="flex p-3 border-b border-gray-200 bg-gray-50 font-bold text-sm">
            <div className="flex-3">Task Name</div>
            <div className="flex-1 text-center">Assigned</div>
            <div className="flex-1 text-center">EH</div>
            <div className="flex-1 text-center">Start</div>
            <div className="flex-1 text-center">Due</div>
            <div className="flex-1 text-center">%</div>
          </div>
          
          {/* Lista de tareas */}
          {getVisibleTasks().map(task => (
            <div 
              key={task.id} 
              className={`flex ${task.isPhase ? 'bg-gray-100 font-bold p-2.5 border-b border-gray-300' : 'p-2 border-b border-gray-100'} items-center`}
              onClick={() => task.isPhase && togglePhase(task.id)}
            >
              {task.isPhase ? (
                <>
                  <div className="mr-2.5">▶</div>
                  <div className="flex-3">{task.name}</div>
                  <div className="flex-1"></div>
                  <div className="flex-1 text-center">{task.effort}</div>
                  <div className="flex-1 text-center">{task.startDate}</div>
                  <div className="flex-1 text-center">{task.endDate}</div>
                  <div className="flex-1 text-center">{task.progress}%</div>
                </>
              ) : (
                <>
                  <input type="checkbox" className="mr-2.5" checked={task.progress === 100} readOnly />
                  <div className="flex-3">{task.name}</div>
                  <div className="flex-1 flex justify-center">
                    {task.assignee !== 'Unassigned' && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex justify-center items-center text-white text-xs font-bold">
                        {getInitials(task.assignee)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center">{task.effort}</div>
                  <div className="flex-1 text-center">{task.startDate}</div>
                  <div className="flex-1 text-center">{task.endDate}</div>
                  <div className="flex-1 text-center">{task.progress}%</div>
                </>
              )}
            </div>
          ))}
          
          {/* Botón para añadir tarea */}
          <button className="m-3 px-3 py-1.5 bg-blue-500 text-white border-none rounded cursor-pointer">
            + Add task
          </button>
        </div>
        
        {/* Panel derecho: Vista de Gantt */}
        <div className="w-3/5 overflow-auto">
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
