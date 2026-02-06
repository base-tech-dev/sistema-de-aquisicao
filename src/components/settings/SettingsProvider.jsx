import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const SettingsContext = createContext({});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  const [appliedSettings, setAppliedSettings] = useState({
    theme_color: 'purple',
    language: 'pt-BR',
    chart_type: 'line',
    logo_url: ''
  });

  useEffect(() => {
    const newSettings = {};
    settings.forEach(s => {
      newSettings[s.setting_key] = s.setting_value;
    });
    setAppliedSettings(prev => ({ ...prev, ...newSettings }));
  }, [settings]);

  return (
    <SettingsContext.Provider value={appliedSettings}>
      {children}
    </SettingsContext.Provider>
  );
}
