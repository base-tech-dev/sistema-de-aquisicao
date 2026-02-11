import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Users, Edit2, Trash2 } from 'lucide-react';
import SquadForm from './SquadForm';

export default function SquadManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingSquad, setEditingSquad] = useState(null);
  const queryClient = useQueryClient();

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => base44.entities.Squad.list('-created_date'),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const createSquad = useMutation({
    mutationFn: (data) => base44.entities.Squad.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      setShowForm(false);
    },
  });

  const updateSquad = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Squad.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      setEditingSquad(null);
      setShowForm(false);
    },
  });

  const deleteSquad = useMutation({
    mutationFn: (id) => base44.entities.Squad.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
    },
  });

  const getSquadClients = (clientIds) => {
    return clients.filter(c => clientIds?.includes(c.id));
  };

  const colorClasses = {
    purple: 'from-purple-600 to-purple-800',
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    orange: 'from-orange-600 to-orange-800',
    red: 'from-red-600 to-red-800',
    pink: 'from-pink-600 to-pink-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gerenciar Squads</h2>
          <p className="text-sm text-slate-500">Organize times e clientes por squad</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Squad
        </Button>
      </div>

      {squads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum squad cadastrado</h3>
          <p className="text-sm text-slate-500 mb-4">Crie seu primeiro squad para organizar times e clientes.</p>
          <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Criar Squad
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {squads.map(squad => (
            <div key={squad.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className={`h-32 bg-gradient-to-br ${colorClasses[squad.color || 'purple']} relative`}>
                {squad.team_photo_url && (
                  <img 
                    src={squad.team_photo_url} 
                    alt="Team" 
                    className="w-full h-full object-cover opacity-30"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{squad.name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                {squad.description && (
                  <p className="text-sm text-slate-600 mb-4">{squad.description}</p>
                )}

                {squad.team_members && squad.team_members.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">TIME</p>
                    <div className="flex flex-wrap gap-2">
                      {squad.team_members.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                          {member.photo_url && (
                            <img src={member.photo_url} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                          )}
                          <div>
                            <p className="text-xs font-medium text-slate-700">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">CLIENTES</p>
                  <div className="flex flex-wrap gap-2">
                    {getSquadClients(squad.client_ids).map(client => (
                      <div key={client.id} className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">
                        {client.name}
                      </div>
                    ))}
                    {(!squad.client_ids || squad.client_ids.length === 0) && (
                      <p className="text-xs text-slate-400">Nenhum cliente atribuído</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSquad(squad);
                      setShowForm(true);
                    }}
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSquad.mutate(squad.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingSquad(null);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSquad ? 'Editar Squad' : 'Novo Squad'}</DialogTitle>
          </DialogHeader>
          <SquadForm
            squad={editingSquad}
            clients={clients}
            onSave={(data) => {
              if (editingSquad) {
                updateSquad.mutate({ id: editingSquad.id, data });
              } else {
                createSquad.mutate(data);
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingSquad(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
