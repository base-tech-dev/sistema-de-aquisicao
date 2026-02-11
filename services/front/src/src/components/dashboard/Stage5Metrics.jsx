import React from 'react';
import MetricCard from './MetricCard';
import CostFunnel from './CostFunnel';
import SalesMetrics from './SalesMetrics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function Stage5Metrics({ data, history = [], allStageData = [] }) {
  if (!data) return null;

  const previousData = history.length > 1 ? history[history.length - 2] : null;
  
  const cacTrend = previousData && data.cac < previousData.cac ? 'down' : 
                   previousData && data.cac > previousData.cac ? 'up' : 'stable';
  
  const roasTrend = previousData && data.roas > previousData.roas ? 'up' :
                    previousData && data.roas < previousData.roas ? 'down' : 'stable';

  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* SEPARAÇÃO 01 - INDICADORES DE VENDAS */}
      {/* ============================================ */}
      <div className="space-y-6">
        <div className="border-l-4 border-purple-600 pl-4">
          <h2 className="text-2xl font-bold text-slate-800">💰 Indicadores de Vendas</h2>
          <p className="text-sm text-slate-600">Métricas de performance comercial</p>
        </div>

        {/* Funil de Custos */}
        <CostFunnel currentStage={5} data={data} allStageData={allStageData} />

        {/* Main KPIs */}
        <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          Indicadores de Vendas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <DollarSign className="w-16 h-16" />
            </div>
            <p className="text-blue-200 text-sm font-semibold mb-2 uppercase tracking-wide">CAC</p>
            <p className="text-5xl font-black mb-2">R$ {data.cac?.toFixed(2) || '0.00'}</p>
            <p className="text-blue-100 text-sm">Custo de Aquisição de Cliente</p>
            {cacTrend === 'down' && (
              <div className="mt-3 inline-flex items-center gap-1 bg-green-500 px-2 py-1 rounded-full text-xs font-bold">
                <TrendingUp className="w-3 h-3" /> Melhorando
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <TrendingUp className="w-16 h-16" />
            </div>
            <p className="text-green-200 text-sm font-semibold mb-2 uppercase tracking-wide">ROAS</p>
            <p className="text-5xl font-black mb-2">{data.roas?.toFixed(1) || '0.0'}x</p>
            <p className="text-green-100 text-sm">Retorno sobre Investimento em Ads</p>
            {roasTrend === 'up' && (
              <div className="mt-3 inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                <TrendingUp className="w-3 h-3" /> Crescendo
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <p className="text-slate-500 text-sm font-semibold mb-3 uppercase">MQLs Gerados</p>
            <p className="text-5xl font-black text-slate-900 mb-1">{data.mql_quantity || 0}</p>
            <p className="text-xs text-slate-500">leads qualificados</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <p className="text-slate-500 text-sm font-semibold mb-3 uppercase">Conversão Funil</p>
            <p className="text-5xl font-black text-slate-900 mb-1">{data.funnel_conversion?.toFixed(1) || '0.0'}%</p>
            <p className="text-xs text-slate-500">taxa de conversão completa</p>
          </div>
        </div>
      </div>

      {/* CAC / ROAS Analysis */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          📊 Análise Detalhada
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Análise de CAC</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">CAC Atual</span>
              <span className="font-bold text-slate-800">R$ {data.cac?.toLocaleString('pt-BR')}</span>
            </div>
            {previousData && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">CAC Anterior</span>
                <span className="font-medium text-slate-500">R$ {previousData.cac?.toLocaleString('pt-BR')}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                O CAC indica quanto custa para adquirir um novo cliente. 
                Quanto menor, mais eficiente está sua operação.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-200 p-6">
          <h4 className="text-sm font-semibold text-purple-700 mb-4">Análise de ROAS</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">ROAS Atual</span>
              <span className="font-bold text-purple-700">{data.roas?.toFixed(2)}x</span>
            </div>
            <div className="pt-3 border-t border-purple-100">
              <p className="text-xs text-slate-600">
                ROAS = Receita ÷ Investimento em Ads.
                <br />Um ROAS de <strong>3x</strong> significa que para cada R$1 investido, retornou R$3.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>



      {/* Resultados de Vendas */}
      <SalesMetrics data={data} allStageData={allStageData} stage={5} />
    </div>
  );
}
