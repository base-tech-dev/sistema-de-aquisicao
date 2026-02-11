import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import moment from 'moment';

export default function TrendCharts({ stageData, stage }) {
  const history = stageData
    .filter(d => d.stage === stage)
    .sort((a, b) => a.month?.localeCompare(b.month));

  if (history.length < 2) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Adicione mais dados históricos para visualizar tendências (mínimo 2 meses)</p>
      </div>
    );
  }

  const chartData = history.map(d => ({
    month: moment(d.month).format('MMM/YY'),
    investment: d.investment_ads || 0,
    leads: d.leads_whatsapp || 0,
    mqls: d.mql_quantity || 0,
    sales: d.sales_count || 0,
    revenue: d.revenue || 0,
    cpl: d.cpl_client || 0,
    mqlCost: d.mql_cost || 0,
    frequency: d.frequency || 0
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">Tendências Históricas</h3>

      {/* Investimento e Resultados */}
      {(stage === 2 || stage === 3) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Investimento vs Leads</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Legend />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="investment" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Investimento (R$)"
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey={stage === 2 ? "leads" : "mqls"} 
                stroke="#a855f7" 
                strokeWidth={2}
                name={stage === 2 ? "Leads" : "MQLs"}
                dot={{ fill: '#a855f7', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Custo por Lead/MQL */}
      {(stage === 2 || stage === 3) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">
            {stage === 2 ? 'Custo por Lead (CPL)' : 'Custo por MQL'}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => [`R$ ${value.toFixed(2)}`, '']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={stage === 2 ? "cpl" : "mqlCost"} 
                stroke="#7c3aed" 
                strokeWidth={3}
                name={stage === 2 ? "CPL" : "Custo MQL"}
                dot={{ fill: '#7c3aed', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Vendas e Receita */}
      {stage === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Vendas e Receita</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="sales" 
                stroke="#a855f7" 
                strokeWidth={2}
                name="Vendas"
                dot={{ fill: '#a855f7', r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Receita (R$)"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Frequência */}
      {(stage === 2 || stage === 3) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Frequência de Impacto</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 4]} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => [`${value.toFixed(1)}x`, '']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="frequency" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Frequência"
                dot={{ fill: '#3b82f6', r: 5 }}
              />
              {/* Linha da meta */}
              <Line 
                type="monotone" 
                data={chartData.map(d => ({ ...d, meta: 2 }))} 
                dataKey="meta" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta (2.0x)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
