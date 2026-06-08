// ============================================================
// Design System — DisasterEye
// Estética: "Mission Control" — interface de centro de monitoramento
// orbital. Fundo profundo (espaço), acentos em âmbar/coral (alerta).
// ============================================================

import { DisasterSeverity, DisasterType } from '@/types';

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    bg: string;
    bgElevated: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    text: string;
    textMuted: string;
    textFaint: string;
    primary: string;
    primaryGlow: string;
    accent: string;
    success: string;
    danger: string;
    warning: string;
    overlay: string;
  };
  radius: { sm: number; md: number; lg: number; xl: number; full: number };
  spacing: (n: number) => number;
}

const base = {
  radius: { sm: 8, md: 14, lg: 20, xl: 28, full: 999 },
  spacing: (n: number) => n * 4,
};

export const darkTheme: Theme = {
  ...base,
  mode: 'dark',
  colors: {
    bg: '#070B16',
    bgElevated: '#0D1426',
    surface: '#121B30',
    surfaceAlt: '#19233D',
    border: '#22304F',
    text: '#EAF0FF',
    textMuted: '#94A3C4',
    textFaint: '#5A6B8C',
    primary: '#4DA3FF',
    primaryGlow: 'rgba(77,163,255,0.25)',
    accent: '#FF7A45',
    success: '#3DDC97',
    danger: '#FF4D6D',
    warning: '#FFB627',
    overlay: 'rgba(3,6,14,0.7)',
  },
};

export const lightTheme: Theme = {
  ...base,
  mode: 'light',
  colors: {
    bg: '#F4F7FC',
    bgElevated: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#EDF1F9',
    border: '#DCE3F0',
    text: '#0B1426',
    textMuted: '#56627A',
    textFaint: '#94A0B8',
    primary: '#1E6FFF',
    primaryGlow: 'rgba(30,111,255,0.15)',
    accent: '#F05A28',
    success: '#10A86B',
    danger: '#E5304F',
    warning: '#E5921B',
    overlay: 'rgba(11,20,38,0.4)',
  },
};

// Mapeamento visual por severidade
export const severityColor = (s: DisasterSeverity, t: Theme): string => {
  const map: Record<DisasterSeverity, string> = {
    low: t.colors.success,
    moderate: t.colors.warning,
    high: t.colors.accent,
    critical: t.colors.danger,
  };
  return map[s];
};

export const severityLabel: Record<DisasterSeverity, string> = {
  low: 'Baixa',
  moderate: 'Moderada',
  high: 'Alta',
  critical: 'Crítica',
};

// Mapeamento por tipo de desastre
export const disasterMeta: Record<DisasterType, { label: string; icon: string }> = {
  flood: { label: 'Enchente', icon: '🌊' },
  wildfire: { label: 'Queimada', icon: '🔥' },
  storm: { label: 'Tempestade', icon: '⛈️' },
  drought: { label: 'Seca', icon: '🌵' },
};

// Cor temática para cada tipo de desastre — usado em gráficos
export const typeColor = (t: DisasterType, theme: Theme): string => {
  switch (t) {
    case 'wildfire': return theme.colors.accent;   // laranja
    case 'flood':    return theme.colors.primary;  // azul
    case 'storm':    return theme.colors.warning;  // âmbar
    case 'drought':  return '#A88B4C';             // areia
  }
};

export const fonts = {
  display: 'System',
  body: 'System',
};
