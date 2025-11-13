import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MessageSquare } from 'lucide-react';

export const MensagensHojeChart = ({ total, periodo = 'Hoje', dadosPorHora = [] }) => {
  // Usar dados reais do banco de dados por hora
  const horasData = dadosPorHora.length > 0 ? dadosPorHora : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{payload[0].payload.hora}</p>
          <p className="text-sm text-green-600 font-medium">
            {payload[0].value} mensagens
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
          <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            Mensagens Enviadas - {periodo}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Distribuição por hora</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{total}</div>
          <p className="text-xs text-gray-500">Total do período</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={horasData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="hora" 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(horasData.length / 6)}
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }} />
          <Bar dataKey="mensagens" radius={[4, 4, 0, 0]} maxBarSize={24}>
            {horasData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="#22c55e"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
