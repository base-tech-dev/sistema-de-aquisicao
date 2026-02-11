import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ClientForm({ client, onSave, onCancel }) {
  const [formData, setFormData] = useState(client || {
    name: '',
    responsible: '',
    sector: 'tecnologia',
    start_date: '',
    current_stage: 1,
    status: 'saudavel',
    logo_url: '',
    banner_url: '',
    brand_color: 'purple'
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange('logo_url', file_url);
    setUploading(false);
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBanner(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange('banner_url', file_url);
    setUploadingBanner(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Nome do Cliente *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome da empresa"
              required
            />
          </div>

          <div>
            <Label>Responsável</Label>
            <Input
              value={formData.responsible}
              onChange={(e) => handleChange('responsible', e.target.value)}
              placeholder="Nome do responsável"
            />
          </div>

          <div>
            <Label>Setor de Atuação *</Label>
            <Select
              value={formData.sector}
              onValueChange={(value) => handleChange('sector', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="varejo">Varejo</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
                <SelectItem value="industria">Indústria</SelectItem>
                <SelectItem value="imoveis">Imóveis</SelectItem>
                <SelectItem value="academia_low_cost">Academia Low Cost</SelectItem>
                <SelectItem value="academia_premium">Academia Premium</SelectItem>
                <SelectItem value="academia_boutique">Academia Boutique</SelectItem>
                <SelectItem value="academia_clube">Academia Clube</SelectItem>
                <SelectItem value="centro_treinamento">Centro de Treinamento</SelectItem>
                <SelectItem value="studio_pilates">Studio de Pilates</SelectItem>
                <SelectItem value="academia_studio">Academia Studio</SelectItem>
                <SelectItem value="fabricante_equipamentos_fitness">Fabricante de Equipamentos Fitness</SelectItem>
                <SelectItem value="concessionaria_popular">Concessionária (Carro Popular)</SelectItem>
                <SelectItem value="concessionaria_100k_300k">Concessionária (100k a 300k)</SelectItem>
                <SelectItem value="concessionaria_301k_500k">Concessionária (301k a 500k)</SelectItem>
                <SelectItem value="clinica_veterinaria">Clínica Veterinária</SelectItem>
                <SelectItem value="farmacia_veterinaria">Farmácia Veterinária</SelectItem>
                <SelectItem value="farmacia">Farmácia</SelectItem>
                <SelectItem value="industria_b2b">Indústria B2B</SelectItem>
                <SelectItem value="clinica_medica_classe_cd">Clínica Médica (Classe C e D)</SelectItem>
                <SelectItem value="clinica_medica_classe_ab">Clínica Médica (Classe A e B)</SelectItem>
                <SelectItem value="restaurante_popular">Restaurante Popular</SelectItem>
                <SelectItem value="restaurante_alto_padrao">Restaurante Alto Padrão</SelectItem>
                <SelectItem value="hamburgueria">Hamburgueria</SelectItem>
                <SelectItem value="registro_marca">Registro de Marca</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data de Início</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Etapa Atual</Label>
            <Select
              value={formData.current_stage?.toString()}
              onValueChange={(value) => handleChange('current_stage', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1. Onboard</SelectItem>
                <SelectItem value="2">2. Geração de Demanda</SelectItem>
                <SelectItem value="3">3. Lead Qualificado</SelectItem>
                <SelectItem value="4">4. Conversão</SelectItem>
                <SelectItem value="5">5. Indicadores</SelectItem>
                <SelectItem value="6">6. Validação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status do Projeto</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saudavel">Saudável</SelectItem>
                <SelectItem value="atencao">Atenção</SelectItem>
                <SelectItem value="critico">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Cor da Marca</Label>
            <Select
              value={formData.brand_color}
              onValueChange={(value) => handleChange('brand_color', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purple">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-600"></div>
                    Roxo
                  </div>
                </SelectItem>
                <SelectItem value="blue">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-600"></div>
                    Azul
                  </div>
                </SelectItem>
                <SelectItem value="green">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-600"></div>
                    Verde
                  </div>
                </SelectItem>
                <SelectItem value="orange">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-600"></div>
                    Laranja
                  </div>
                </SelectItem>
                <SelectItem value="red">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-600"></div>
                    Vermelho
                  </div>
                </SelectItem>
                <SelectItem value="pink">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-pink-600"></div>
                    Rosa
                  </div>
                </SelectItem>
                <SelectItem value="indigo">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-indigo-600"></div>
                    Índigo
                  </div>
                </SelectItem>
                <SelectItem value="teal">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-teal-600"></div>
                    Turquesa
                  </div>
                </SelectItem>
                <SelectItem value="amber">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-600"></div>
                    Âmbar
                  </div>
                </SelectItem>
                <SelectItem value="rose">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-600"></div>
                    Rosa Escuro
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Logo do Cliente (redondo)</Label>
            <div className="flex items-center gap-4">
              {formData.logo_url && (
                <img 
                  src={formData.logo_url} 
                  alt="Logo" 
                  className="w-16 h-16 rounded-full object-cover border-2"
                />
              )}
              <label className="flex-1">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-purple-400 transition-colors">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    {uploading ? 'Enviando...' : 'Upload logo'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <Label>Banner do Cliente</Label>
            <p className="text-xs text-slate-500 mb-2">Recomendado: 1400 x 800 px (proporção 7:4)</p>
            <div className="space-y-3">
              {formData.banner_url && (
                <img 
                  src={formData.banner_url} 
                  alt="Banner" 
                  className="w-full h-32 rounded-xl object-cover border"
                />
              )}
              <label>
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-purple-400 transition-colors">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    {uploadingBanner ? 'Enviando...' : 'Upload banner'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          <Save className="w-4 h-4 mr-2" />
          {client ? 'Atualizar' : 'Criar Cliente'}
        </Button>
      </div>
    </form>
  );
}
