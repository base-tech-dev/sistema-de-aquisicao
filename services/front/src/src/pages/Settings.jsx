import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Users, 
  Palette, 
  Globe, 
  BarChart3, 
  History,
  Shield,
  ArrowLeft,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

import AppearanceSettings from '../components/settings/AppearanceSettings';
import LanguageSettings from '../components/settings/LanguageSettings';
import ChartSettings from '../components/settings/ChartSettings';
import SquadManagement from '../components/settings/SquadManagement';
import UserManagement from '../components/settings/UserManagement';
import VersionControl from '../components/settings/VersionControl';
import ClientManagement from '../components/settings/ClientManagement';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState('appearance');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Configurações</h1>
                <p className="text-xs text-slate-500">Sistema de Aquisição v2.0</p>
              </div>
            </div>
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Sistema
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="appearance" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Palette className="w-4 h-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="language" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Globe className="w-4 h-4 mr-2" />
              Idioma
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Building2 className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="squads" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Users className="w-4 h-4 mr-2" />
              Squads
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Shield className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="versions" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <History className="w-4 h-4 mr-2" />
              Versões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="language">
            <LanguageSettings />
          </TabsContent>

          <TabsContent value="charts">
            <ChartSettings />
          </TabsContent>

          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="squads">
            <SquadManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="versions">
            <VersionControl />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
