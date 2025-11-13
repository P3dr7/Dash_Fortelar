import React from 'react';

export const ChannelDistribution = ({ leadsPorCanal, totalLeads }) => {
  const colors = ['#2563eb', '#7c3aed', '#059669', '#f59e0b', '#e11d48', '#0ea5e9'];
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-green-600 to-teal-600 rounded-full"></span>
        Distribuição por Canal
      </h3>
      <div className="space-y-5">
        {Object.entries(leadsPorCanal).map(([canal, count], index) => (
          <div key={canal} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full shadow-md" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-gray-800 capitalize font-semibold text-base">{canal}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 text-xl">{count}</div>
              <div className="text-sm text-gray-500 font-medium">
                {((count / totalLeads) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};