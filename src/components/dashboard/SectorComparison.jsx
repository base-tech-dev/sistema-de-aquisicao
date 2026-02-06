import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SectorComparison({ clients, allStageData }) {
  const getSectorMetrics = () => {
    const sectorMap = {};
    
    clients.forEach(client => {
      const sector = client.sector || 'outros';
      if (!sectorMap[sector]) {
        sectorMap[sector] = {
          sector,
          clients: 0,
          cpl: [],
          mql_cost: [],
          conversion: [],
          cac: [],
          roas: []
        };
      }
      
      sectorMap[sector].clients++;
      
      const clientData = allStageData.filter(d => d.client_id === client.id);
      clientData.forEach(data => {
        if (data.cpl_client) sectorMap[sector].cpl.push(data.cpl_client);
        if (data.mql_cost) sectorMap[sector].mql_cost.push(data.mql_cost);
        if (data.funnel_conversion) sectorMap[sector].conversion.push(data.funnel_conversion);
        if (data.cac) sectorMap[sector].cac.push(data.cac);
        if (data.roas) sectorMap[sector].roas.push(data.roas);
      });
    });

    const avg = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return Object.values(sectorMap).map(s => ({
      sector: s.sector.charAt(0).toUpperCase() + s.sector.slice(1),
      clients: s.clients,
      cpl: avg(s.cpl),
      mql_cost: avg(s.mql_cost),
      conversion: avg(s.conversion),
      cac: avg(s.cac),
      roas: avg(s.roas)
    }));
  };

  const data = getSectorMetrics();

  if (data.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">CPL Médio por Setor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="sector" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip 
              formatter={(value) => [`R$ ${value.toFixed(2)}`, 'CPL Médio']}
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} 
            />
            <Bar dataKey="cpl" fill="#7c3aed" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Custo MQL Médio por Setor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="sector" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip 
              formatter={(value) => [`R$ ${value.toFixed(2)}`, 'MQL Médio']}
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} 
            />
            <Bar dataKey="mql_cost" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Taxa de Conversão Média por Setor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="sector" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit="%" />
            <Tooltip 
              formatter={(value) => [`${value.toFixed(1)}%`, 'Conversão Média']}
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} 
            />
            <Bar dataKey="conversion" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">CAC Médio por Setor</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sector" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toFixed(2)}`, 'CAC Médio']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} 
              />
              <Bar dataKey="cac" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">ROAS Médio por Setor</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sector" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit="x" />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}x`, 'ROAS Médio']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} 
              />
              <Bar dataKey="roas" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
