import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Tag, Star, Trash2 } from 'lucide-react';
import moment from 'moment';

const tagColors = {
  insight: 'bg-blue-100 text-blue-700 border-blue-300',
  alerta: 'bg-red-100 text-red-700 border-red-300',
  oportunidade: 'bg-green-100 text-green-700 border-green-300',
  risco: 'bg-orange-100 text-orange-700 border-orange-300',
  melhoria: 'bg-purple-100 text-purple-700 border-purple-300',
  sucesso: 'bg-emerald-100 text-emerald-700 border-emerald-300'
};

export default function ClientNotes({ clientId, stage }) {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isImportant, setIsImportant] = useState(false);

  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ['clientNotes', clientId, stage],
    queryFn: () => base44.entities.ClientNote.filter({ client_id: clientId, stage }),
  });

  const createNoteMutation = useMutation({
    mutationFn: (data) => base44.entities.ClientNote.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientNotes'] });
      setShowForm(false);
      setContent('');
      setSelectedTags([]);
      setIsImportant(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id) => base44.entities.ClientNote.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientNotes'] });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
    createNoteMutation.mutate({
      client_id: clientId,
      stage,
      content: content.trim(),
      tags: selectedTags,
      is_important: isImportant
    });
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_important && !b.is_important) return -1;
    if (!a.is_important && b.is_important) return 1;
    return b.created_date.localeCompare(a.created_date);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          Notas e Observações
        </h3>
        <Button 
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nova Nota
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva sua observação..."
            className="mb-3"
            rows={3}
          />
          
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Tags:
            </span>
            {Object.keys(tagColors).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2 py-1 rounded-full border transition-all ${
                  selectedTags.includes(tag)
                    ? tagColors[tag]
                    : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsImportant(!isImportant)}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg border transition-all ${
                isImportant
                  ? 'bg-amber-100 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
              }`}
            >
              <Star className={`w-4 h-4 ${isImportant ? 'fill-current' : ''}`} />
              Importante
            </button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={!content.trim()}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      {sortedNotes.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">Nenhuma nota ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotes.map(note => (
            <div 
              key={note.id}
              className={`p-4 rounded-xl border transition-all ${
                note.is_important
                  ? 'bg-amber-50 border-amber-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {note.is_important && (
                    <Star className="w-4 h-4 text-amber-600 fill-current" />
                  )}
                  <span className="text-xs text-slate-500">
                    {moment(note.created_date).format('DD/MM/YYYY HH:mm')} • {note.created_by}
                  </span>
                </div>
                <button
                  onClick={() => deleteNoteMutation.mutate(note.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-slate-700 mb-2 whitespace-pre-wrap">{note.content}</p>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {note.tags.map((tag, idx) => (
                    <Badge key={idx} className={tagColors[tag]}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
