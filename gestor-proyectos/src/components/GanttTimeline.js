// components/GanttTimeline.js
import React from 'react';

const GanttTimeline = ({ dates, viewMode, zoom, children }) => {
  const getTimelineWidth = () => {
    if (viewMode === 'day') {
      return 30 * zoom * dates.length; // 30px por día
    } else if (viewMode === 'week') {
      return 100 * zoom * dates.length; // 100px por semana
    } else if (viewMode === 'month') {
      return 120 * zoom * dates.length; // 120px por mes
    }
  };

  const getColumnWidth = () => {
    if (viewMode === 'day') {
      return 30 * zoom; // 30px por día
    } else if (viewMode === 'week') {
      return 100 * zoom; // 100px por semana
    } else if (viewMode === 'month') {
      return 120 * zoom; // 120px por mes
    }
  };

  return (
    <div
      className="relative"
      style={{
        width: `${getTimelineWidth()}px`,
        minWidth: `${getTimelineWidth()}px`,
        height: `${Math.max(dates.length > 0 ? 40 : 0, React.Children.count(children) * 64)}px`,
      }}
    >
      {/* Líneas de cuadrícula vertical */}
      {dates.map((date, index) => (
        <div
          key={index}
          className="absolute top-0 bottom-0 border-r border-gray-200"
          style={{
            left: `${index * getColumnWidth()}px`,
            width: `${getColumnWidth()}px`,
          }}
        />
      ))}

      {/* Línea para hoy */}
      {(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDate = dates.length > 0 ? new Date(dates[0]) : null;
        const lastDate = dates.length > 0 ? new Date(dates[dates.length - 1]) : null;

        if (firstDate && lastDate && today >= firstDate && today <= lastDate) {
          let daysSinceStart = 0;
          let found = false;

          for (let i = 0; i < dates.length - 1; i++) {
            const currentDate = new Date(dates[i]);
            const nextDate = new Date(dates[i + 1]);
            
            if (today >= currentDate && today < nextDate) {
              // Calcular la posición proporcional dentro del intervalo
              const intervalDays = (nextDate - currentDate) / (1000 * 60 * 60 * 24);
              const daysIntoInterval = (today - currentDate) / (1000 * 60 * 60 * 24);
              const proportion = daysIntoInterval / intervalDays;
              
              daysSinceStart = i + proportion;
              found = true;
              break;
            }
          }

          if (!found && today >= new Date(dates[dates.length - 1])) {
            daysSinceStart = dates.length - 1;
          }

          return (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{
                left: `${daysSinceStart * getColumnWidth()}px`,
              }}
            />
          );
        }
      })()}

      {/* Contenido (tareas) */}
      {children}
    </div>
  );
};

export default GanttTimeline;