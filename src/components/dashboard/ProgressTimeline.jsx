import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import moment from 'moment';

export default function ProgressTimeline({ client, stageData }) {
  const stages = [
    { stage: 1, name: 'Setup Inicial', color: 'slate' },
    { stage: 2, name: 'Geração de Demanda', color: 'purple' },
    { stage: 3, name: 'Lead Qualificado (MQL)', color: 'indigo' },
    { stage: 4, name: 'Conversão de Página', color: 'blue' },
    { stage: 5, name: 'Indicadores de Vendas', color: 'green' },
    { stage: 6, name: 'Validação', color: 'emerald' }
  ];

  const getStageInfo = (stage) => {
    const stageRecords = stageData.filter(d => d.stage === stage);
    if (stageRecords.length === 0) return null;

    const firstRecord = stageRecords.sort((a, b) => a.month?.localeCompare(b.month))[0];
    const latestRecord = stageRecords.sort((a, b) => b.month?.localeCompare(a.month))[0];
    
    return {
      startDate: firstRecord.month,
      endDate: latestRecord.month,
      monthsInStage: stageRecords.length
    };
  };

  const getAverageDuration = () => {
    const durations = [];
    stages.slice(1).forEach(({ stage }) => {
      const info = getStageInfo(stage);
      if (info) durations.push(info.monthsInStage);
    });
    return durations.length > 0 ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1) : 0;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Timeline de Progresso</h3>
        <div className="text-sm text-slate-600">
          Duração média: <span className="font-bold text-purple-600">{getAverageDuration()} meses</span> por etapa
        </div>
      </div>

      <div className="relative">
        {stages.map((stageItem, idx) => {
          const info = getStageInfo(stageItem.stage);
          const isCompleted = info !== null;
          const isCurrent = client.current_stage === stageItem.stage;
          const isPast = stageItem.stage < client.current_stage;

          return (
            <div key={stageItem.stage} className="flex gap-4 pb-8 relative">
              {/* Linha conectora */}
              {idx < stages.length - 1 && (
                <div 
                  className={`absolute left-5 top-10 w-0.5 h-full ${
                    isPast ? 'bg-green-400' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Ícone */}
              <div className="relative z-10 flex-shrink-0">
                {isPast || isCompleted ? (
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shadow-lg animate-pulse">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <Circle className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold ${isCurrent ? 'text-purple-700' : isPast ? 'text-green-700' : 'text-slate-500'}`}>
                    Etapa {stageItem.stage}: {stageItem.name}
                  </h4>
                  {isCurrent && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                      Em Andamento
                    </span>
                  )}
                </div>
                
                {info && (
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Início: <span className="font-medium">{moment(info.startDate).format('MMM YYYY')}</span></p>
                    {info.monthsInStage > 1 && (
                      <p>Duração: <span className="font-medium">{info.monthsInStage} {info.monthsInStage === 1 ? 'mês' : 'meses'}</span></p>
                    )}
                  </div>
                )}
                
                {!info && !isCurrent && (
                  <p className="text-sm text-slate-400">Aguardando início</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Estatísticas */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {stages.slice(1).filter(s => getStageInfo(s.stage)).length}
            </p>
            <p className="text-xs text-slate-600">Etapas Completas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {client.current_stage}
            </p>
            <p className="text-xs text-slate-600">Etapa Atual</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-600">
              {6 - client.current_stage}
            </p>
            <p className="text-xs text-slate-600">Etapas Restantes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
