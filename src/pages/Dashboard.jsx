import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Building2, LayoutDashboard, Loader2, Settings, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

import StageFlowChart from '../components/dashboard/StageFlowChart';
import StatusBadge from '../components/dashboard/StatusBadge';
import ClientCard from '../components/dashboard/ClientCard';
import ClientForm from '../components/dashboard/ClientForm';
import MetricCard from '../components/dashboard/MetricCard';
import SectorComparison from '../components/dashboard/SectorComparison';
import SquadSelector from '../components/dashboard/SquadSelector';
import ConsolidatedFunnel from '../components/dashboard/ConsolidatedFunnel';
import SquadComparison from '../components/dashboard/SquadComparison';

const { Client, StageData } = base44.entities;

function DashboardHeader() {
  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  const logoUrl = settings.find(s => s.setting_key === 'logo_url')?.setting_value;

  return (
    <div className="flex items-center gap-4">
      {logoUrl ? (
        <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Base Tech</h1>
            <p className="text-xs text-slate-500">Sistema de Aquisição</p>
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSquadId, setSelectedSquadId] = useState(null);
  const [showMainTabs, setShowMainTabs] = useState(true);
  
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => Client.list('-created_date'),
  });

  const { data: allStageData = [] } = useQuery({
    queryKey: ['stageData'],
    queryFn: () => StageData.list('-created_date'),
  });

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => base44.entities.Squad.list('-created_date'),
  });

  const createClientMutation = useMutation({
    mutationFn: (data) => Client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowClientForm(false);
    },
  });

  const isAdmin = user?.role === 'admin';

  const filteredClients = React.useMemo(() => {
    if (!selectedSquadId || selectedSquadId === 'all') return clients;
    const squad = squads.find(s => s.id === selectedSquadId);
    return clients.filter(c => squad?.client_ids?.includes(c.id));
  }, [clients, selectedSquadId, squads]);

  const getClientSummary = () => {
    const healthy = filteredClients.filter(c => c.status === 'saudavel').length;
    const attention = filteredClients.filter(c => c.status === 'atencao').length;
    const critical = filteredClients.filter(c => c.status === 'critico').length;
    return { healthy, attention, critical, total: filteredClients.length };
  };

  const summary = getClientSummary();

  const getSquadClientsCount = () => {
    return squads.reduce((acc, squad) => {
      acc[squad.id] = clients.filter(c => squad.client_ids?.includes(c.id)).length;
      return acc;
    }, {});
  };

  const getLatestStageData = (clientId) => {
    const clientData = allStageData.filter(d => d.client_id === clientId);
    if (clientData.length === 0) return {};

    const stages = [2, 3, 4, 5, 6];
    const latest = {};
    stages.forEach(stage => {
      const stageRecords = clientData.filter(d => d.stage === stage);
      if (stageRecords.length > 0) {
        latest[stage] = stageRecords.sort((a, b) => b.month?.localeCompare(a.month))[0];
      }
    });
    return latest;
  };

  if (loadingClients) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <DashboardHeader />
            <Button 
              onClick={() => setShowClientForm(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center gap-3 mb-8">
            <TabsList className="bg-white border shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Visão Geral
              </TabsTrigger>
            </TabsList>

            {filteredClients.length > 0 && (
              <Select value={selectedTab === 'overview' ? '' : selectedTab} onValueChange={setSelectedTab}>
                <SelectTrigger className="w-[280px] bg-white">
                  <SelectValue placeholder="Selecionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {client.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Link to={createPageUrl('Settings')} className="ml-auto">
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Squad Selector */}
            {squads.length > 0 && (
              <SquadSelector
                squads={squads}
                selectedSquadId={selectedSquadId}
                onSelect={setSelectedSquadId}
                showAll={isAdmin}
                clientsCount={getSquadClientsCount()}
              />
            )}

            {/* Flow Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Fluxo do Sistema de Aquisição</h2>
              <StageFlowChart currentStage={6} />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Total de Clientes"
                value={summary.total}
                size="large"
              />
              <MetricCard
                title="Projetos Saudáveis"
                value={summary.healthy}
                status={summary.healthy > 0 ? 'success' : null}
              />
              <MetricCard
                title="Projetos em Atenção"
                value={summary.attention}
                status={summary.attention > 0 ? 'warning' : null}
              />
              <MetricCard
                title="Projetos Críticos"
                value={summary.critical}
                status={summary.critical > 0 ? 'danger' : null}
              />
            </div>

            {/* Consolidated Funnel */}
            {filteredClients.length > 0 && (
              <ConsolidatedFunnel clients={filteredClients} allStageData={allStageData} />
            )}

            {/* Squad Comparison */}
            {squads.length > 0 && filteredClients.length > 0 && (
              <SquadComparison squads={squads} clients={clients} allStageData={allStageData} />
            )}

            {/* Sector Comparison */}
            {filteredClients.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Comparação por Setor</h2>
                <SectorComparison clients={filteredClients} allStageData={allStageData} />
              </div>
            )}

            {/* Client Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Clientes
                  {selectedSquadId && selectedSquadId !== 'all' && (
                    <span className="ml-2 text-sm font-normal text-slate-500">
                      • {squads.find(s => s.id === selectedSquadId)?.name}
                    </span>
                  )}
                </h2>
              </div>
              {filteredClients.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum cliente cadastrado</h3>
                  <p className="text-sm text-slate-500 mb-4">Adicione seu primeiro cliente para começar.</p>
                  <Button onClick={() => setShowClientForm(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Cliente
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClients.map(client => {
                    const clientStageData = getLatestStageData(client.id);
                    return (
                      <ClientCard
                        key={client.id}
                        client={client}
                        onClick={() => setSelectedTab(client.id)}
                        latestStageData={clientStageData}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Client Tabs */}
          {filteredClients.map(client => (
            <TabsContent key={client.id} value={client.id}>
              <ClientDetailView 
                client={client} 
                stageData={allStageData.filter(d => d.client_id === client.id)}
                onUpdate={() => queryClient.invalidateQueries({ queryKey: ['clients'] })}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Client Form Dialog */}
      <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <ClientForm
            onSave={(data) => createClientMutation.mutate(data)}
            onCancel={() => setShowClientForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Client Detail View Component
import StageObjectives from '../components/dashboard/StageObjectives';
import Stage2Metrics from '../components/dashboard/Stage2Metrics';
import Stage3Metrics from '../components/dashboard/Stage3Metrics';
import Stage4Metrics from '../components/dashboard/Stage4Metrics';
import Stage5Metrics from '../components/dashboard/Stage5Metrics';
import Stage6Metrics from '../components/dashboard/Stage6Metrics';
import HistoryTable from '../components/dashboard/HistoryTable';
import DataEntryForm from '../components/dashboard/DataEntryForm';
import SalesDataForm from '../components/dashboard/SalesDataForm';
import ProgressTimeline from '../components/dashboard/ProgressTimeline';
import TrendCharts from '../components/dashboard/TrendCharts';
import PDFExporter from '../components/dashboard/PDFExporter';
import ClientNotes from '../components/dashboard/ClientNotes';
import AIProjections from '../components/dashboard/AIProjections';
import { Edit2, History, Trash2, DollarSign } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ClientDetailView({ client, stageData, onUpdate }) {
  const [editingClient, setEditingClient] = useState(false);
  const [addingData, setAddingData] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [editingSalesData, setEditingSalesData] = useState(null);
  const [selectedStage, setSelectedStage] = useState(client.current_stage > 1 ? client.current_stage : 2);
  const [showTabs, setShowTabs] = useState(true);
  
  const brandColor = client.brand_color || 'purple';
  
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => Client.list('-created_date'),
  });

  const { data: allStageData = [] } = useQuery({
    queryKey: ['stageData'],
    queryFn: () => StageData.list('-created_date'),
  });

  const updateClientMutation = useMutation({
    mutationFn: (data) => Client.update(client.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setEditingClient(false);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: () => Client.delete(client.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      onUpdate();
    },
  });

  const createStageDataMutation = useMutation({
    mutationFn: (data) => StageData.create({ ...data, client_id: client.id, stage: addingData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stageData'] });
      setAddingData(null);
    },
  });

  const updateStageDataMutation = useMutation({
    mutationFn: ({ id, data }) => StageData.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stageData'] });
      setEditingData(null);
      setEditingSalesData(null);
    },
  });

  const getStageHistory = (stage) => {
    return stageData
      .filter(d => d.stage === stage)
      .sort((a, b) => a.month?.localeCompare(b.month));
  };

  const getLatestData = (stage) => {
    const history = getStageHistory(stage);
    return history.length > 0 ? history[history.length - 1] : null;
  };

  const getCplReference = () => {
    const stage2Data = getLatestData(2);
    return stage2Data?.cpl_client || 10;
  };

  const getLatestStageData = (clientId) => {
    return stageData
      .reduce((acc, d) => {
        if (!acc[d.stage] || d.month > acc[d.stage].month) {
          acc[d.stage] = d;
        }
        return acc;
      }, {});
  };

  const clientStageData = getLatestStageData(client.id);

  const stages = [2, 3, 4, 5, 6];
  const stageNames = {
    2: "Geração de Demanda",
    3: "Lead Qualificado (MQL)",
    4: "Conversão de Página",
    5: "Indicadores de Vendas",
    6: "Validação"
  };

  return (
    <div className="space-y-6">
      <style>{`
        .client-detail-view .btn-primary {
          background: var(--brand-gradient) !important;
        }
        .client-detail-view .text-brand {
          color: var(--brand-color) !important;
        }
        .client-detail-view .bg-brand {
          background-color: var(--brand-color) !important;
        }
        .client-detail-view .border-brand {
          border-color: var(--brand-color) !important;
        }
        .client-detail-view .shadow-brand {
          box-shadow: 0 10px 40px -10px var(--brand-shadow) !important;
        }
      `}</style>
      <div className="client-detail-view" style={{
        '--brand-color': `var(--color-${brandColor}-600)`,
        '--brand-gradient': `linear-gradient(to bottom right, var(--color-${brandColor}-500), var(--color-${brandColor}-700))`,
        '--brand-shadow': `var(--color-${brandColor}-500)`,
        '--color-purple-500': '#a855f7',
        '--color-purple-600': '#9333ea',
        '--color-purple-700': '#7e22ce',
        '--color-blue-500': '#3b82f6',
        '--color-blue-600': '#2563eb',
        '--color-blue-700': '#1d4ed8',
        '--color-green-500': '#22c55e',
        '--color-green-600': '#16a34a',
        '--color-green-700': '#15803d',
        '--color-orange-500': '#f97316',
        '--color-orange-600': '#ea580c',
        '--color-orange-700': '#c2410c',
        '--color-red-500': '#ef4444',
        '--color-red-600': '#dc2626',
        '--color-red-700': '#b91c1c',
        '--color-pink-500': '#ec4899',
        '--color-pink-600': '#db2777',
        '--color-pink-700': '#be185d',
        '--color-indigo-500': '#6366f1',
        '--color-indigo-600': '#4f46e5',
        '--color-indigo-700': '#4338ca',
        '--color-teal-500': '#14b8a6',
        '--color-teal-600': '#0d9488',
        '--color-teal-700': '#0f766e',
        '--color-amber-500': '#f59e0b',
        '--color-amber-600': '#d97706',
        '--color-amber-700': '#b45309',
        '--color-rose-500': '#f43f5e',
        '--color-rose-600': '#e11d48',
        '--color-rose-700': '#be123c'
      }}>
      {/* Client Header com Banner e Logo */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="relative h-40 bg-gradient-to-r from-purple-600 to-indigo-600">
          {client.banner_url && (
            <img 
              src={client.banner_url} 
              alt={client.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Profile Section */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-16">
            <div className="flex items-end gap-4">
              {/* Logo Redondo */}
              <div className="relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden flex-shrink-0 z-10">
                {client.logo_url ? (
                  <img 
                    src={client.logo_url} 
                    alt={client.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-purple-600" />
                  </div>
                )}
              </div>
              
              {/* Client Info */}
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{client.name}</h2>
                {client.responsible && (
                  <p className="text-sm text-slate-500">{client.responsible}</p>
                )}
              </div>
            </div>
            
            <div className="pb-2 flex items-center gap-2">
              <StatusBadge status={client.status} size="large" />
              <Button variant="outline" size="sm" onClick={() => setEditingClient(true)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Todos os dados do cliente serão perdidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteClientMutation.mutate()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <StageFlowChart currentStage={client.current_stage} brandColor={brandColor} />
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex items-center gap-3 mt-6">
        {showTabs && (
          <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
            {stages.map(stage => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedStage === stage
                    ? `bg-${brandColor}-600 text-white shadow-lg shadow-${brandColor}-200`
                    : `bg-white text-slate-600 border border-slate-200 hover:border-${brandColor}-300`
                }`}
              >
                Etapa {stage}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowTabs(!showTabs)}
          className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors text-slate-600"
          title={showTabs ? "Ocultar abas" : "Mostrar abas"}
        >
          {showTabs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Stage Content */}
      <div className="space-y-6">
        <StageObjectives stage={selectedStage} brandColor={brandColor} />

        {/* Timeline de Progresso */}
        <ProgressTimeline client={client} stageData={stageData} />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Métricas - {stageNames[selectedStage]}</h3>
          <div className="flex gap-2">
            <PDFExporter 
              client={client} 
              stageData={stageData} 
              latestStageData={clientStageData}
            />
            <Button 
              onClick={() => {
                const latestData = getLatestData(selectedStage);
                if (latestData) {
                  setEditingSalesData(latestData);
                }
              }} 
              variant="outline"
              className="text-green-600 border-green-300 hover:bg-green-50"
              disabled={!getLatestData(selectedStage)}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Dados de Vendas
            </Button>
            <Button onClick={() => setAddingData(selectedStage)} className={`bg-${brandColor}-600 hover:bg-${brandColor}-700`}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Dados
            </Button>
          </div>
        </div>

        {selectedStage === 2 && (
          <Stage2Metrics 
            data={getLatestData(2)} 
            history={getStageHistory(2)}
            allStageData={stageData}
            clientSector={client.sector}
            clients={clients}
            allClientStageData={allStageData}
          />
        )}
        {selectedStage === 3 && (
          <Stage3Metrics 
            data={getLatestData(3)} 
            cplReference={getCplReference()}
            allStageData={stageData}
            history={getStageHistory(3)}
            clientSector={client.sector}
            clients={clients}
            allClientStageData={allStageData}
          />
        )}
        {selectedStage === 4 && (
          <Stage4Metrics 
            data={getLatestData(4)} 
            previousData={getStageHistory(4).length > 1 ? getStageHistory(4)[getStageHistory(4).length - 2] : null}
            allStageData={stageData}
            history={getStageHistory(4)}
          />
        )}
        {selectedStage === 5 && (
          <Stage5Metrics 
            data={getLatestData(5)} 
            history={getStageHistory(5)}
            allStageData={stageData}
          />
        )}
        {selectedStage === 6 && (
          <Stage6Metrics 
            data={getLatestData(6)}
            allStageData={stageData}
            history={getStageHistory(6)}
          />
        )}

        {/* AI Projections */}
        <AIProjections clientId={client.id} stageData={stageData} stage={selectedStage} />

        {/* Client Notes */}
        <ClientNotes clientId={client.id} stage={selectedStage} />

        {/* Trend Charts */}
        {getStageHistory(selectedStage).length >= 2 && (
          <TrendCharts stageData={stageData} stage={selectedStage} />
        )}

        {/* History */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="history" className="border rounded-2xl bg-white">
            <AccordionTrigger className="px-6 hover:no-underline">
              <span className="flex items-center gap-2 text-slate-700">
                <History className="w-4 h-4" />
                Histórico Mensal
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <HistoryTable 
                data={getStageHistory(selectedStage)} 
                stage={selectedStage}
                onEdit={(data) => setEditingData(data)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={editingClient} onOpenChange={setEditingClient}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <ClientForm
            client={client}
            onSave={(data) => updateClientMutation.mutate(data)}
            onCancel={() => setEditingClient(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Data Dialog */}
      <Dialog open={addingData !== null} onOpenChange={() => setAddingData(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Dados - Etapa {addingData}</DialogTitle>
          </DialogHeader>
          <DataEntryForm
            stage={addingData}
            onSave={(data) => createStageDataMutation.mutate(data)}
            onCancel={() => setAddingData(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Data Dialog */}
      <Dialog open={editingData !== null} onOpenChange={() => setEditingData(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Dados - {editingData?.month} - Etapa {editingData?.stage}</DialogTitle>
          </DialogHeader>
          <DataEntryForm
            stage={editingData?.stage}
            initialData={editingData}
            onSave={(data) => updateStageDataMutation.mutate({ id: editingData.id, data })}
            onCancel={() => setEditingData(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Sales Data Dialog */}
      <Dialog open={editingSalesData !== null} onOpenChange={() => setEditingSalesData(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Dados de Vendas - {editingSalesData?.month} - Etapa {editingSalesData?.stage}</DialogTitle>
          </DialogHeader>
          <SalesDataForm
            stage={editingSalesData?.stage}
            initialData={editingSalesData}
            onSave={(data) => updateStageDataMutation.mutate({ id: editingSalesData.id, data })}
            onCancel={() => setEditingSalesData(null)}
          />
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
