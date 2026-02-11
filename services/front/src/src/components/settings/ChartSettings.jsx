import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, LineChart, BarChart3, PieChart, AreaChart } from 'lucide-react';

export default function ChartSettings() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['settings', 'charts'],
    queryFn: () => base44.entities.AppSettings.filter({ category: 'charts' }),
  });

  const saveSetting = useMutation({
    mutationFn: async (value) => {
      const existing = settings.find(s => s.setting_key === 'chart_type');
      if (existing) {
        return base44.entities.AppSettings.update(existing.id, { setting_value: value });
      }
      return base44.entities.AppSettings.create({
        setting_key: 'chart_type',
        setting_value: value,
        category: 'charts'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const chartTypes = [
    { 
      value: 'line', 
      name: 'Linhas', 
      icon: LineChart,
      description: 'Melhor para mostrar tendências ao longo do tempo'
    },
    { 
      value: 'bar', 
      name: 'Barras', 
      icon: BarChart3,
      description: 'Ideal para comparar valores entre categorias'
    },
    { 
      value: 'area', 
      name: 'Área', 
      icon: AreaChart,
      description: 'Destaca volumes e mudanças cumulativas'
    },
    { 
      value: 'pie', 
      name: 'Pizza', 
      icon: PieChart,
      description: 'Mostra proporções de um todo'
    },
  ];

  const currentType = settings.find(s => s.setting_key === 'chart_type')?.setting_value || 'line';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Tipo de Gráfico Padrão</h3>
      <p className="text-sm text-slate-500 mb-6">Escolha o estilo de gráfico que será usado nos dashboards</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartTypes.map(chart => {
          const Icon = chart.icon;
          return (
            <button
              key={chart.value}
              onClick={() => saveSetting.mutate(chart.value)}
              className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                currentType === chart.value 
                  ? 'border-purple-600 bg-purple-50 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  currentType === chart.value ? 'bg-purple-100' : 'bg-slate-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    currentType === chart.value ? 'text-purple-600' : 'text-slate-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 mb-1">{chart.name}</p>
                  <p className="text-xs text-slate-500">{chart.description}</p>
                </div>
              </div>
              {currentType === chart.value && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
