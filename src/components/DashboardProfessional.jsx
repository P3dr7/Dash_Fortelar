import React, { useState } from 'react';
import { 
  RefreshCw, 
  Users, 
  MessageSquare,
  Send,
  FileCheck,
  Radio,
  Heart,
  Baby,
  Home,
  UserX,
  AlertCircle
} from 'lucide-react';
import { useLeadsData } from '../hooks/useLeadsData';
import { DateRangeFilter } from './DateRangeFilter';
import { TendenciasChart } from './TendenciasChart';
import { EnviosPorDiaChart } from './EnviosPorDiaChart';
import { DistribuicaoPieChart } from './DistribuicaoPieChart';
import { MensagensHojeChart } from './MensagensHojeChart';
import { UltimosFollowUps } from './UltimosFollowUps';
import { LeadsPorEtapa } from './LeadsPorEtapa';
import { LeadsFunnel } from './LeadsFunnel';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DashboardProfessional = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null, label: 'Todos os períodos' });
  const { metrics, loading, error, refetch, lastUpdate } = useLeadsData(dateRange);

  console.log('Dashboard State:', { loading, error, hasMetrics: !!metrics });

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  if (error) {
    console.error('Dashboard Error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-xl mx-auto mb-4">
            <UserX className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Erro ao carregar dados</h3>
          <p className="text-sm text-gray-500 text-center mb-6">{error}</p>
          <button
            onClick={refetch}
            className="w-full bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-sm font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Fortalar</h1>
            {lastUpdate && (
              <p className="text-sm text-gray-500 mt-1">
                Atualizado {format(lastUpdate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>            <div className="flex items-center gap-3">
              <DateRangeFilter onRangeChange={handleDateRangeChange} />
              <button
                onClick={refetch}
                disabled={loading}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Layout Principal: Cards à esquerda + Gráficos à direita */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Coluna Esquerda - Cards de Métricas */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Card Total de Leads */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500 font-medium">TOTAL DE LEADS</h3>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">{metrics.total.toLocaleString('pt-BR')}</div>
              <div className="text-xs text-gray-500">Cadastrados no sistema</div>
            </div>

            {/* Card Total de Mensagens Enviadas (SEMPRE TOTAL GERAL) */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-sm text-gray-500 font-medium mb-2">TOTAL DE MENSAGENS</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">{metrics.totalMensagensEnviadas?.toLocaleString('pt-BR') || 0}</div>
              <div className="text-xs text-gray-500">Total geral enviadas</div>
            </div>

            {/* Card Mensagens do Período */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500 font-medium">MENSAGENS DO PERÍODO</h3>
                {metrics.comparativoPeriodo?.variacaoPercentual !== undefined && (
                  <span className={`text-xs font-medium ${metrics.comparativoPeriodo.variacaoPercentual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.comparativoPeriodo.variacaoPercentual >= 0 ? '↑' : '↓'} {Math.abs(metrics.comparativoPeriodo.variacaoPercentual)}%
                  </span>
                )}
              </div>
              <div className="text-4xl font-bold text-green-600 mb-1">{metrics.mensagensEnviadasPeriodo?.toLocaleString('pt-BR') || 0}</div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                  {dateRange.label}
                </span>
              </div>
            </div>

            {/* Card Leads Ativos */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-sm text-gray-500 font-medium mb-2">LEADS ATIVOS</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">{metrics.totalAtivos.toLocaleString('pt-BR')}</div>
              <div className="text-xs text-gray-500">{metrics.taxaConversao}% do total</div>
            </div>

            {/* Card Documentos Aprovados */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-sm text-gray-500 font-medium mb-2">DOCS APROVADOS</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">{metrics.docsAprovados?.toLocaleString('pt-BR') || 0}</div>
              <div className="text-xs text-gray-500">Documentos verificados</div>
            </div>

            {/* Card Já Processados */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-sm text-gray-500 font-medium mb-2">JÁ PROCESSADOS</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">{metrics.jaProcessados.toLocaleString('pt-BR')}</div>
              <div className="text-xs text-gray-500">Leads finalizados</div>
            </div>
          </div>

          {/* Coluna Direita - Gráficos */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Gráficos em Grid 2 colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DistribuicaoPieChart
                data={metrics.porCanal}
                title="Distribuição por Canal"
                subtitle="Origem dos leads"
              />
              
              <MensagensHojeChart 
                total={metrics.mensagensEnviadasPeriodo || 0} 
                periodo={dateRange.label}
                dadosPorHora={metrics.mensagensPorHoraData || []}
              />
            </div>

            {/* Gráfico Grande de Tendências */}
            <div className="col-span-2">
              <TendenciasChart data={metrics.tendenciasDiarias} />
            </div>

            {/* Gráficos de Pizza Menores */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DistribuicaoPieChart
                data={metrics.porEstadoCivil}
                title="Estado Civil"
                subtitle="Perfil dos leads"
              />

              <DistribuicaoPieChart
                data={metrics.porFilhosMenores}
                title="Filhos Menores"
                subtitle="Estrutura familiar"
              />

              <DistribuicaoPieChart
                data={metrics.porPrimeiroFinanciamento}
                title="Primeiro Financiamento"
                subtitle="Experiência prévia"
              />
            </div>
          </div>
        </div>

        {/* Funil de Conversão e Leads por Etapa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LeadsFunnel data={metrics.funnelData || {}} />
          <LeadsPorEtapa data={metrics.leadsPorEtapaFollowUp || {}} />
        </div>

        {/* Últimos Follow-ups Enviados (Full Width) */}
        <div className="mb-6">
          <UltimosFollowUps data={metrics.ultimosFollowUps || []} />
        </div>
      </div>
    </div>
  );
};