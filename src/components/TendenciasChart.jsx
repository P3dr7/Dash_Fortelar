import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TendenciasChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Estoque e Margin</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  // Criar dados acumulados para linha crescente
  const dadosAcumulados = [];
  let totalAcumulado = 0;
  let ativosAcumulado = 0;
  let inativosAcumulado = 0;

  data.forEach((item) => {
    totalAcumulado += item.total;
    ativosAcumulado += item.ativos;
    inativosAcumulado += item.inativos;

    dadosAcumulados.push({
      dia: item.dia,
      total: totalAcumulado,
      ativos: ativosAcumulado,
      inativos: inativosAcumulado
    });
  });

  const primeiro = dadosAcumulados[0]?.total || 0;
  const ultimo = dadosAcumulados[dadosAcumulados.length - 1]?.total || 0;
  const variacao = ultimo - primeiro;
  const media = (ultimo / dadosAcumulados.length).toFixed(1);
  const variacaoPercentual = primeiro > 0 ? ((variacao / primeiro) * 100).toFixed(1) : 100;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-medium text-gray-900">Estoque e Margin</h3>
          <p className="text-xs text-gray-500 mt-0.5">Crescimento acumulado de leads</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
            <TrendingUp className="w-4 h-4" />
            +{variacaoPercentual}%
          </div>
          <p className="text-xs text-gray-500">Média: {media}/dia</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={dadosAcumulados} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="colorAtivos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="dia" 
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTotal)" 
            name="Total Acumulado"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
