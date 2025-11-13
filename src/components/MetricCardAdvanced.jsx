import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MetricCardAdvanced = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'blue',
  comparison 
}) => {
  const iconClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    teal: 'bg-teal-100 text-teal-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </h3>
        </div>
        {Icon && (
          <div className={`${iconClasses[color]} p-2.5 rounded-lg`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-gray-600 mb-3">{subtitle}</p>
      )}

      {(trend !== undefined || comparison) && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(trend)}%
            </div>
          )}

          {comparison && (
            <div className="text-xs text-gray-500">
              {comparison}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
