import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Check, Clock, GitBranch, User } from 'lucide-react';

export default function VersionControl() {
  const queryClient = useQueryClient();

  const { data: versions = [] } = useQuery({
    queryKey: ['versions'],
    queryFn: () => base44.entities.SystemVersion.list('-created_date'),
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    const initializeVersioning = async () => {
      if (versions.length === 0 && user) {
        await base44.entities.SystemVersion.create({
          version: '2.0.0',
          name: 'Sistema de Aquisição v2.0',
          description: 'Versão inicial com configurações, squads, e análise por setor',
          changes: [
            'Sistema de configurações (cores, idioma, gráficos)',
            'Gerenciamento de squads e times',
            'Análise de métricas por setor',
            'Projeções em cada etapa',
            'Investimento em ads por etapa',
            'Controle de versões automático'
          ],
          is_active: true,
          release_date: new Date().toISOString(),
          edited_by: user.email
        });
        queryClient.invalidateQueries({ queryKey: ['versions'] });
      }
    };
    initializeVersioning();
  }, [versions.length, user]);

  const activateVersion = useMutation({
    mutationFn: async (versionId) => {
      // Desativar todas as versões
      await Promise.all(
        versions.map(v => 
          base44.entities.SystemVersion.update(v.id, { is_active: false })
        )
      );
      // Ativar a versão selecionada
      await base44.entities.SystemVersion.update(versionId, { is_active: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    },
  });

  const activeVersion = versions.find(v => v.is_active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Controle de Versões</h2>
        <p className="text-sm text-slate-500">Gerencie e alterne entre versões do sistema</p>
      </div>

      {activeVersion && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Versão Ativa</p>
              <h3 className="text-2xl font-bold">{activeVersion.name}</h3>
            </div>
          </div>
          <p className="text-sm opacity-90">v{activeVersion.version}</p>
        </div>
      )}

      <div className="space-y-4">
        {versions.map(version => (
          <div 
            key={version.id} 
            className={`bg-white rounded-xl border-2 p-6 transition-all ${
              version.is_active 
                ? 'border-purple-600 shadow-md' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <GitBranch className={`w-5 h-5 ${version.is_active ? 'text-purple-600' : 'text-slate-400'}`} />
                  <h3 className="text-lg font-semibold text-slate-800">{version.name}</h3>
                  <span className="text-sm font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    v{version.version}
                  </span>
                  {version.is_active && (
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ATIVA
                    </span>
                  )}
                </div>
                
                {version.description && (
                  <p className="text-sm text-slate-600 mb-3">{version.description}</p>
                )}

                {version.changes && version.changes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Alterações:</p>
                    <ul className="space-y-1">
                      {version.changes.map((change, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {version.release_date && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(version.release_date).toLocaleString('pt-BR')}
                    </div>
                  )}
                  {version.edited_by && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {version.edited_by}
                    </div>
                  )}
                </div>
              </div>
              
              {!version.is_active && (
                <Button
                  onClick={() => {
                    if (confirm(`Deseja reverter para a versão ${version.version}? Isso mudará o sistema para esta versão.`)) {
                      activateVersion.mutate(version.id);
                      setTimeout(() => window.location.reload(), 1000);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  disabled={activateVersion.isPending}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  Reverter para esta versão
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {versions.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma versão registrada</h3>
          <p className="text-sm text-slate-500">As versões do sistema aparecerão aqui.</p>
        </div>
      )}
    </div>
  );
}
