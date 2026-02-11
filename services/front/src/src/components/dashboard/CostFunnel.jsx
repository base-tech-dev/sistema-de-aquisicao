import React from 'react';
import { TrendingDown, Target, DollarSign, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function CostFunnel({ currentStage, data, allStageData = {} }) {
  // Buscar dados das etapas anteriores
  const stage2Data = allStageData[2];
  const stage3Data = allStageData[3];
  const stage5Data = allStageData[5];

  const funnelSteps = [
    {
      stage: 2,
      label: 'CPL',
      fullLabel: 'Custo por Lead',
      value: stage2Data?.cpl_client || data?.cpl_client,
      marketValue: stage2Data?.cpl_market || data?.cpl_market,
      quantity: stage2Data?.leads_whatsapp || data?.leads_whatsapp,
      quantityLabel: 'Leads',
      icon: Target,
      color: 'purple'
    },
    {
      stage: 3,
      label: 'MQL',
      fullLabel: 'Custo por MQL',
      value: stage3Data?.mql_cost || data?.mql_cost,
      marketValue: null,
      quantity: stage3Data?.mql_quantity || data?.mql_quantity,
      quantityLabel: 'MQLs',
      icon: TrendingDown,
      color: 'blue'
    },
    {
      stage: 5,
      label: 'CAC',
      fullLabel: 'Custo de Aquisição',
      value: stage5Data?.cac || data?.cac,
      marketValue: null,
      quantity: null,
      quantityLabel: null,
      icon: DollarSign,
      color: 'green'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Funil de Custos</h3>
          <p className="text-sm text-slate-500">Evolução dos custos de aquisição</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {funnelSteps.map((step, index) => {
          const isActive = currentStage >= step.stage;
          const isCurrentStage = currentStage === step.stage;
          const Icon = step.icon;
          
          const colorClasses = {
            purple: {
              border: 'border-purple-200',
              bg: 'bg-purple-50',
              text: 'text-purple-600',
              icon: 'text-purple-500'
            },
            blue: {
              border: 'border-blue-200',
              bg: 'bg-blue-50',
              text: 'text-blue-600',
              icon: 'text-blue-500'
            },
            green: {
              border: 'border-green-200',
              bg: 'bg-green-50',
              text: 'text-green-600',
              icon: 'text-green-500'
            }
          }[step.color];

          return (
            <div key={step.stage} className="relative">
              {/* Connector arrow */}
              {index < funnelSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className={cn(
                    "w-6 h-0.5",
                    isActive ? "bg-slate-300" : "bg-slate-100"
                  )} />
                  <div className={cn(
                    "absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent",
                    isActive ? "border-l-slate-300" : "border-l-slate-100"
                  )} />
                </div>
              )}

              <div className={cn(
                "relative rounded-xl border-2 p-5 transition-all duration-300",
                isActive 
                  ? cn(colorClasses.border, colorClasses.bg, "shadow-md") 
                  : "border-slate-100 bg-slate-50/50 opacity-60",
                isCurrentStage && "ring-2 ring-offset-2 ring-purple-400"
              )}>
                {/* Status badge */}
                <div className="absolute -top-2 -right-2">
                  {isActive ? (
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shadow-sm",
                      colorClasses.bg,
                      colorClasses.border,
                      "border-2"
                    )}>
                      <CheckCircle2 className={cn("w-4 h-4", colorClasses.icon)} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-100 shadow-sm" />
                  )}
                </div>

                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                  isActive ? cn(colorClasses.bg, "border", colorClasses.border) : "bg-slate-100 border border-slate-200"
                )}>
                  <Icon className={cn("w-6 h-6", isActive ? colorClasses.icon : "text-slate-400")} />
                </div>

                {/* Label */}
                <div className="mb-2">
                  <div className={cn(
                    "text-xs font-medium mb-1",
                    isActive ? "text-slate-600" : "text-slate-400"
                  )}>
                    Etapa {step.stage}
                  </div>
                  <div className={cn(
                    "text-sm font-semibold",
                    isActive ? colorClasses.text : "text-slate-400"
                  )}>
                    {step.fullLabel}
                  </div>
                </div>

                {/* Value */}
                {isActive && step.value ? (
                  <div>
                    <div className={cn("text-2xl font-bold", colorClasses.text)}>
                      R$ {step.value.toFixed(2)}
                    </div>
                    
                    {/* Quantity */}
                    {step.quantity && (
                      <div className="mt-2">
                        <div className="text-xs text-slate-500">{step.quantityLabel}</div>
                        <div className="text-lg font-semibold text-slate-700">{step.quantity.toLocaleString()}</div>
                      </div>
                    )}
                    
                    {/* Market comparison */}
                    {step.marketValue && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="text-xs text-slate-500">vs. Mercado</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-slate-600">R$ {step.marketValue.toFixed(2)}</span>
                          <span className={cn(
                            "text-xs font-medium",
                            step.value <= step.marketValue ? "text-green-600" : "text-red-600"
                          )}>
                            {step.value <= step.marketValue 
                              ? `${(((step.marketValue - step.value) / step.marketValue) * 100).toFixed(0)}% melhor` 
                              : `${(((step.value - step.marketValue) / step.marketValue) * 100).toFixed(0)}% acima`
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : !isActive ? (
                  <div className="text-sm text-slate-400 italic">
                    {step.stage === 3 ? 'Próxima etapa' : step.stage === 5 ? 'Etapa futura' : 'Aguardando'}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">
                    Aguardando dados
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
