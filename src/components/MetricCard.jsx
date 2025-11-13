import React from 'react';

export const MetricCard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 border-l-[6px] hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-bold tracking-wide mb-2 uppercase">{title}</p>
          <p className="text-5xl font-black mt-1 mb-2" style={{ color }}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-2 font-medium">{subtitle}</p>}
        </div>
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-opacity-10 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: color }}>
          {Icon && <Icon size={36} style={{ color }} className="opacity-90" />}
        </div>
      </div>
    </div>
  );
};