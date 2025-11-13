import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Send } from 'lucide-react';

export const EnviosPorDiaChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Envios dos Últimos 30 Dias</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  const totalEnvios = data.reduce((sum, item) => sum + item.envios, 0);
  const mediaEnvios = (totalEnvios / data.length).toFixed(1);
  const maxEnvios = Math.max(...data.map(item => item.envios));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{payload[0].payload.dia}</p>
          <p className="text-sm text-blue-600 font-medium">
            {payload[0].value} envios
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-medium text-gray-900">FD Rate</h3>
          <p className="text-xs text-gray-500 mt-0.5">Distribuição de mensagens enviadas</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">{totalEnvios}</div>
          <p className="text-xs text-gray-500">Total de envios</p>
          <p className="text-xs text-gray-500">Média: {mediaEnvios}/dia</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="dia" 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(data.length / 10)}
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }} />
          <Bar dataKey="envios" radius={[4, 4, 0, 0]} maxBarSize={24}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.envios === maxEnvios ? '#f97316' : entry.envios === 0 ? '#e5e7eb' : '#fb923c'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
