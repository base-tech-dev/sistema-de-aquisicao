import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Trash2, Users, Edit2, CheckSquare } from 'lucide-react';
import StatusBadge from '../dashboard/StatusBadge';

export default function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSquadId, setSelectedSquadId] = useState('');
  const [bulkEditData, setBulkEditData] = useState({
    status: '',
    current_stage: '',
    brand_color: ''
  });

  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
  });

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => base44.entities.Squad.list('-created_date'),
  });

  const deleteClientsMutation = useMutation({
    mutationFn: async (clientIds) => {
      for (const id of clientIds) {
        await base44.entities.Client.delete(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      setSelectedClients([]);
      setShowDeleteDialog(false);
    },
  });

  const updateClientsMutation = useMutation({
    mutationFn: async ({ clientIds, data }) => {
      for (const id of clientIds) {
        const updateData = {};
        if (data.status) updateData.status = data.status;
        if (data.current_stage) updateData.current_stage = parseInt(data.current_stage);
        if (data.brand_color) updateData.brand_color = data.brand_color;
        await base44.entities.Client.update(id, updateData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setSelectedClients([]);
      setShowEditDialog(false);
      setBulkEditData({ status: '', current_stage: '', brand_color: '' });
    },
  });

  const moveToSquadMutation = useMutation({
    mutationFn: async ({ clientIds, squadId }) => {
      if (!squadId) return;
      
      const squad = squads.find(s => s.id === squadId);
      if (!squad) return;

      const updatedClientIds = [...new Set([...(squad.client_ids || []), ...clientIds])];
      await base44.entities.Squad.update(squadId, { client_ids: updatedClientIds });

      // Remove clients from other squads
      for (const s of squads) {
        if (s.id !== squadId && s.client_ids?.some(id => clientIds.includes(id))) {
          const newClientIds = s.client_ids.filter(id => !clientIds.includes(id));
          await base44.entities.Squad.update(s.id, { client_ids: newClientIds });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      setSelectedClients([]);
      setShowMoveDialog(false);
      setSelectedSquadId('');
    },
  });

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.responsible?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectClient = (clientId) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const getClientSquad = (clientId) => {
    return squads.find(s => s.client_ids?.includes(clientId));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Gerenciar Clientes</h2>
            <p className="text-sm text-slate-500 mt-1">
              {selectedClients.length > 0 
                ? `${selectedClients.length} cliente(s) selecionado(s)` 
                : `${clients.length} cliente(s) total`}
            </p>
          </div>
          
          {selectedClients.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowMoveDialog(true)}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Mover para Squad
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(true)}
                className="text-purple-600 border-purple-300 hover:bg-purple-50"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar em Massa
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir ({selectedClients.length})
              </Button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Squad</TableHead>
                <TableHead>Setor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map(client => {
                  const squad = getClientSquad(client.id);
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={() => toggleSelectClient(client.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="text-slate-600">{client.responsible || '-'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
                          Etapa {client.current_stage}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={client.status} />
                      </TableCell>
                      <TableCell>
                        {squad ? (
                          <span className="text-sm text-slate-600">{squad.name}</span>
                        ) : (
                          <span className="text-sm text-slate-400">Sem squad</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 capitalize">
                        {client.sector?.replace(/_/g, ' ') || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Move to Squad Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mover para Squad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              Mover {selectedClients.length} cliente(s) para o squad:
            </p>
            <Select value={selectedSquadId} onValueChange={setSelectedSquadId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar squad..." />
              </SelectTrigger>
              <SelectContent>
                {squads.map(squad => (
                  <SelectItem key={squad.id} value={squad.id}>
                    {squad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => moveToSquadMutation.mutate({ 
                clientIds: selectedClients, 
                squadId: selectedSquadId 
              })}
              disabled={!selectedSquadId || moveToSquadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Mover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit in Bulk Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar em Massa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-slate-600 mb-4">
              Editar {selectedClients.length} cliente(s). Deixe em branco os campos que não deseja alterar.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Select value={bulkEditData.status} onValueChange={(val) => setBulkEditData(prev => ({ ...prev, status: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Manter atual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saudavel">Saudável</SelectItem>
                  <SelectItem value="atencao">Atenção</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Etapa Atual</label>
              <Select value={bulkEditData.current_stage} onValueChange={(val) => setBulkEditData(prev => ({ ...prev, current_stage: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Manter atual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Etapa 1</SelectItem>
                  <SelectItem value="2">Etapa 2</SelectItem>
                  <SelectItem value="3">Etapa 3</SelectItem>
                  <SelectItem value="4">Etapa 4</SelectItem>
                  <SelectItem value="5">Etapa 5</SelectItem>
                  <SelectItem value="6">Etapa 6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cor da Marca</label>
              <Select value={bulkEditData.brand_color} onValueChange={(val) => setBulkEditData(prev => ({ ...prev, brand_color: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Manter atual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purple">Roxo</SelectItem>
                  <SelectItem value="blue">Azul</SelectItem>
                  <SelectItem value="green">Verde</SelectItem>
                  <SelectItem value="orange">Laranja</SelectItem>
                  <SelectItem value="red">Vermelho</SelectItem>
                  <SelectItem value="pink">Rosa</SelectItem>
                  <SelectItem value="indigo">Índigo</SelectItem>
                  <SelectItem value="teal">Turquesa</SelectItem>
                  <SelectItem value="amber">Âmbar</SelectItem>
                  <SelectItem value="rose">Rosé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => updateClientsMutation.mutate({ 
                clientIds: selectedClients, 
                data: bulkEditData 
              })}
              disabled={updateClientsMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {selectedClients.length} cliente(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os dados dos clientes selecionados serão permanentemente excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteClientsMutation.mutate(selectedClients)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
