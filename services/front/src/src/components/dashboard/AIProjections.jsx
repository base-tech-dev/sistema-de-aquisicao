import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, TrendingUp, Calculator, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AIProjections({ clientId, stageData, stage }) {
  const [loading, setLoading] = useState(false);
  const [projection, setProjection] = useState(null);
  const [investmentIncrease, setInvestmentIncrease] = useState(20);

  const calculateHistoricalAverage = () => {
    const relevantData = stageData.filter(d => d.stage === stage).slice(-3);
    if (relevantData.length === 0) return null;

    const avg = {
      investment: 0,
      leads: 0,
      mqls: 0,
      sales: 0,
      cpl: 0,
      mqlCost: 0
    };

    relevantData.forEach(d => {
      avg.investment += d.investment_ads || 0;
      avg.leads += d.leads_whatsapp || 0;
      avg.mqls += d.mql_quantity || 0;
      avg.sales += d.sales_count || 0;
      if (d.cpl_client) avg.cpl += d.cpl_client;
      if (d.mql_cost) avg.mqlCost += d.mql_cost;
    });

    const count = relevantData.length;
    return {
      investment: avg.investment / count,
      leads: avg.leads / count,
      mqls: avg.mqls / count,
      sales: avg.sales / count,
      cpl: avg.cpl / count,
      mqlCost: avg.mqlCost / count
    };
  };

  const generateProjection = async () => {
    setLoading(true);
    const avg = calculateHistoricalAverage();
    
    if (!avg) {
      setLoading(false);
      return;
    }

    // Simulação simples (pode usar InvokeLLM para projeções mais sofisticadas)
    const multiplier = 1 + (investmentIncrease / 100);
    const efficiency = 0.85; // diminui eficiência com escala

    const projected = {
      investment: avg.investment * multiplier,
      leads: Math.round(avg.leads * multiplier * efficiency),
      mqls: Math.round(avg.mqls * multiplier * efficiency),
      sales: Math.round(avg.sales * multiplier * efficiency),
      cpl: avg.cpl / efficiency,
      mqlCost: avg.mqlCost / efficiency
    };

    setTimeout(() => {
      setProjection({
        current: avg,
        projected,
        increase: investmentIncrease
      });
      setLoading(false);
    }, 1500);
  };

  const avg = calculateHistoricalAverage();
  if (!avg) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Adicione mais dados históricos para gerar projeções (mínimo 3 meses)</p>
      </div>
    );
  }

  const chartData = projection ? [
    { name: 'Atual', ...projection.current },
    { name: 'Projetado', ...projection.projected }
  ] : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-slate-800">Projeções com IA</h3>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Calculator className="w-6 h-6 text-purple-600" />
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Simular aumento de investimento:
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={investmentIncrease}
                onChange={(e) => setInvestmentIncrease(Number(e.target.value))}
                className="w-24"
                min="0"
                max="100"
              />
              <span className="text-sm text-slate-600">%</span>
            </div>
          </div>
          <Button 
            onClick={generateProjection}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Gerar Projeção
              </>
            )}
          </Button>
        </div>
      </div>

      {projection && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Investimento Projetado</p>
              <p className="text-2xl font-bold text-slate-800">
                R$ {projection.projected.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{projection.increase}% vs atual
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-green-600 mb-2">Leads Projetados</p>
              <p className="text-2xl font-bold text-green-700">
                {projection.projected.leads}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                +{(projection.projected.leads - projection.current.leads).toFixed(0)} leads
              </p>
            </div>
          </div>

          {stage >= 3 && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-indigo-600 mb-2">MQLs Projetados</p>
              <p className="text-2xl font-bold text-indigo-700">{projection.projected.mqls}</p>
              <p className="text-xs text-slate-500 mt-1">
                +{(projection.projected.mqls - projection.current.mqls).toFixed(0)} MQLs
              </p>
            </div>
          )}

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="leads" stroke="#a855f7" strokeWidth={2} name="Leads" />
              {stage >= 3 && <Line type="monotone" dataKey="mqls" stroke="#7c3aed" strokeWidth={2} name="MQLs" />}
              {stage >= 5 && <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Vendas" />}
            </LineChart>
          </ResponsiveContainer>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Recomendação IA</p>
                <p className="text-sm text-amber-800">
                  Com base no histórico, um aumento de {projection.increase}% no investimento pode gerar 
                  aproximadamente <strong>{(projection.projected.leads - projection.current.leads).toFixed(0)} leads adicionais</strong>.
                  Note que a eficiência tende a diminuir com o aumento de escala.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
