import React from 'react';
import MetricCard from './MetricCard';
import CostFunnel from './CostFunnel';
import SectorBenchmark from './SectorBenchmark';
import SalesMetrics from './SalesMetrics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';

export default function Stage3Metrics({ data, cplReference, allStageData = [], history = [], clientSector, clients, allClientStageData }) {
  if (!data) return null;

  // Buscar CPL da etapa 2
  const stage2Data = allStageData?.find(d => d.stage === 2);
  const cplFromStage2 = stage2Data?.cpl_client || cplReference || 10;

  const mqlMeta = cplFromStage2 * 4;
  const mqlStatus = data.mql_cost <= mqlMeta ? 'success' :
                    data.mql_cost <= mqlMeta * 1.3 ? 'warning' : 'danger';

  const mqlImprovement = mqlMeta && data.mql_cost ? 
    ((mqlMeta - data.mql_cost) / mqlMeta * 100) : null;
  
  const frequencyStatus = data.frequency >= 2 ? 'success' :
                          data.frequency >= 1.5 ? 'warning' : 'danger';

  // Taxa de conversão da landing page (leads para MQL)
  const conversionRate = data.leads_whatsapp && data.mql_quantity ? 
    (data.mql_quantity / data.leads_whatsapp * 100) : 0;

  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* SEPARAÇÃO 01 - GERAÇÃO DE LEADS MQL */}
      {/* ============================================ */}
      <div className="space-y-6">
        <div className="border-l-4 border-purple-600 pl-4">
          <h2 className="text-2xl font-bold text-slate-800">Geração de Leads MQL</h2>
          <p className="text-sm text-slate-600">Campanha de cadastro na landing page</p>
        </div>

        {/* Funil de Custos */}
        <CostFunnel currentStage={3} data={data} allStageData={allStageData} />
        
        {/* Resultado Principal - MQL */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-purple-200 text-sm font-semibold mb-4 uppercase tracking-wide">📈 Resultado Principal</h3>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <p className="text-purple-100 text-xs font-medium mb-3">Seu Resultado MQL</p>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-purple-200 text-xs mb-1">Investimento</p>
                <p className="text-2xl font-bold">R$ {(data.investment_lead_generation || data.investment_ads || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-purple-200 text-xs mb-1">Lead MQL</p>
                <p className="text-2xl font-bold">{data.mql_quantity || 0}</p>
              </div>
              <div>
                <p className="text-purple-200 text-xs mb-1">Custo por Lead MQL</p>
                <p className="text-2xl font-bold">R$ {data.mql_cost?.toFixed(2) || '0,00'}</p>
              </div>
              <div>
                <p className="text-purple-200 text-xs mb-1">Taxa de Conversão LP</p>
                <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas de MQL com Velocímetro */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            🎯 Performance do Custo MQL
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Velocímetro MQL */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 overflow-hidden">
              <p className="text-slate-700 text-sm font-semibold mb-3 text-center">Custo por MQL</p>
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
                    stroke="url(#mqlGradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min((data.mql_cost || 0) / (mqlMeta * 2) * 251.2, 251.2)} 251.2`}
                  />
                  
                  {/* Ponteiro da Meta (4x CPL) */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 65 * Math.cos(Math.PI - (mqlMeta / (mqlMeta * 2) * Math.PI))}
                    y2={100 - 65 * Math.sin(Math.PI - (mqlMeta / (mqlMeta * 2) * Math.PI))}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                  
                  {/* Ponteiro do Custo MQL Atual */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 65 * Math.cos(Math.PI - (Math.min(data.mql_cost || 0, mqlMeta * 2) / (mqlMeta * 2) * Math.PI))}
                    y2={100 - 65 * Math.sin(Math.PI - (Math.min(data.mql_cost || 0, mqlMeta * 2) / (mqlMeta * 2) * Math.PI))}
                    stroke={mqlStatus === 'success' ? '#10b981' : mqlStatus === 'warning' ? '#f59e0b' : '#ef4444'}
                    strokeWidth="2.5"
                  />
                  <circle cx="100" cy="100" r="4" fill="#1e293b" />
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="mqlGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  
                  {/* Labels */}
                  <text x="20" y="108" fontSize="9" fill="#64748b" textAnchor="middle">0</text>
                  <text x="100" y="25" fontSize="9" fill="#64748b" textAnchor="middle">R$ {mqlMeta.toFixed(0)}</text>
                  <text x="180" y="108" fontSize="9" fill="#64748b" textAnchor="middle">R$ {(mqlMeta * 2).toFixed(0)}</text>
                </svg>
              </div>
              <div className="text-center mt-3">
                <p className="text-3xl font-bold text-slate-800">R$ {data.mql_cost?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {mqlStatus === 'success' ? "✓ Meta atingida!" : `Meta: até R$ ${mqlMeta.toFixed(2)}`}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-slate-400 border-t-2 border-dashed border-slate-400"></div>
                  <span className="text-slate-600">Meta (4x CPL)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-1 ${mqlStatus === 'success' ? 'bg-green-600' : mqlStatus === 'warning' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                  <span className="text-slate-600">Atual</span>
                </div>
              </div>
            </div>

            {/* Explicação */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-700 mb-3">📊 Sobre o Custo MQL</p>
              <p className="text-xs text-slate-600 mb-3">
                O custo por MQL (Marketing Qualified Lead) indica quanto você investiu para conseguir um lead qualificado através do cadastro na landing page.
              </p>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 mb-3">
                <p className="text-xs font-semibold text-purple-700 mb-1">🎯 Meta Ideal</p>
                <p className="text-xs text-slate-600">
                  A meta é <strong>até 4x o CPL da etapa 2</strong> (R$ {cplFromStage2.toFixed(2)}).
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 mb-1">📌 CPL da Etapa 2</p>
                <p className="text-xs text-slate-600">
                  R$ {cplFromStage2.toFixed(2)} × 4 = <strong>R$ {mqlMeta.toFixed(2)}</strong>
                </p>
              </div>
            </div>
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
      {((data.investment_ads || data.accumulated_investment || data.mql_cost_accumulated) || history.length > 1) && (
        <div className="space-y-6 pt-6 border-t-2 border-slate-200">
          {/* Dados Acumulados */}
          {(data.investment_ads || data.accumulated_investment || data.mql_cost_accumulated) && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                📊 Dados Acumulados
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.investment_ads && (
                  <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
                    <p className="text-sm text-green-600 mb-1">Investimento Mês</p>
                    <p className="text-2xl font-bold text-green-700">R$ {data.investment_ads.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}
                {data.accumulated_investment && (
                  <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                    <p className="text-sm text-blue-600 mb-1">Investimento Acumulado</p>
                    <p className="text-2xl font-bold text-blue-700">R$ {data.accumulated_investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}
                {data.mql_cost_accumulated && (
                  <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5">
                    <p className="text-sm text-purple-600 mb-1">Custo MQL Acumulado</p>
                    <p className="text-2xl font-bold text-purple-700">R$ {data.mql_cost_accumulated.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      )}

      {/* Resultados de Vendas */}
      <SalesMetrics data={data} allStageData={allStageData} stage={3} />

      {/* Projeção para Próxima Etapa */}
      <div className="space-y-6 pt-6 border-t-2 border-slate-200">
        <div className="border-l-4 border-indigo-600 pl-4">
          <h2 className="text-2xl font-bold text-slate-800">🎯 Projeção para Etapa 4 (Testes A/B)</h2>
          <p className="text-sm text-slate-600">Otimização de Landing Pages para aumentar MQLs</p>
        </div>

        {/* Explicação Visual do Processo */}
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <span className="text-xl">🧪</span>
            </div>
            <h4 className="text-slate-800 font-bold text-xl">
              Testes A/B: Aumentando sua Taxa de Conversão
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Landing Page Atual */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-300">
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl mb-4 shadow-lg">
                  <span className="text-4xl">📄</span>
                </div>
                <h5 className="font-black text-slate-800 text-xl mb-1">LP Base</h5>
                <p className="text-xs text-slate-500 font-medium">(Atual)</p>
              </div>
              <div className="space-y-3 mb-5">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Taxa de Conversão</p>
                  <p className="text-2xl font-black text-slate-800">{conversionRate.toFixed(1)}%</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">MQLs Gerados</p>
                  <p className="text-2xl font-black text-slate-800">{data.mql_quantity || 0}</p>
                </div>
              </div>
            </div>

            {/* Seta de Transformação */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="text-7xl text-slate-300">→</div>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg text-center">
                TESTAMOS 2 NOVAS<br/>LANDING PAGES
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg border-2 border-green-300">
                <p className="text-xs text-green-700 text-center font-semibold">
                  🎯 Objetivo: Melhorar a conversão
                </p>
              </div>
            </div>

            {/* Landing Pages Teste A/B */}
            <div className="space-y-4">
              {/* LP A */}
              <div className="bg-white rounded-xl p-4 shadow-md border-2 border-purple-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                    <span className="text-xl text-white font-black">A</span>
                  </div>
                  <div className="flex-1">
                    <h6 className="font-bold text-purple-800 text-sm">LP Teste A</h6>
                    <p className="text-xs text-slate-500">Nova versão 1</p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                  <p className="text-xs text-purple-700 font-bold text-center">Em Teste</p>
                </div>
              </div>

              {/* LP B */}
              <div className="bg-white rounded-xl p-4 shadow-md border-2 border-indigo-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                    <span className="text-xl text-white font-black">B</span>
                  </div>
                  <div className="flex-1">
                    <h6 className="font-bold text-indigo-800 text-sm">LP Teste B</h6>
                    <p className="text-xs text-slate-500">Nova versão 2</p>
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-200">
                  <p className="text-xs text-indigo-700 font-bold text-center">Em Teste</p>
                </div>
              </div>
            </div>
          </div>

          {/* Explicação do Benefício */}
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-900 mb-3">Como os Testes A/B Aumentam seus MQLs?</p>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  Na Etapa 4, vamos criar <strong className="text-green-700">2 novas versões da sua landing page</strong> e testá-las contra a atual. 
                  O objetivo é <strong className="text-green-700">aumentar a taxa de conversão</strong> - ou seja, fazer com que mais visitantes 
                  preencham o formulário e se tornem MQLs.
                </p>
                
                {/* Simulação de Ganho */}
                <div className="bg-white rounded-lg p-4 border border-green-300">
                  <p className="text-xs font-bold text-green-700 mb-3">📊 Exemplo de Ganho Potencial:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Cenário Atual</p>
                      <p className="text-lg font-black text-slate-800">{conversionRate.toFixed(1)}%</p>
                      <p className="text-xs text-slate-500">{data.mql_quantity || 0} MQLs</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 border-2 border-green-400">
                      <p className="text-xs text-green-700 mb-1">Se melhorar +30%</p>
                      <p className="text-lg font-black text-green-800">{(conversionRate * 1.3).toFixed(1)}%</p>
                      <p className="text-xs text-green-700 font-bold">
                        {Math.round((data.mql_quantity || 0) * 1.3)} MQLs 
                        <span className="ml-1">({Math.round((data.mql_quantity || 0) * 0.3)}+ 🎉)</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-slate-600">
                      💰 <strong>Mesmo investimento</strong>, <strong className="text-green-700">+30% de leads qualificados!</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* O que será testado */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-xl">🔬</span>
            O que vamos testar nas novas Landing Pages?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="text-3xl mb-2">🎨</div>
              <p className="font-bold text-blue-900 text-sm mb-1">Design & Layout</p>
              <p className="text-xs text-blue-700">Cores, imagens, disposição dos elementos</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="text-3xl mb-2">✍️</div>
              <p className="font-bold text-purple-900 text-sm mb-1">Textos & Mensagens</p>
              <p className="text-xs text-purple-700">Títulos, CTAs, benefícios destacados</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="text-3xl mb-2">📋</div>
              <p className="font-bold text-green-900 text-sm mb-1">Formulário</p>
              <p className="text-xs text-green-700">Quantidade e tipo de campos solicitados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
