# Dashboard de Follow-up

Dashboard para monitoramento de métricas de follow-up em tempo real.

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── supabase.js          # Configuração do cliente Supabase
├── services/
│   └── leadsService.js      # Camada de serviço para API
├── hooks/
│   └── useLeadsData.js      # Hook customizado para gerenciar dados
├── utils/
│   └── metricsCalculator.js # Lógica de cálculo de métricas
├── components/
│   ├── Dashboard.jsx        # Componente principal
│   ├── MetricCard.jsx       # Card de métrica
│   ├── FollowUpStagesChart.jsx
│   ├── ChannelDistribution.jsx
│   ├── RecentSends.jsx
│   └── ConfigWarning.jsx
└── App.jsx                  # Componente raiz
```

## 🚀 Setup

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-anon
```

3. **Execute o projeto:**
```bash
npm run dev
```

## 🔒 Configuração do Supabase

### Row Level Security (RLS)

Execute no SQL Editor do Supabase:

```sql
-- Habilitar RLS
ALTER TABLE leads_qualificados2 ENABLE ROW LEVEL SECURITY;

-- Política de leitura (ajuste conforme suas necessidades)
CREATE POLICY "Permitir leitura para todos"
ON leads_qualificados2
FOR SELECT
USING (true);
```

## 🎯 Features

- ✅ Arquitetura modular e escalável
- ✅ Separação de responsabilidades
- ✅ Custom hooks para lógica reutilizável
- ✅ Camada de serviço para API
- ✅ Atualização em tempo real via Supabase Realtime
- ✅ Tratamento de erros robusto
- ✅ Loading states
- ✅ Variáveis de ambiente

## 📊 Métricas Calculadas

- Total de leads
- Envios do dia
- Taxa de resposta
- Leads em andamento
- Distribuição por etapa de follow-up
- Distribuição por canal
- Histórico de envios recentes