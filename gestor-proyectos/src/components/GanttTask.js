// components/GanttTask.js
import React from 'react';

const GanttTask = ({ task, positionX, width, onDragStart, onResizeStart, isActive, isHovered }) => {
  const getProgressBarWidth = () => {
    return `${task.progress}%`;
  };

  const getTaskColor = () => {
    if (task.isDelayed && task.isDelayed()) {
      return 'bg-red-200 border-red-400';
    }
    
    switch (task.priority) {
      case 'alta':
        return 'bg-orange-200 border-orange-400';
      case 'crítica':
        return 'bg-red-200 border-red-400';
      case 'baja':
        return 'bg-green-200 border-green-400';
      default:
        return 'bg-blue-200 border-blue-400';
    }
  };

  return (
    <div
      className={`absolute h-12 rounded border ${getTaskColor()} ${isActive ? 'z-20 opacity-90' : 'z-10'} ${isHovered ? 'shadow-lg' : ''}`}
      style={{
        left: `${positionX}px`,
        width: `${Math.max(width, 10)}px`, // Mínimo 10px de ancho para facilitar la interacción
        top: `${16 + 4}px`, // 16px por fila, + 4px para centrado
      }}
      onMouseDown={onDragStart}
    >
      {/* Barra de progreso */}
      <div
        className="h-full bg-opacity-50 bg-blue-400 rounded"
        style={{ width: getProgressBarWidth() }}
      />
      
      {/* Título de la tarea */}
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center px-2">
        <span className="text-xs font-medium truncate">{task.title}</span>
      </div>
      
      {/* Controladores de redimensión */}
      {width > 20 && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-blue-400 hover:bg-opacity-20"
            onMouseDown={(e) => onResizeStart('start', e)}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-blue-400 hover:bg-opacity-20"
            onMouseDown={(e) => onResizeStart('end', e)}
          />
        </>
      )}
    </div>
  );
};

export default GanttTask;