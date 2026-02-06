import React from 'react';
import MetricCard from './MetricCard';
import CostFunnel from './CostFunnel';
import SalesMetrics from './SalesMetrics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function Stage4Metrics({ data, previousData, allStageData = [], history = [] }) {
  if (!data) return null;

  const calcGrowth = (current, prev) => {
    if (!prev || prev === 0) return null;
    return ((current - prev) / prev * 100).toFixed(1);
  };

  const lpBase = data.conversion_lp_base || 0;
  const lpA = data.conversion_lp_a || 0;
  const lpB = data.conversion_lp_b || 0;

  const prevLpBase = previousData?.conversion_lp_base || 0;
  const growthBase = calcGrowth(lpBase, prevLpBase);
  const growthA = calcGrowth(lpA, prevLpBase);
  const growthB = calcGrowth(lpB, prevLpBase);

  const bestLP = lpBase >= lpA && lpBase >= lpB ? 'Base' :
                 lpA >= lpBase && lpA >= lpB ? 'A' : 'B';
  const bestValue = Math.max(lpBase, lpA, lpB);

  const chartData = [
    { name: 'LP Base', value: lpBase, color: '#94a3b8' },
    { name: 'LP A', value: lpA, color: '#a855f7' },
    { name: 'LP B', value: lpB, color: '#7c3aed' },
  ];

  const getStatus = (growth) => {
    if (growth === null) return null;
    if (parseFloat(growth) > 0) return 'success';
    if (parseFloat(growth) === 0) return null;
    return 'danger';
  };

  const getTrend = (growth) => {
    if (growth === null) return null;
    if (parseFloat(growth) > 0) return 'up';
    if (parseFloat(growth) === 0) return 'stable';
    return 'down';
  };

  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* SEPARAÇÃO 01 - TESTES A/B DE LANDING PAGES */}
      {/* ============================================ */}
      <div className="space-y-6">
        <div className="border-l-4 border-purple-600 pl-4">
          <h2 className="text-2xl font-bold text-slate-800">🎯 Testes A/B de Landing Pages</h2>
          <p className="text-sm text-slate-600">Otimização de conversão através de testes comparativos</p>
        </div>

        {/* Funil de Custos */}
        <CostFunnel currentStage={4} data={data} allStageData={allStageData} />

        {/* Conversion Rates */}
        <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          Taxa de Conversão por Landing Page
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="LP Base (Anterior)"
            value={lpBase}
            suffix="%"
            trend={getTrend(growthBase)}
            status={getStatus(growthBase)}
            subtitle={growthBase !== null ? `${growthBase > 0 ? '+' : ''}${growthBase}% vs anterior` : 'Referência base'}
          />
          <MetricCard
            title="LP A (Teste)"
            value={lpA}
            suffix="%"
            trend={getTrend(growthA)}
            status={getStatus(growthA)}
            subtitle={growthA !== null ? `${growthA > 0 ? '+' : ''}${growthA}% vs base` : 'Aguardando dados'}
          />
          <MetricCard
            title="LP B (Teste)"
            value={lpB}
            suffix="%"
            trend={getTrend(growthB)}
            status={getStatus(growthB)}
            subtitle={growthB !== null ? `${growthB > 0 ? '+' : ''}${growthB}% vs base` : 'Aguardando dados'}
          />
        </div>
      </div>

      {/* Best Performer */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm mb-1">Melhor Performance</p>
            <p className="text-3xl font-bold">Landing Page {bestLP}</p>
            <p className="text-purple-200 text-sm mt-1">
              Taxa de conversão de {bestValue.toFixed(1)}%
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Comparativo de Conversão</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit="%" />
            <Tooltip 
              formatter={(value) => [`${value.toFixed(1)}%`, 'Conversão']}
              contentStyle={{ 
                borderRadius: 12, 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Info */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          💡 Sobre esta etapa
        </h4>
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-600">
            A meta desta etapa é <strong>crescer</strong> a taxa de conversão em relação ao mês anterior.
            Não existe um número fixo como meta, o objetivo é sempre superar a performance anterior através de testes A/B.
          </p>
        </div>
      </div>
      </div>



            {/* Resultados de Vendas */}
            <SalesMetrics data={data} allStageData={allStageData} stage={4} />
            </div>
            );
            }
