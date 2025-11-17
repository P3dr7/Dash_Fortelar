import React from 'react';
import { Users, MessageSquare, CheckCircle, FileCheck, ChevronRight } from 'lucide-react';

export const LeadsFunnel = ({ data }) => {
  const stages = [
    {
      id: 'paraAbordar',
      label: 'Leads para abordar',
      icon: Users,
      color: 'blue',
      value: data?.paraAbordar || 0
    },
    {
      id: 'abordados',
      label: 'Leads Abordados',
      icon: MessageSquare,
      color: 'purple',
      value: data?.abordados || 0
    },
    {
      id: 'processados',
      label: 'Leads processados',
      icon: CheckCircle,
      color: 'green',
      value: data?.processados || 0
    },
    {
      id: 'documentosEnviados',
      label: 'Documentos enviados',
      icon: FileCheck,
      color: 'orange',
      value: data?.documentosEnviados || 0
    }
  ];

  const maxValue = Math.max(...stages.map(s => s.value), 1);

  const getColorClasses = (color, isIcon = false) => {
    const colors = {
      blue: isIcon ? 'bg-blue-100 text-blue-600' : 'bg-blue-500',
      purple: isIcon ? 'bg-purple-100 text-purple-600' : 'bg-purple-500',
      green: isIcon ? 'bg-green-100 text-green-600' : 'bg-green-500',
      orange: isIcon ? 'bg-orange-100 text-orange-600' : 'bg-orange-500'
    };
    return colors[color] || colors.blue;
  };

  const calculateConversionRate = (index) => {
    if (index === 0) return null;
    const current = stages[index].value;
    const previous = stages[index - 1].value;
    if (previous === 0) return 0;
    return ((current / previous) * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Funil de Conversão
        </h3>
        <p className="text-xs text-gray-500 mt-1">Jornada do lead desde o contato até documentação</p>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const widthPercent = (stage.value / maxValue) * 100;
          const conversionRate = calculateConversionRate(index);

          return (
            <div key={stage.id}>
              <div className="flex items-center gap-4 mb-2">
                {/* Ícone */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClasses(stage.color, true)}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Label e Valor */}
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-medium text-gray-900">{stage.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">{stage.value.toLocaleString('pt-BR')}</span>
                      {conversionRate !== null && (
                        <span className="text-xs text-gray-500">({conversionRate}%)</span>
                      )}
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getColorClasses(stage.color)} transition-all duration-500 rounded-full`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Seta de Conexão */}
              {index < stages.length - 1 && (
                <div className="flex justify-center my-2">
                  <ChevronRight className="w-5 h-5 text-gray-300 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Estatísticas Resumidas */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {stages[stages.length - 1].value > 0 
              ? ((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(1) 
              : 0}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Taxa de Conversão Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {stages.reduce((sum, s) => sum + s.value, 0).toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total no Funil</div>
        </div>
      </div>
    </div>
  );
};
