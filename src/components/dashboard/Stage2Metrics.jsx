import React from 'react';
import MetricCard from './MetricCard';
import CostFunnel from './CostFunnel';
import SectorBenchmark from './SectorBenchmark';
import SalesMetrics from './SalesMetrics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Stage2Metrics({ data, history = [], allStageData = [], clientSector, clients, allClientStageData }) {
  if (!data) return null;

  const cplStatus = data.cpl_client <= data.cpl_market ? 'success' : 
                    data.cpl_client <= data.cpl_market * 1.2 ? 'warning' : 'danger';
  
  const frequencyStatus = data.frequency >= 2 ? 'success' :
                          data.frequency >= 1.5 ? 'warning' : 'danger';

  const cplImprovement = data.cpl_market && data.cpl_client ? 
    ((data.cpl_market - data.cpl_client) / data.cpl_market * 100) : null;

  const totalInvestment = (data.investment_lead_generation || 0) + (data.investment_brand_awareness || 0);
  const expectedLeads = (data.investment_lead_generation || data.investment_ads) && data.cpl_market ? 
    Math.round((data.investment_lead_generation || data.investment_ads) / data.cpl_market) : null;

  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* SEPARAÇÃO 01 - GERAÇÃO DE LEADS */}
      {/* ============================================ */}
      <div className="space-y-6">
        <div className="border-l-4 border-purple-600 pl-4">
          <h2 className="text-2xl font-bold text-slate-800">Geração de Leads</h2>
          <p className="text-sm text-slate-600">Métricas de aquisição e eficiência</p>
        </div>

        {/* Funil de Custos */}
        <CostFunnel currentStage={2} data={data} allStageData={allStageData} />
        
        {/* Mensagem de Parabéns */}
        {cplImprovement > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎉</div>
              <div>
                <p className="text-lg font-bold text-green-800">
                  Parabéns! Você está {Math.round(cplImprovement)}% acima da meta do mercado
                </p>
                <p className="text-sm text-green-700">
                  Seu CPL de R$ {data.cpl_client?.toFixed(2)} é significativamente melhor que o mercado (R$ {data.cpl_market?.toFixed(2)})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resultado Principal */}
        <div className="space-y-4">
          {/* Você Cliente Base Tech (Premium - Preto com Dourado) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-2xl p-6 shadow-xl relative overflow-hidden border border-amber-500/30">
            {/* Brilho de fundo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="text-amber-400 text-lg font-black">Você Cliente Base Tech</p>
                    <p className="text-amber-500/70 text-xs">Resultado superior</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-amber-400 text-xs font-bold">⭐ PREMIUM</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                  <p className="text-amber-400/80 text-xs mb-2">Investimento</p>
                  <p className="text-2xl font-bold text-white">R$ {(data.investment_lead_generation || data.investment_ads || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                  <p className="text-amber-400/80 text-xs mb-2">Total de Leads</p>
                  <p className="text-2xl font-bold text-white">{data.leads_whatsapp || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-sm rounded-xl p-4 border border-amber-400/40">
                  <p className="text-amber-300 text-xs mb-2">CPL</p>
                  <p className="text-2xl font-bold text-amber-400">R$ {data.cpl_client?.toFixed(2) || '0,00'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Você com Outras Agências (Negativo) */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 shadow-lg border border-slate-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-300/50"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-400 flex items-center justify-center opacity-50">
                    <span className="text-2xl">📉</span>
                  </div>
                  <div>
                    <p className="text-slate-700 text-lg font-bold">Você com Outras Agências</p>
                    <p className="text-slate-500 text-xs">Resultado médio de mercado</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/60 rounded-xl p-4 border border-slate-300/50">
                  <p className="text-slate-600 text-xs mb-2">Investimento</p>
                  <p className="text-xl font-semibold text-slate-700">R$ {(data.investment_lead_generation || data.investment_ads || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4 border border-slate-300/50">
                  <p className="text-slate-600 text-xs mb-2">Total de Leads</p>
                  <p className="text-xl font-semibold text-slate-700">{expectedLeads || 0}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="text-red-500">↓</span> Menos leads
                  </p>
                </div>
                <div className="bg-white/60 rounded-xl p-4 border border-slate-300/50">
                  <p className="text-slate-600 text-xs mb-2">CPL Mercado</p>
                  <p className="text-xl font-semibold text-slate-700">R$ {data.cpl_market?.toFixed(2) || '0,00'}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="text-red-500">↑</span> Mais caro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referências de CPL */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            💎 Referências de CPL
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="CPL Mercado"
              value={data.cpl_market}
              prefix="R$ "
              subtitle="Referência de mercado"
            />
            <MetricCard
              title="CPL Base Tech"
              value={data.cpl_basetech}
              prefix="R$ "
              subtitle="Meta interna"
            />
            <MetricCard
              title="CPL Cliente"
              value={data.cpl_client?.toFixed(2)}
              prefix="R$ "
              meta={data.cpl_market?.toFixed(2)}
              status={cplStatus}
              improvement={cplImprovement ? Math.round(cplImprovement) : null}
              subtitle={cplStatus === 'success' ? "✓ Meta batida!" : "Abaixo da meta"}
            />
            <SectorBenchmark 
              clientSector={clientSector}
              clients={clients}
              allStageData={allClientStageData}
              stage={2}
              metric="cpl_client"
              metricLabel="R$"
            />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SEPARAÇÃO 02 - RECONHECIMENTO DA MARCA */}
      {/* ============================================ */}
      <div className="space-y-6">
        <div className="border-l-4 border-blue-600 pl-4">
          <h2 className="text-2xl font-bold text-slate-800">Reconhecimento da Marca</h2>
          <p className="text-sm text-slate-600">Alcance, impressões e frequência</p>
        </div>

        {/* Alcance e Entrega de Mídia */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            📢 Alcance e Entrega de Mídia
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white">
              <p className="text-green-100 text-sm font-semibold mb-3 uppercase">Investimento</p>
              <p className="text-4xl font-black mb-1">R$ {(data.investment_brand_awareness || data.investment_ads || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-green-100">em reconhecimento</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <p className="text-slate-500 text-sm font-semibold mb-3 uppercase">Alcance</p>
              <p className="text-4xl font-black text-slate-900 mb-1">{data.reach?.toLocaleString() || 0}</p>
              <p className="text-xs text-slate-500">pessoas alcançadas</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <p className="text-slate-500 text-sm font-semibold mb-3 uppercase">Impressões</p>
              <p className="text-4xl font-black text-slate-900 mb-1">{data.impressions?.toLocaleString() || 0}</p>
              <p className="text-xs text-slate-500">visualizações de anúncios</p>
            </div>
          </div>
        </div>

        {/* Qualidade de Entrega (Frequência) */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            ⚡ Qualidade de Entrega (Frequência)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Velocímetro */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 overflow-hidden">
              <p className="text-slate-700 text-sm font-semibold mb-3 text-center">Frequência Média</p>
              <div className="relative w-full max-w-xs mx-auto">
                <svg viewBox="0 0 200 110" className="w-full h-auto">
                  {/* Background arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#frequencyGradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min((data.frequency || 0) / 4 * 251.2, 251.2)} 251.2`}
                  />
                  
                  {/* Ponteiro da Meta (2.0) */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 65 * Math.cos(Math.PI - (2 / 4 * Math.PI))}
                    y2={100 - 65 * Math.sin(Math.PI - (2 / 4 * Math.PI))}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                  
                  {/* Ponteiro da Frequência Atual */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 65 * Math.cos(Math.PI - (Math.min(data.frequency || 0, 4) / 4 * Math.PI))}
                    y2={100 - 65 * Math.sin(Math.PI - (Math.min(data.frequency || 0, 4) / 4 * Math.PI))}
                    stroke={frequencyStatus === 'success' ? '#10b981' : frequencyStatus === 'warning' ? '#f59e0b' : '#ef4444'}
                    strokeWidth="2.5"
                  />
                  <circle cx="100" cy="100" r="4" fill="#1e293b" />
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="frequencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  
                  {/* Labels */}
                  <text x="20" y="108" fontSize="9" fill="#64748b" textAnchor="middle">0</text>
                  <text x="100" y="25" fontSize="9" fill="#64748b" textAnchor="middle">2.0</text>
                  <text x="180" y="108" fontSize="9" fill="#64748b" textAnchor="middle">4.0</text>
                </svg>
              </div>
              <div className="text-center mt-3">
                <p className="text-3xl font-bold text-slate-800">{data.frequency?.toFixed(1) || '0.0'}x</p>
                <p className="text-xs text-slate-500 mt-1">
                  {frequencyStatus === 'success' ? "✓ Meta atingida!" : `Meta: 2.0x`}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-slate-400 border-t-2 border-dashed border-slate-400"></div>
                  <span className="text-slate-600">Meta</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-1 ${frequencyStatus === 'success' ? 'bg-green-600' : frequencyStatus === 'warning' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                  <span className="text-slate-600">Atual</span>
                </div>
              </div>
            </div>

            {/* Explicação */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-700 mb-3">📊 Sobre a Frequência</p>
              <p className="text-xs text-slate-600 mb-3">
                A frequência indica quantas vezes, em média, seu público-alvo foi impactado pelos anúncios.
              </p>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-xs font-semibold text-purple-700 mb-1">🎯 Meta Ideal</p>
                <p className="text-xs text-slate-600">
                  A meta mínima é <strong>2.0x</strong> para garantir memorização da marca e aumentar as chances de conversão.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dados Acumulados & Evolução */}
      {((data.accumulated_investment || data.cpl_accumulated) || history.length > 1) && (
        <div className="space-y-6 pt-6 border-t-2 border-slate-200">
          {/* Dados Acumulados */}
          {(data.accumulated_investment || data.cpl_accumulated) && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                📊 Dados Acumulados
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.accumulated_investment && (
                  <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                    <p className="text-sm text-blue-600 mb-1">Investimento Acumulado</p>
                    <p className="text-2xl font-bold text-blue-700">R$ {data.accumulated_investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}
                {data.cpl_accumulated && (
                  <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5">
                    <p className="text-sm text-purple-600 mb-1">CPL Acumulado</p>
                    <p className="text-2xl font-bold text-purple-700">R$ {data.cpl_accumulated.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      )}

      {/* Resultados de Vendas */}
      <SalesMetrics data={data} allStageData={allStageData} stage={2} />

      {/* Projeção para Próxima Etapa */}
      {(data.projection_mql_quantity || data.projection_mql_cost) && (
        <div className="space-y-6 pt-6 border-t-2 border-slate-200">
          <div className="border-l-4 border-indigo-600 pl-4">
            <h2 className="text-2xl font-bold text-slate-800">🎯 Projeção para Etapa 3 (MQL)</h2>
            <p className="text-sm text-slate-600">Entenda a diferença entre Lead e MQL</p>
          </div>

          {/* Explicação Visual do Funil */}
          <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <h4 className="text-slate-800 font-bold text-xl">
                Da Geração à Qualificação: Entenda o Processo
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Lead Normal (WhatsApp) */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h5 className="font-black text-purple-800 text-xl mb-1">Lead Normal</h5>
                  <p className="text-xs text-slate-500 font-medium">(Etapa 2)</p>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-xs">✓</span>
                    </div>
                    <p>Entra direto pelo WhatsApp</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-xs">✓</span>
                    </div>
                    <p>Sem triagem</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-xs">✓</span>
                    </div>
                    <p>Contato rápido</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center mb-1 font-medium">Custo por Lead (CPL)</p>
                  <p className="text-3xl font-black text-purple-700 text-center">R$ {data.cpl_client?.toFixed(2) || '0,00'}</p>
                </div>
              </div>

              {/* Seta de Transformação */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="text-7xl text-slate-300">→</div>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg">
                  TRIAGEM POR FORMULÁRIO
                </div>
                <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 text-center font-semibold">
                    Custo aumenta <span className="text-indigo-600 font-black text-base">4x</span>
                  </p>
                </div>
              </div>

              {/* MQL (Marketing Qualified Lead) */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h5 className="font-black text-indigo-800 text-xl mb-1">MQL</h5>
                  <p className="text-xs text-slate-500 font-medium">(Etapa 3)</p>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 text-xs">✓</span>
                    </div>
                    <p>Passa por formulário</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 text-xs">✓</span>
                    </div>
                    <p>Dados qualificados</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 text-xs">✓</span>
                    </div>
                    <p>Maior intenção</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center mb-1 font-medium">Custo por MQL</p>
                  <p className="text-3xl font-black text-indigo-700 text-center">
                    R$ {data.projection_mql_cost?.toFixed(2) || ((data.cpl_client || 0) * 4).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500 text-center mt-1 font-medium">(4x o CPL)</p>
                </div>
              </div>
            </div>

            {/* Explicação */}
            <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-900 mb-2">Por que o custo aumenta 4x?</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Nem todos os leads que entram pelo WhatsApp completam o formulário de qualificação. 
                    Em média, apenas <strong className="text-indigo-700">25% dos leads</strong> se tornam MQLs após a triagem. 
                    Por isso, o custo por MQL é aproximadamente <strong className="text-indigo-700">4 vezes maior</strong> que o CPL inicial.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Projeção Numérica */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
            <h4 className="text-purple-100 text-sm font-semibold mb-4 uppercase tracking-wide">
              📊 Sua Projeção para Etapa 3
            </h4>
            <div className="grid grid-cols-2 gap-6">
              {data.projection_mql_quantity && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <p className="text-purple-200 text-xs mb-2">MQLs Projetados</p>
                  <p className="text-4xl font-black mb-1">{data.projection_mql_quantity}</p>
                  <p className="text-xs text-purple-200">leads qualificados esperados</p>
                </div>
              )}
              {data.projection_mql_cost && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <p className="text-purple-200 text-xs mb-2">Custo por MQL Projetado</p>
                  <p className="text-4xl font-black mb-1">R$ {data.projection_mql_cost.toFixed(2)}</p>
                  <p className="text-xs text-purple-200">investimento por lead qualificado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
