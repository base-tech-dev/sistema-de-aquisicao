import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, X } from 'lucide-react';

export default function DataEntryForm({ stage, initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderFields = () => {
    switch (stage) {
      case 2:
        return (
          <>
            {/* Separação 1: Dados da Campanha de Leads */}
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <h4 className="text-purple-700 font-semibold mb-4 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                Dados da Campanha de Leads
              </h4>
              <div className="space-y-4">
                <div>
                  <Label>Investimento Campanha Leads (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.investment_lead_generation || ''}
                    onChange={(e) => handleChange('investment_lead_generation', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>CPL Mercado (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cpl_market || ''}
                      onChange={(e) => handleChange('cpl_market', parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>CPL Base Tech (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cpl_basetech || ''}
                      onChange={(e) => handleChange('cpl_basetech', parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>CPL Cliente Mês (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cpl_client || ''}
                      onChange={(e) => handleChange('cpl_client', parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>CPL Acumulado (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cpl_accumulated || ''}
                      onChange={(e) => handleChange('cpl_accumulated', parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Leads WhatsApp</Label>
                  <Input
                    type="number"
                    value={formData.leads_whatsapp || ''}
                    onChange={(e) => handleChange('leads_whatsapp', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Separação 2: Dados da Campanha de Reconhecimento */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h4 className="text-blue-700 font-semibold mb-4 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Dados da Campanha de Reconhecimento
              </h4>
              <div className="space-y-4">
                <div>
                  <Label>Investimento Campanha Reconhecimento (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.investment_brand_awareness || ''}
                    onChange={(e) => handleChange('investment_brand_awareness', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Alcance</Label>
                  <Input
                    type="number"
                    value={formData.reach || ''}
                    onChange={(e) => handleChange('reach', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Impressões</Label>
                  <Input
                    type="number"
                    value={formData.impressions || ''}
                    onChange={(e) => handleChange('impressions', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Frequência</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.frequency || ''}
                    onChange={(e) => handleChange('frequency', parseFloat(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
              </div>
              </div>
            </div>

            {/* Projeção para Próxima Etapa */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h4 className="text-slate-700 font-semibold mb-4 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                Projeção para Etapa 3
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>MQLs Projetados</Label>
                  <Input
                    type="number"
                    value={formData.projection_mql_quantity || ''}
                    onChange={(e) => handleChange('projection_mql_quantity', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Custo MQL Projetado (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.projection_mql_cost || ''}
                    onChange={(e) => handleChange('projection_mql_cost', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Quantidade de MQL</Label>
                <Input
                  type="number"
                  value={formData.mql_quantity || ''}
                  onChange={(e) => handleChange('mql_quantity', parseInt(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Custo MQL Mês (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.mql_cost || ''}
                  onChange={(e) => handleChange('mql_cost', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Custo MQL Acumulado (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.mql_cost_accumulated || ''}
                  onChange={(e) => handleChange('mql_cost_accumulated', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <Label className="text-purple-700 font-semibold mb-3 block">Estratégia de Melhoria com Testes A/B</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Taxa Conversão Atual (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.current_conversion_rate || ''}
                    onChange={(e) => handleChange('current_conversion_rate', parseFloat(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label className="text-xs">Melhoria Esperada (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.target_conversion_improvement || ''}
                    onChange={(e) => handleChange('target_conversion_improvement', parseFloat(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label className="text-xs">Custo MQL Projetado (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.projected_mql_cost_improved || ''}
                    onChange={(e) => handleChange('projected_mql_cost_improved', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Conversão LP Base (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.conversion_lp_base || ''}
                onChange={(e) => handleChange('conversion_lp_base', parseFloat(e.target.value))}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label>Conversão LP A (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.conversion_lp_a || ''}
                onChange={(e) => handleChange('conversion_lp_a', parseFloat(e.target.value))}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label>Conversão LP B (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.conversion_lp_b || ''}
                onChange={(e) => handleChange('conversion_lp_b', parseFloat(e.target.value))}
                placeholder="0.0"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>CAC (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cac || ''}
                  onChange={(e) => handleChange('cac', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>ROAS</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.roas || ''}
                  onChange={(e) => handleChange('roas', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>MQL</Label>
                <Input
                  type="number"
                  value={formData.mql_quantity || ''}
                  onChange={(e) => handleChange('mql_quantity', parseInt(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Taxa de Conversão (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.funnel_conversion || ''}
                  onChange={(e) => handleChange('funnel_conversion', parseFloat(e.target.value))}
                  placeholder="0.0"
                />
              </div>
            </div>
          </>
        );
      case 6:
        return (
          <>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <Switch
                checked={formData.validation_stages_ok || false}
                onCheckedChange={(checked) => handleChange('validation_stages_ok', checked)}
              />
              <Label>Etapas funcionaram conforme esperado?</Label>
            </div>
            <div>
              <Label>Gargalos Identificados</Label>
              <Textarea
                value={formData.validation_bottlenecks || ''}
                onChange={(e) => handleChange('validation_bottlenecks', e.target.value)}
                placeholder="Descreva os gargalos identificados..."
                className="h-24"
              />
            </div>
            <div>
              <Label>Próximos Ajustes Definidos</Label>
              <Textarea
                value={formData.validation_next_steps || ''}
                onChange={(e) => handleChange('validation_next_steps', e.target.value)}
                placeholder="Descreva os próximos passos..."
                className="h-24"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Mês/Ano</Label>
          <Input
            type="month"
            value={formData.month || ''}
            onChange={(e) => handleChange('month', e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Investimento Acumulado (R$)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.accumulated_investment || ''}
            onChange={(e) => handleChange('accumulated_investment', parseFloat(e.target.value))}
            placeholder="0.00"
          />
        </div>
      </div>

      {renderFields()}

      <div>
        <Label>Observações</Label>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Observações adicionais..."
          className="h-20"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
    </form>
  );
}
