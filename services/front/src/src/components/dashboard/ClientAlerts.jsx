import React from 'react';
import { AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

export default function ClientAlerts({ client, latestStageData }) {
  const alerts = [];

  // Verificar CPL acima da meta (Etapa 2)
  if (latestStageData[2]) {
    const data = latestStageData[2];
    if (data.cpl_client && data.cpl_market && data.cpl_client > data.cpl_market * 1.2) {
      alerts.push({
        type: 'danger',
        icon: TrendingDown,
        message: 'CPL 20% acima da meta de mercado',
        stage: 2
      });
    }
  }

  // Verificar custo MQL acima da meta (Etapa 3)
  if (latestStageData[3]) {
    const data = latestStageData[3];
    const stage2Data = latestStageData[2];
    const cplBase = stage2Data?.cpl_client || 10;
    const mqlMeta = cplBase * 4;
    
    if (data.mql_cost && data.mql_cost > mqlMeta * 1.3) {
      alerts.push({
        type: 'danger',
        icon: DollarSign,
        message: 'Custo MQL 30% acima da meta',
        stage: 3
      });
    }
  }

  // Verificar frequência baixa
  Object.keys(latestStageData).forEach(stage => {
    const data = latestStageData[stage];
    if (data.frequency && data.frequency < 1.5) {
      alerts.push({
        type: 'warning',
        icon: AlertTriangle,
        message: `Frequência baixa (${data.frequency.toFixed(1)}x) na etapa ${stage}`,
        stage: parseInt(stage)
      });
    }
  });

  // Verificar ROAS baixo (Etapa 5)
  if (latestStageData[5]) {
    const data = latestStageData[5];
    if (data.roas && data.roas < 2) {
      alerts.push({
        type: 'warning',
        icon: DollarSign,
        message: `ROAS baixo (${data.roas.toFixed(1)}x)`,
        stage: 5
      });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <div className="absolute top-2 right-2 z-10">
      <div className="bg-white rounded-lg shadow-lg border-2 border-orange-200 p-2">
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-bold text-orange-700">{alerts.length}</span>
        </div>
      </div>
    </div>
  );
}
