import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SquadComparison({ squads, clients, allStageData }) {
  const calculateSquadMetrics = () => {
    return squads.map(squad => {
      const squadClients = clients.filter(c => squad.client_ids?.includes(c.id));
      
      let totalInvestment = 0;
      let totalLeads = 0;
      let totalMQLs = 0;
      let totalSales = 0;
      let totalRevenue = 0;

      squadClients.forEach(client => {
        const clientData = allStageData.filter(d => d.client_id === client.id);
        const latest = clientData.reduce((acc, d) => {
          if (!acc[d.stage] || d.month > acc[d.stage].month) {
            acc[d.stage] = d;
          }
          return acc;
        }, {});

        if (latest[2]) {
          totalInvestment += latest[2].investment_ads || 0;
          totalLeads += latest[2].leads_whatsapp || 0;
        }
        if (latest[3]) totalMQLs += latest[3].mql_quantity || 0;
        if (latest[5]) {
          totalSales += latest[5].sales_count || 0;
          totalRevenue += latest[5].revenue || 0;
        }
      });

      return {
        name: squad.name,
        clientes: squadClients.length,
        investimento: totalInvestment,
        leads: totalLeads,
        mqls: totalMQLs,
        vendas: totalSales,
        receita: totalRevenue,
        color: squad.color || 'purple'
      };
    });
  };

  const squadMetrics = calculateSquadMetrics();

  const colorMap = {
    purple: '#a855f7',
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f97316',
    red: '#ef4444',
    pink: '#ec4899'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Comparativo de Performance entre Squads</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Leads por Squad */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-4">Total de Leads</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={squadMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                {squadMetrics.map((entry, index) => (
                  <Bar key={index} dataKey="leads" fill={colorMap[entry.color] || '#a855f7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vendas por Squad */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-4">Total de Vendas</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={squadMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="vendas" radius={[6, 6, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {squadMetrics.map((squad, idx) => (
          <div 
            key={idx}
            className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border-2 border-slate-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-800">{squad.name}</h4>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colorMap[squad.color] }}
              />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Clientes:</span>
                <span className="font-semibold text-slate-800">{squad.clientes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Leads:</span>
                <span className="font-semibold text-slate-800">{squad.leads}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vendas:</span>
                <span className="font-semibold text-green-600">{squad.vendas}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-600">Receita:</span>
                <span className="font-bold text-green-700">R$ {squad.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
