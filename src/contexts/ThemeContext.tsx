// ============================================================
// Context API — gerenciamento global do tema (dark/light)
// Persistido via AsyncStorage.
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, darkTheme, lightTheme } from '@/theme';
import { ThemeMode } from '@/types';
import { loadThemeMode, saveThemeMode } from '@/storage/storage';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    loadThemeMode().then((saved) => {
      if (saved) setMode(saved);
    });
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      saveThemeMode(next);
      return next;
    });
  };

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return ctx;
};
