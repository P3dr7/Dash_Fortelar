import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export const LeadsPorEtapa = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Leads por Etapa de Follow-up</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  // Transformar dados para o formato do gráfico
  const chartData = Object.entries(data)
    .map(([etapa, quantidade]) => ({
      etapa: etapa.replace('Follow-up ', 'FU'),
      etapaCompleta: etapa,
      quantidade
    }))
    .sort((a, b) => {
      // Colocar "Sem follow-up" no final
      if (a.etapa === 'Sem follow-up') return 1;
      if (b.etapa === 'Sem follow-up') return -1;
      // Ordenar por número de follow-up
      const numA = parseInt(a.etapa.replace('Follow-Up', '')) || 0;
      const numB = parseInt(b.etapa.replace('Follow-Up', '')) || 0;
      return numA - numB;
    });

  const totalLeads = chartData.reduce((sum, item) => sum + item.quantidade, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalLeads) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{payload[0].payload.etapaCompleta}</p>
          <p className="text-sm text-blue-600 font-medium">
            {payload[0].value} leads ({percentage}%)
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
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Leads por Etapa de Follow-up
          </h3>
          <p className="text-xs text-gray-500 mt-1">Distribuição dos leads em cada etapa</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{totalLeads}</div>
          <p className="text-xs text-gray-500">Total de leads</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="etapa" 
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar dataKey="quantidade" radius={[6, 6, 0, 0]} maxBarSize={50}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda com números */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {chartData.slice(0, 8).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-gray-600">
              {item.etapaCompleta}: <span className="font-semibold">{item.quantidade}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
