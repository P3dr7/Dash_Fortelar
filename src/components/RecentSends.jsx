import React from 'react';

export const RecentSends = ({ ultimosEnvios }) => {
  const getStatusStyle = (status) => {
    if (status?.toLowerCase().includes('respondeu')) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    if (status?.toLowerCase().includes('enviado')) {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    }
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-orange-600 to-red-600 rounded-full"></span>
        Últimos Envios
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-4 text-gray-700 font-bold text-base">Nome</th>
              <th className="text-left py-4 px-4 text-gray-700 font-bold text-base">Etapa</th>
              <th className="text-left py-4 px-4 text-gray-700 font-bold text-base">Data/Hora</th>
              <th className="text-left py-4 px-4 text-gray-700 font-bold text-base">Status</th>
            </tr>
          </thead>
          <tbody>
            {ultimosEnvios.map((envio, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors">
                <td className="py-4 px-4 text-gray-900 font-semibold">{envio.nome}</td>
                <td className="py-4 px-4 text-gray-700 font-medium">Follow-up {envio.etapa}</td>
                <td className="py-4 px-4 text-gray-600 font-medium">
                  {new Date(envio.data).toLocaleString('pt-BR')}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(envio.status)}`}>
                    {envio.status || 'Enviado'}
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