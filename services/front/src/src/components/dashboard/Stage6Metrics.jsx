import React from 'react';
import SalesMetrics from './SalesMetrics';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Stage6Metrics({ data, allStageData = [], history = [] }) {
  if (!data) return null;

  const validationItems = [
    { label: 'Etapas funcionaram conforme esperado', completed: data.validation_stages_ok },
    { label: 'Gargalos identificados', completed: !!data.validation_bottlenecks },
    { label: 'Próximos passos definidos', completed: !!data.validation_next_steps },
  ];

  const completedCount = validationItems.filter(item => item.completed).length;
  const progressPercent = (completedCount / validationItems.length) * 100;

  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* SEPARAÇÃO 01 - VALIDAÇÃO DO SISTEMA */}
      {/* ============================================ */}
      <div className="space-y-6">
        <div className="border-l-4 border-purple-600 pl-4">
          <h2 className="text-2xl font-bold text-slate-800">✅ Validação do Sistema</h2>
          <p className="text-sm text-slate-600">Análise e aprendizados do ciclo completo</p>
        </div>

        {/* Progress */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-purple-100 text-sm mb-1">Progresso da Validação</p>
            <p className="text-3xl font-bold">{progressPercent.toFixed(0)}%</p>
          </div>
          <div className="text-5xl opacity-20">
            {progressPercent === 100 ? '🎉' : '📋'}
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-purple-100 text-sm mt-2">
          {completedCount} de {validationItems.length} itens completos
        </p>
      </div>

      {/* Validation Checklist */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          📋 Checklist de Validação
        </h4>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Checklist de Validação</h4>
        <div className="space-y-3">
          {validationItems.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                item.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
              <span className={`text-sm font-medium ${
                item.completed ? 'text-green-700' : 'text-slate-600'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Details */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          📝 Detalhes da Validação
        </h4>
        <div className="space-y-4">
      {data.validation_bottlenecks && (
        <div className="bg-white rounded-2xl border border-orange-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="text-sm font-semibold text-orange-700">Gargalos Identificados</h4>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.validation_bottlenecks}</p>
        </div>
      )}

      {data.validation_next_steps && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-semibold text-blue-700">Próximos Passos Definidos</h4>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.validation_next_steps}</p>
        </div>
      )}
        </div>
      </div>
      </div>



      {/* Resultados de Vendas */}
      <SalesMetrics data={data} allStageData={allStageData} stage={6} />
    </div>
  );
}
