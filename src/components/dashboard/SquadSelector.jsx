import React from 'react';
import { Users, Building2, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function SquadSelector({ squads, selectedSquadId, onSelect, showAll = false, clientsCount = {} }) {
  const colorClasses = {
    purple: 'from-purple-600 to-purple-800',
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    orange: 'from-orange-600 to-orange-800',
    red: 'from-red-600 to-red-800',
    pink: 'from-pink-600 to-pink-800',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-slate-800">Selecionar Squad</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showAll && (
          <button
            onClick={() => onSelect('all')}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all hover:scale-105",
              selectedSquadId === 'all'
                ? "border-purple-600 bg-purple-50 shadow-lg"
                : "border-slate-200 hover:border-purple-300"
            )}
          >
            {selectedSquadId === 'all' && (
              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-purple-600" />
            )}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-slate-800 mb-1">Todos os Squads</p>
            <p className="text-xs text-slate-500">Visão geral completa</p>
          </button>
        )}

        {squads.map(squad => (
          <button
            key={squad.id}
            onClick={() => onSelect(squad.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all hover:scale-105",
              selectedSquadId === squad.id
                ? "border-purple-600 bg-purple-50 shadow-lg"
                : "border-slate-200 hover:border-purple-300"
            )}
          >
            {selectedSquadId === squad.id && (
              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-purple-600" />
            )}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[squad.color || 'purple']} flex items-center justify-center mx-auto mb-3`}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-slate-800 mb-1">{squad.name}</p>
            <p className="text-xs text-slate-500">
              {clientsCount[squad.id] || 0} cliente(s)
            </p>
          </button>
        ))}
      </div>

      {squads.length === 0 && !showAll && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Nenhum squad cadastrado</p>
        </div>
      )}
    </div>
  );
}
