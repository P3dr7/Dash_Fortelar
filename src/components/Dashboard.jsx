import React from 'react';
import { RefreshCw, Send, Users, MessageSquare, Clock, Wifi, WifiOff } from 'lucide-react';
import { useLeadsData } from '../hooks/useLeadsData';
import { MetricCard } from './MetricCard';
import { FollowUpStagesChart } from './FollowUpStagesChart';
import { ChannelDistribution } from './ChannelDistribution';
import { RecentSends } from './RecentSends';
import { ConfigWarning } from './ConfigWarning';

export const Dashboard = () => {
  const { metrics, loading, error, refetch, realtimeEnabled, lastUpdate } = useLeadsData();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const showConfigWarning = import.meta.env.VITE_SUPABASE_URL?.includes('seu-projeto');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Follow-up</h1>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-gray-600 text-lg">Monitoramento em tempo real dos envios</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-xs shadow-sm border border-gray-200">
                  {realtimeEnabled ? (
                    <>
                      <Wifi size={14} className="text-green-500" />
                      <span className="text-green-600 font-semibold">Realtime</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} className="text-blue-500" />
                      <span className="text-blue-600 font-semibold">Polling 30s</span>
                    </>
                  )}
                </div>
                {lastUpdate && (
                  <span className="text-xs text-gray-500 font-medium">
                    Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        {/* Métricas Principais - Imobiliária */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
          <MetricCard
            title="Total de Leads"
            value={metrics.totalLeads}
            icon={Users}
            color="#2563eb"
            subtitle="Leads cadastrados"
          />
          <MetricCard
            title="Envios Hoje"
            value={metrics.enviosHoje}
            icon={Send}
            color="#059669"
            subtitle="Followups enviados hoje"
          />
          <MetricCard
            title="Taxa de Resposta"
            value={`${metrics.taxaResposta}%`}
            icon={MessageSquare}
            color="#f59e0b"
            subtitle="% de respostas recebidas"
          />
          <MetricCard
            title="Em Andamento"
            value={metrics.emAndamento}
            icon={Clock}
            color="#7c3aed"
            subtitle="Leads em negociação"
          />
          <MetricCard
            title="Taxa de Conversão"
            value={`${metrics.taxaConversao}%`}
            icon={Wifi}
            color="#e11d48"
            subtitle="% convertidos em venda"
          />
          <MetricCard
            title="Leads sem Followup"
            value={metrics.totalLeads - metrics.totalEnvios}
            icon={WifiOff}
            color="#64748b"
            subtitle="Leads sem nenhum contato"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <FollowUpStagesChart
            followUpsPorEtapa={metrics.followUpsPorEtapa}
            totalLeads={metrics.totalLeads}
          />
          <ChannelDistribution
            leadsPorCanal={metrics.leadsPorCanal}
            totalLeads={metrics.totalLeads}
          />
        </div>
        
        {/* Métricas Avançadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <MetricCard
            title="Total de Envios"
            value={metrics.totalEnvios}
            icon={Send}
            color="#0ea5e9"
            subtitle="Todos os followups enviados"
          />
          <MetricCard
            title="Respostas Recebidas"
            value={metrics.respostasRecebidas}
            icon={MessageSquare}
            color="#22c55e"
            subtitle="Total de respostas dos leads"
          />
        </div>

        {/* Últimos Envios */}
        <RecentSends ultimosEnvios={metrics.ultimosEnvios} />

        {/* Aviso de Configuração */}
        <ConfigWarning show={showConfigWarning} />
      </div>
    </div>
  );
};
