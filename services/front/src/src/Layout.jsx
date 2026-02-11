import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function Layout({ children }) {
  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  const getSetting = (key, defaultValue) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || defaultValue;
  };

  const themeColor = getSetting('theme_color', 'purple');
  const bgMode = getSetting('background_mode', 'light');
  const contrastMode = getSetting('contrast_mode', 'normal');
  const logoUrl = getSetting('logo_url', '');

  const colorMap = {
    purple: { primary: '#7c3aed', dark: '#6d28d9', light: '#a855f7' },
    blue: { primary: '#3b82f6', dark: '#2563eb', light: '#60a5fa' },
    green: { primary: '#10b981', dark: '#059669', light: '#34d399' },
    orange: { primary: '#f97316', dark: '#ea580c', light: '#fb923c' },
    red: { primary: '#ef4444', dark: '#dc2626', light: '#f87171' },
    pink: { primary: '#ec4899', dark: '#db2777', light: '#f472b6' },
  };

  const bgMap = {
    light: { bg: 'from-slate-50 via-white to-purple-50/30', card: 'bg-white', text: 'text-slate-800', textSec: 'text-slate-600', border: 'border-slate-200' },
    gray: { bg: 'from-slate-100 via-slate-50 to-slate-100', card: 'bg-white', text: 'text-slate-900', textSec: 'text-slate-700', border: 'border-slate-300' },
    dark: { bg: 'from-slate-900 via-slate-800 to-slate-900', card: 'bg-slate-800', text: 'text-white', textSec: 'text-slate-300', border: 'border-slate-700' },
  };

  const colors = colorMap[themeColor] || colorMap.purple;
  const theme = bgMap[bgMode] || bgMap.light;
  const highContrast = contrastMode === 'high';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      <style>{`
        :root {
          --color-primary: ${colors.primary};
          --color-primary-dark: ${colors.dark};
          --color-primary-light: ${colors.light};
          --bg-card: ${bgMode === 'dark' ? '#1e293b' : '#ffffff'};
          --text-primary: ${bgMode === 'dark' ? '#ffffff' : '#1e293b'};
          --text-secondary: ${bgMode === 'dark' ? '#cbd5e1' : '#64748b'};
          --border-color: ${bgMode === 'dark' ? '#334155' : '#e2e8f0'};
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Glassmorphism effects */
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Smooth transitions */
        .transition-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Dynamic gradient accent */
        .gradient-purple {
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.light} 100%);
        }

        /* Card hover effects */
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px -10px ${colors.primary}33;
        }

        /* Dynamic theme classes */
        .bg-white { background-color: var(--bg-card) !important; }
        .text-slate-800, .text-slate-900 { color: var(--text-primary) !important; }
        .text-slate-600, .text-slate-700, .text-slate-500 { color: var(--text-secondary) !important; }
        .border-slate-200, .border-slate-300 { border-color: var(--border-color) !important; }
        
        .bg-purple-600 { background-color: ${colors.primary} !important; }
        .bg-purple-700 { background-color: ${colors.dark} !important; }
        .bg-purple-50 { background-color: ${colors.light}${highContrast ? '30' : '10'} !important; }
        .bg-purple-100 { background-color: ${colors.light}${highContrast ? '40' : '20'} !important; }
        .text-purple-600 { color: ${colors.primary} !important; }
        .text-purple-700 { color: ${colors.dark} !important; }
        .border-purple-600 { border-color: ${colors.primary} !important; }
        .border-purple-200 { border-color: ${colors.light}${highContrast ? '60' : '40'} !important; }
        .hover\\:bg-purple-700:hover { background-color: ${colors.dark} !important; }
        
        ${bgMode === 'dark' ? `
          .bg-slate-50, .bg-slate-100 { background-color: #334155 !important; }
          .bg-gradient-to-br { background: linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a) !important; }
        ` : ''}
        
        ${highContrast ? `
          * { font-weight: 500 !important; }
          .border { border-width: 2px !important; }
        ` : ''}
      `}</style>
      {children}
    </div>
  );
}
