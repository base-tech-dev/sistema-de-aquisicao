import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Globe } from 'lucide-react';

export default function LanguageSettings() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['settings', 'language'],
    queryFn: () => base44.entities.AppSettings.filter({ category: 'language' }),
  });

  const saveSetting = useMutation({
    mutationFn: async (value) => {
      const existing = settings.find(s => s.setting_key === 'language');
      if (existing) {
        return base44.entities.AppSettings.update(existing.id, { setting_value: value });
      }
      return base44.entities.AppSettings.create({
        setting_key: 'language',
        setting_value: value,
        category: 'language'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage = settings.find(s => s.setting_key === 'language')?.setting_value || 'pt-BR';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-slate-800">Idioma do Sistema</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => saveSetting.mutate(lang.code)}
            className={`relative p-5 rounded-xl border-2 transition-all text-left ${
              currentLanguage === lang.code 
                ? 'border-purple-600 bg-purple-50 shadow-md' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{lang.flag}</span>
              <div>
                <p className="font-semibold text-slate-800">{lang.name}</p>
                <p className="text-xs text-slate-500">{lang.code}</p>
              </div>
            </div>
            {currentLanguage === lang.code && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
