import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload } from 'lucide-react';

export default function SquadForm({ squad, clients, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: squad?.name || '',
    description: squad?.description || '',
    team_photo_url: squad?.team_photo_url || '',
    team_members: squad?.team_members || [],
    client_ids: squad?.client_ids || [],
    color: squad?.color || 'purple',
  });
  const [uploading, setUploading] = useState(false);

  const colors = ['purple', 'blue', 'green', 'orange', 'red', 'pink'];

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team_members: [...formData.team_members, { name: '', role: '', photo_url: '', email: '' }]
    });
  };

  const removeTeamMember = (index) => {
    setFormData({
      ...formData,
      team_members: formData.team_members.filter((_, i) => i !== index)
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updated = [...formData.team_members];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, team_members: updated });
  };

  const toggleClient = (clientId) => {
    const isSelected = formData.client_ids.includes(clientId);
    setFormData({
      ...formData,
      client_ids: isSelected
        ? formData.client_ids.filter(id => id !== clientId)
        : [...formData.client_ids, clientId]
    });
  };

  const handlePhotoUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      updateTeamMember(index, 'photo_url', file_url);
    } finally {
      setUploading(false);
    }
  };

  const handleTeamPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, team_photo_url: file_url });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Squad *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="color">Cor</Label>
          <div className="flex gap-2 mt-2">
            {colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-lg bg-${color}-600 ${
                  formData.color === color ? 'ring-2 ring-offset-2 ring-slate-800' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="team-photo">Foto do Time</Label>
        <Input
          id="team-photo"
          type="file"
          accept="image/*"
          onChange={handleTeamPhotoUpload}
          disabled={uploading}
          className="mt-2"
        />
        {formData.team_photo_url && (
          <img src={formData.team_photo_url} alt="Team" className="mt-2 w-32 h-32 rounded-lg object-cover" />
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Membros do Time</Label>
          <Button type="button" size="sm" onClick={addTeamMember} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
        <div className="space-y-3">
          {formData.team_members.map((member, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-700">Membro {index + 1}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTeamMember(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Nome"
                  value={member.name}
                  onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Cargo"
                  value={member.role}
                  onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                />
                <Input
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                />
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, index)}
                    disabled={uploading}
                  />
                  {member.photo_url && (
                    <img src={member.photo_url} alt={member.name} className="mt-2 w-12 h-12 rounded-full object-cover" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Clientes do Squad</Label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {clients.map(client => (
            <button
              key={client.id}
              type="button"
              onClick={() => toggleClient(client.id)}
              className={`p-3 rounded-lg border-2 text-left text-sm transition-all ${
                formData.client_ids.includes(client.id)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {client.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
          Salvar
        </Button>
      </div>
    </form>
  );
}
