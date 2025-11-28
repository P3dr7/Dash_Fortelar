import React from 'react';

export const LeadsFunnel = ({ data }) => {
  const stages = [
    {
      id: 'abordados',
      label: 'Leads abordados',
      value: data?.abordados || 0,
      bgColor: 'bg-blue-200',
      basePercentage: 100
    },
    {
      id: 'emNegociacao',
      label: 'Em negociação',
      value: data?.emNegociacao || 0,
      bgColor: 'bg-blue-300',
      basePercentage: 80
    },
    {
      id: 'documentosEnviados',
      label: 'Documentos enviados',
      value: data?.documentosEnviados || 0,
      bgColor: 'bg-blue-500',
      basePercentage: 60
    },
    {
      id: 'comprados',
      label: 'Comprados',
      value: data?.comprados || 0,
      bgColor: 'bg-blue-600',
      basePercentage: 40
    }
  ];

  const calculatePercentage = (value, baseValue) => {
    if (!baseValue) return 0;
    return ((value / baseValue) * 100).toFixed(2);
  };

  const baseValue = stages[0].value;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Funil da Jornada de Compra</h3>
      
      <div className="flex flex-col items-center gap-0">
        {stages.map((stage, index) => {
          const percentage = calculatePercentage(stage.value, baseValue);
          const widthPercent = stage.basePercentage;
          
          return (
            <div key={stage.id} className="w-full flex flex-col items-center">
              <div 
                className={`${stage.bgColor} rounded-lg py-6 px-4 text-center transition-all duration-300 hover:scale-105 cursor-pointer`}
                style={{ width: `${widthPercent}%` }}
              >
                <div className="text-gray-900 font-medium text-base mb-1">
                  {stage.label}
                </div>
                <div className="text-gray-900 font-bold text-2xl">
                  {percentage}% ({stage.value.toLocaleString('pt-BR')})
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="h-3 w-0.5 bg-gray-200"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
