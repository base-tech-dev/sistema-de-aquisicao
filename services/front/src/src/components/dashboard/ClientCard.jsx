import React from 'react';
import { Building2, Calendar, ArrowRight, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ClientAlerts from './ClientAlerts';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const stageNames = {
  1: "Onboard",
  2: "Geração de Demanda",
  3: "Lead Qualificado",
  4: "Conversão",
  5: "Indicadores",
  6: "Validação"
};

export default function ClientCard({ client, onClick, isSelected, latestStageData }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:shadow-lg relative",
        isSelected 
          ? "border-purple-400 shadow-lg shadow-purple-100 ring-2 ring-purple-200" 
          : "border-slate-200 hover:border-purple-200"
      )}
    >
      {latestStageData && <ClientAlerts client={client} latestStageData={latestStageData} />}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {client.logo_url ? (
            <img 
              src={client.logo_url} 
              alt={client.name} 
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-800">{client.name}</h3>
            {client.responsible && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                {client.responsible}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={client.status} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-500 mb-1">Etapa Atual</p>
          <p className="text-sm font-medium text-purple-700">
            {client.current_stage}. {stageNames[client.current_stage]}
          </p>
        </div>
        {client.start_date && (
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Início</p>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(client.start_date), "dd MMM yyyy", { locale: ptBR })}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end mt-4 text-purple-600 text-sm font-medium">
        Ver detalhes
        <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
}
