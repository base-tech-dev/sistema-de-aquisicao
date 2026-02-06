import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SectorBenchmark({ clientSector, clients, allStageData, stage, metric, metricLabel }) {
  if (!clientSector) return null;

  const getSectorAverage = () => {
    const sectorClients = clients.filter(c => c.sector === clientSector);
    const sectorData = allStageData.filter(d => 
      sectorClients.some(c => c.id === d.client_id) && d.stage === stage && d[metric]
    );
    
    if (sectorData.length === 0) return null;
    
    const sum = sectorData.reduce((acc, d) => acc + (d[metric] || 0), 0);
    return sum / sectorData.length;
  };

  const sectorAvg = getSectorAverage();
  
  if (!sectorAvg) return null;

  const sectorName = clientSector.charAt(0).toUpperCase() + clientSector.slice(1);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-200 p-5">
      <p className="text-sm font-medium text-blue-700 mb-2">📊 Média do Setor: {sectorName}</p>
      <p className="text-2xl font-bold text-blue-800">
        {metricLabel === 'R$' ? 'R$ ' : ''}
        {sectorAvg.toFixed(2)}
        {metricLabel === '%' ? '%' : metricLabel === 'x' ? 'x' : ''}
      </p>
      <p className="text-xs text-blue-600 mt-1">Baseado em {clients.filter(c => c.sector === clientSector).length} clientes do setor</p>
    </div>
  );
}
