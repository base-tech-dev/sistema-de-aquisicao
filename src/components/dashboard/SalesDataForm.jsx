import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from 'lucide-react';

export default function SalesDataForm({ stage, initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <h3 className="text-green-800 font-bold text-lg mb-4 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          Dados de Vendas - Etapa {stage}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Vendas Realizadas</Label>
            <Input
              type="number"
              value={formData.sales_count || ''}
              onChange={(e) => handleChange('sales_count', parseInt(e.target.value))}
              placeholder="0"
            />
          </div>
          <div>
            <Label>Receita Total (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.revenue || ''}
              onChange={(e) => handleChange('revenue', parseFloat(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-4 border border-green-200">
          <p className="text-xs text-slate-600">
            <strong>ℹ️ Cálculos automáticos:</strong>
            <br />
            • <strong>Taxa de Conversão</strong> será calculada automaticamente (Vendas ÷ Leads × 100)
            <br />
            • <strong>CAC</strong> será calculado automaticamente (Investimento Total ÷ Vendas)
            <br />
            • <strong>ROAS</strong> será calculado automaticamente (Receita ÷ Investimento Total)
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar Dados de Vendas
        </Button>
      </div>
    </form>
  );
}
