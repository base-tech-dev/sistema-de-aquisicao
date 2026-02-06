import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

const stages = [
  { num: 1, name: "Onboard", duration: "Setup", color: "slate" },
  { num: 2, name: "Geração de Demanda", duration: "30 dias", color: "purple" },
  { num: 3, name: "Lead Qualificado", duration: "30 dias", color: "purple" },
  { num: 4, name: "Conversão", duration: "30 dias", color: "purple" },
  { num: 5, name: "Indicadores", duration: "60 dias", color: "purple" },
  { num: 6, name: "Validação", duration: "15 dias", color: "purple" },
];

export default function StageFlowChart({ currentStage = 1, brandColor = 'purple' }) {
  const colorMap = {
    purple: { from: 'from-purple-500', to: 'to-purple-700', shadow: 'shadow-purple-500/40', text: 'text-purple-600' },
    blue: { from: 'from-blue-500', to: 'to-blue-700', shadow: 'shadow-blue-500/40', text: 'text-blue-600' },
    green: { from: 'from-green-500', to: 'to-green-700', shadow: 'shadow-green-500/40', text: 'text-green-600' },
    orange: { from: 'from-orange-500', to: 'to-orange-700', shadow: 'shadow-orange-500/40', text: 'text-orange-600' },
    red: { from: 'from-red-500', to: 'to-red-700', shadow: 'shadow-red-500/40', text: 'text-red-600' },
    pink: { from: 'from-pink-500', to: 'to-pink-700', shadow: 'shadow-pink-500/40', text: 'text-pink-600' },
    indigo: { from: 'from-indigo-500', to: 'to-indigo-700', shadow: 'shadow-indigo-500/40', text: 'text-indigo-600' },
    teal: { from: 'from-teal-500', to: 'to-teal-700', shadow: 'shadow-teal-500/40', text: 'text-teal-600' },
    amber: { from: 'from-amber-500', to: 'to-amber-700', shadow: 'shadow-amber-500/40', text: 'text-amber-600' },
    rose: { from: 'from-rose-500', to: 'to-rose-700', shadow: 'shadow-rose-500/40', text: 'text-rose-600' },
  };

  const colors = colorMap[brandColor] || colorMap.purple;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center justify-between min-w-[800px] px-4">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.num}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                  currentStage > stage.num
                    ? "bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg shadow-green-500/30"
                    : currentStage === stage.num
                    ? `bg-gradient-to-br ${colors.from} ${colors.to} text-white shadow-xl ${colors.shadow} scale-110`
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {currentStage > stage.num ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <span className="text-lg font-bold">{stage.num}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-3 text-sm font-medium text-center max-w-[100px]",
                  currentStage >= stage.num ? "text-slate-800" : "text-slate-400"
                )}
              >
                {stage.name}
              </span>
              <span
                className={cn(
                  "text-xs mt-1",
                  currentStage > stage.num ? "text-green-600" : 
                  currentStage === stage.num ? colors.text : "text-slate-300"
                )}
              >
                {stage.duration}
              </span>
            </div>
            {index < stages.length - 1 && (
              <div className="flex-1 flex items-center justify-center px-2">
                <div
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-all duration-300",
                    currentStage > stage.num
                      ? "bg-gradient-to-r from-green-600 to-green-400"
                      : "bg-slate-200"
                  )}
                />
                <ArrowRight
                  className={cn(
                    "w-4 h-4 mx-1",
                    currentStage > stage.num ? "text-green-500" : "text-slate-300"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
