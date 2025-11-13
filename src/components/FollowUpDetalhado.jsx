import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare } from 'lucide-react';

export const FollowUpDetalhado = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Follow-up Detalhado</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([name, stats]) => ({
    name,
    enviados: stats.enviados,
    respondidos: stats.respondidos,
    pendentes: stats.pendentes
  }));

  const totais = chartData.reduce((acc, item) => ({
    enviados: acc.enviados + item.enviados,
    respondidos: acc.respondidos + item.respondidos,
    pendentes: acc.pendentes + item.pendentes
  }), { enviados: 0, respondidos: 0, pendentes: 0 });

  const taxaResposta = totais.enviados > 0 
    ? ((totais.respondidos / totais.enviados) * 100).toFixed(1) 
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Follow-up Detalhado
          </h3>
          <p className="text-xs text-gray-500 mt-1">Status por etapa de follow-up</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{totais.enviados}</span>
            <span className="text-gray-500 text-xs ml-1">enviados</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{totais.respondidos}</span>
            <span className="text-gray-500 text-xs ml-1">respondidos</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{totais.pendentes}</span>
            <span className="text-gray-500 text-xs ml-1">pendentes</span>
          </div>
          <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
            Taxa de resposta: {taxaResposta}%
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={{ stroke: '#e5e7eb' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar dataKey="enviados" fill="#3b82f6" name="Enviados" radius={[4, 4, 0, 0]} />
          <Bar dataKey="respondidos" fill="#10b981" name="Respondidos" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pendentes" fill="#f59e0b" name="Pendentes" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Estatísticas por etapa */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {chartData.map((item, index) => {
          const total = item.enviados + item.respondidos + item.pendentes;
          const taxaRespostaEtapa = item.enviados > 0 
            ? ((item.respondidos / item.enviados) * 100).toFixed(0) 
            : 0;
          
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs font-semibold text-gray-700 mb-1">{item.name}</div>
              <div className="text-lg font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-600">
                Taxa: {taxaRespostaEtapa}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
