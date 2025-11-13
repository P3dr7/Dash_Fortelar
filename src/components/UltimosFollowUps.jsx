import React from 'react';
import { Send, Clock, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const UltimosFollowUps = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-500" />
          Últimos Follow-ups Enviados
        </h3>
        <div className="text-center py-8 text-gray-400 text-sm">
          Nenhum follow-up enviado ainda
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-500" />
          Últimos Follow-ups Enviados
        </h3>
        <p className="text-xs text-gray-500 mt-1">Histórico dos 10 últimos envios</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Lead</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Telefone</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Follow-up</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Situação</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.nome}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    {item.telefone}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {item.followUp}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    {format(item.dataEnvio, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.situacao === 'ativo' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.situacao}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
