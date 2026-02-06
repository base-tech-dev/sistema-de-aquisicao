import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ConsolidatedFunnel({ clients, allStageData }) {
  const calculateConsolidated = () => {
    const totals = {
      investment: 0,
      leads: 0,
      mqls: 0,
      sales: 0,
      revenue: 0
    };

    clients.forEach(client => {
      const clientData = allStageData.filter(d => d.client_id === client.id);
      const latest = clientData.reduce((acc, d) => {
        if (!acc[d.stage] || d.month > acc[d.stage].month) {
          acc[d.stage] = d;
        }
        return acc;
      }, {});

      if (latest[2]) {
        totals.investment += latest[2].investment_ads || 0;
        totals.leads += latest[2].leads_whatsapp || 0;
      }
      if (latest[3]) {
        totals.mqls += latest[3].mql_quantity || 0;
      }
      if (latest[5]) {
        totals.sales += latest[5].sales_count || 0;
        totals.revenue += latest[5].revenue || 0;
      }
    });

    return totals;
  };

  const totals = calculateConsolidated();

  const funnelData = [
    { stage: 'Leads', value: totals.leads, fill: '#a855f7' },
    { stage: 'MQLs', value: totals.mqls, fill: '#7c3aed' },
    { stage: 'Vendas', value: totals.sales, fill: '#10b981' }
  ];

  const conversionRate = totals.leads > 0 ? ((totals.sales / totals.leads) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Funil Consolidado (Todos os Clientes)</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <p className="text-xs text-green-600 mb-1">Investimento Total</p>
          <p className="text-2xl font-bold text-green-700">R$ {totals.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Total de Leads</p>
          <p className="text-2xl font-bold text-purple-700">{totals.leads.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
          <p className="text-xs text-indigo-600 mb-1">Total de MQLs</p>
          <p className="text-2xl font-bold text-indigo-700">{totals.mqls.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
          <p className="text-xs text-emerald-600 mb-1">Total de Vendas</p>
          <p className="text-2xl font-bold text-emerald-700">{totals.sales.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="stage" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 12, 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex flex-col justify-center space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Taxa de Conversão do Funil</p>
            <p className="text-4xl font-black text-slate-800">{conversionRate}%</p>
            <p className="text-xs text-slate-500 mt-1">Leads → Vendas</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-600 mb-2">Receita Total</p>
            <p className="text-3xl font-bold text-green-700">R$ {totals.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
