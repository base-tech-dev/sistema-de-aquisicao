import React from 'react';
import { Target, Zap, Users, LineChart, BarChart3, CheckSquare, ArrowRight } from 'lucide-react';

const objectives = {
  2: {
    icon: Zap,
    title: "Geração de Demanda",
    goals: [
      "Gerar volume inicial de leads",
      "Criar presença forte de marca"
    ],
    nextStage: {
      title: "Próxima Etapa: Lead Qualificado (MQL)",
      description: "Transformar leads em MQLs através de formulário"
    }
  },
  3: {
    icon: Users,
    title: "Lead Qualificado (MQL)",
    goals: [
      "Transformar lead em lead qualificado pelo marketing",
      "Campanha de rede de pesquisa com foco em cadastros qualificados",
      "Campanha de cadastro para atrair leads qualificados"
    ],
    nextStage: {
      title: "Próxima Etapa: Conversão de Página",
      description: "Otimizar landing pages com testes A/B"
    }
  },
  4: {
    icon: LineChart,
    title: "Conversão de Página",
    goals: [
      "Melhorar taxa de conversão das páginas",
      "Reduzir o custo por lead qualificado",
      "Testar 3 versões de Landing Page"
    ],
    nextStage: {
      title: "Próxima Etapa: Indicadores de Vendas",
      description: "Analisar eficiência do funil completo"
    }
  },
  5: {
    icon: BarChart3,
    title: "Indicadores de Vendas",
    goals: [
      "Entender eficiência real do funil",
      "Encontrar onde perdemos clientes",
      "Melhorar cada etapa do funil de vendas"
    ],
    nextStage: {
      title: "Próxima Etapa: Validação",
      description: "Validar resultados e definir ajustes"
    }
  },
  6: {
    icon: CheckSquare,
    title: "Validação",
    goals: [
      "Validação dos resultados obtidos",
      "Identificar gargalos",
      "Definir próximos ajustes"
    ],
    nextStage: null
  }
};

export default function StageObjectives({ stage, brandColor = 'purple' }) {
  const obj = objectives[stage];
  if (!obj) return null;

  const Icon = obj.icon;

  const colorMap = {
    purple: { from: 'from-purple-600', to: 'to-indigo-700', light: 'purple-200', accent: 'indigo' },
    blue: { from: 'from-blue-600', to: 'to-blue-800', light: 'blue-200', accent: 'blue' },
    green: { from: 'from-green-600', to: 'to-green-800', light: 'green-200', accent: 'green' },
    orange: { from: 'from-orange-600', to: 'to-orange-800', light: 'orange-200', accent: 'orange' },
    red: { from: 'from-red-600', to: 'to-red-800', light: 'red-200', accent: 'red' },
    pink: { from: 'from-pink-600', to: 'to-pink-800', light: 'pink-200', accent: 'pink' },
    indigo: { from: 'from-indigo-600', to: 'to-indigo-800', light: 'indigo-200', accent: 'indigo' },
    teal: { from: 'from-teal-600', to: 'to-teal-800', light: 'teal-200', accent: 'teal' },
    amber: { from: 'from-amber-600', to: 'to-amber-800', light: 'amber-200', accent: 'amber' },
    rose: { from: 'from-rose-600', to: 'to-rose-800', light: 'rose-200', accent: 'rose' },
  };

  const colors = colorMap[brandColor] || colorMap.purple;

  return (
    <div className="space-y-4">
      {/* Card Principal - Objetivos da Etapa Atual */}
      <div className={`bg-gradient-to-br ${colors.from} ${colors.to} rounded-2xl p-6 shadow-xl text-white`}>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{obj.title}</h3>
              <p className={`text-${colors.light} text-sm font-medium`}>Etapa {stage}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {obj.goals.map((goal, i) => (
            <div 
              key={i} 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-white text-sm leading-relaxed font-medium">{goal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Próxima Etapa */}
      {obj.nextStage && (
        <div className={`bg-gradient-to-br from-slate-50 to-${colors.accent}-50 rounded-2xl p-5 border border-${colors.accent}-200 shadow-sm`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl bg-${colors.accent}-100 flex items-center justify-center`}>
              <ArrowRight className={`w-5 h-5 text-${colors.accent}-600`} />
            </div>
            <div>
              <p className={`text-${colors.accent}-900 font-bold text-sm`}>{obj.nextStage.title}</p>
              <p className={`text-${colors.accent}-600 text-xs`}>{obj.nextStage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
