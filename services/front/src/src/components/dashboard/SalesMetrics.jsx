import React from 'react';
import { TrendingUp, DollarSign, Target, Users } from 'lucide-react';

export default function SalesMetrics({ data, allStageData = [], stage }) {
  if (!data) return null;

  // Calcular totais acumulados até a etapa atual
  const accumulatedData = (Array.isArray(allStageData) ? allStageData : [])
    .filter(d => d.stage <= stage)
    .reduce((acc, curr) => {
      const stageInvestment = curr.investment_ads || 
        ((curr.investment_lead_generation || 0) + (curr.investment_brand_awareness || 0));
      return {
        investment: acc.investment + stageInvestment,
        leads: acc.leads + (curr.leads_whatsapp || 0),
        mql: acc.mql + (curr.mql_quantity || 0),
        sales: acc.sales + (curr.sales_count || 0),
        revenue: acc.revenue + (curr.revenue || 0),
      };
    }, { investment: 0, leads: 0, mql: 0, sales: 0, revenue: 0 });

  // Dados do mês atual
  const currentInvestment = data.investment_ads || 
    ((data.investment_lead_generation || 0) + (data.investment_brand_awareness || 0));
  const currentLeads = data.leads_whatsapp || 0;
  const currentMql = data.mql_quantity || 0;
  const currentSales = data.sales_count || 0;

  // Cálculos automáticos
  const conversionRate = accumulatedData.leads > 0 
    ? (accumulatedData.sales / accumulatedData.leads * 100).toFixed(2) 
    : '0.00';
  
  const cac = accumulatedData.sales > 0 
    ? (accumulatedData.investment / accumulatedData.sales).toFixed(2) 
    : '0.00';

  // ROAS calculado automaticamente: Receita ÷ Investimento
  const roas = accumulatedData.investment > 0 
    ? (accumulatedData.revenue / accumulatedData.investment).toFixed(2) 
    : '0.00';

  return (
    <div className="space-y-6 pt-6 border-t-2 border-slate-200">
      <div className="border-l-4 border-green-600 pl-4">
        <h2 className="text-2xl font-bold text-slate-800">💰 Resultados de Vendas</h2>
        <p className="text-sm text-slate-600">Performance acumulada até esta etapa</p>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Investimento Total */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-20">
            <DollarSign className="w-16 h-16" />
          </div>
          <p className="text-blue-200 text-sm font-semibold mb-2 uppercase tracking-wide">Investimento Total</p>
          <p className="text-4xl font-black mb-1">R$ {accumulatedData.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-blue-100 text-xs">acumulado até etapa {stage}</p>
        </div>

        {/* Leads */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 text-sm font-semibold uppercase">Leads</p>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-4xl font-black text-slate-900 mb-1">{accumulatedData.leads}</p>
          <p className="text-xs text-slate-500">total gerado</p>
        </div>

        {/* MQL (se houver) */}
        {stage >= 3 && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm font-semibold uppercase">MQLs</p>
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-4xl font-black text-slate-900 mb-1">{accumulatedData.mql}</p>
            <p className="text-xs text-slate-500">leads qualificados</p>
          </div>
        )}

        {/* Vendas */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-20">
            <TrendingUp className="w-16 h-16" />
          </div>
          <p className="text-green-200 text-sm font-semibold mb-2 uppercase tracking-wide">Vendas</p>
          <p className="text-5xl font-black mb-1">{accumulatedData.sales}</p>
          <p className="text-green-100 text-xs">conversões realizadas</p>
        </div>
      </div>

      {/* Indicadores de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Taxa de Conversão */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-200 p-6">
          <h4 className="text-sm font-semibold text-purple-700 mb-3">Taxa de Conversão</h4>
          <p className="text-4xl font-black text-purple-700 mb-2">{conversionRate}%</p>
          <p className="text-xs text-slate-600">
            {accumulatedData.sales} vendas de {accumulatedData.leads} leads
          </p>
        </div>

        {/* CAC */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-200 p-6">
          <h4 className="text-sm font-semibold text-blue-700 mb-3">CAC</h4>
          <p className="text-4xl font-black text-blue-700 mb-2">R$ {cac}</p>
          <p className="text-xs text-slate-600">
            custo para adquirir cada cliente
          </p>
        </div>

        {/* ROAS */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 p-6">
          <h4 className="text-sm font-semibold text-green-700 mb-3">ROAS</h4>
          <p className="text-4xl font-black text-green-700 mb-2">{roas}x</p>
          <p className="text-xs text-slate-600">
            R$ {accumulatedData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} receita ÷ R$ {accumulatedData.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} investimento
          </p>
        </div>
      </div>

      {/* Explicação */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
        <p className="text-sm text-slate-700">
          <strong>📊 Sobre estes indicadores:</strong> Todos os valores acumulam desde o início do funil até a etapa atual. 
          A <strong>Taxa de Conversão</strong> e o <strong>CAC</strong> são calculados automaticamente com base nos dados acumulados.
        </p>
      </div>
    </div>
  );
}
