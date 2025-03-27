// components/GanttHeader.js
import React from 'react';

const GanttHeader = ({ dates, viewMode, zoom }) => {
  const getHeaderWidth = () => {
    if (viewMode === 'day') {
      return 30 * zoom; // 30px por día
    } else if (viewMode === 'week') {
      return 100 * zoom; // 100px por semana
    } else if (viewMode === 'month') {
      return 120 * zoom; // 120px por mes
    }
  };

  const formatHeaderDate = (date) => {
    if (viewMode === 'day') {
      return new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    } else if (viewMode === 'week') {
      return `Semana ${getWeekNumber(date)}`;
    } else if (viewMode === 'month') {
      return new Date(date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  return (
    <div className="h-12 bg-gray-100 border-b border-gray-200 flex">
      {dates.map((date, index) => (
        <div
          key={index}
          className="border-r border-gray-200 flex items-center justify-center text-sm"
          style={{
            width: `${getHeaderWidth()}px`,
            minWidth: `${getHeaderWidth()}px`,
          }}
        >
          {formatHeaderDate(date)}
        </div>
      ))}
    </div>
  );
};

export default GanttHeader;