import React from 'react';
import { sortFollowUpStages } from '../utils/metricsCalculator';

export const FollowUpStagesChart = ({ followUpsPorEtapa, totalLeads }) => {
  const sortedStages = sortFollowUpStages(followUpsPorEtapa);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
        Follow-ups por Etapa
      </h3>
      <div className="space-y-5">
        {sortedStages.map(([etapa, count]) => (
          <div key={etapa}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 font-semibold">{etapa}</span>
              <span className="font-bold text-gray-900 text-base">{count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${(count / totalLeads) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};