// ============================================================
// Context API — estado global dos alertas, favoritos e histórico.
// Centraliza a lógica de negócio consumida pelas telas.
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DisasterAlert } from '@/types';
import { fetchDisasterAlerts } from '@/services/api';
import {
  loadFavorites,
  saveFavorites,
  loadHistory,
  pushHistory,
  clearHistory as clearHistoryStorage,
} from '@/storage/storage';

interface AlertsContextValue {
  alerts: DisasterAlert[];
  favorites: DisasterAlert[];
  history: DisasterAlert[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleFavorite: (alert: DisasterAlert) => void;
  isFavorite: (id: string) => boolean;
  registerView: (alert: DisasterAlert) => void;
  clearHistory: () => void;
}

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [favorites, setFavorites] = useState<DisasterAlert[]>([]);
  const [history, setHistory] = useState<DisasterAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDisasterAlerts();
      setAlerts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    refresh();
    loadFavorites().then(setFavorites);
    loadHistory().then(setHistory);
  }, [refresh]);

  const toggleFavorite = useCallback((alert: DisasterAlert) => {
    setFavorites((prev) => {
      const exists = prev.some((a) => a.id === alert.id);
      const next = exists ? prev.filter((a) => a.id !== alert.id) : [alert, ...prev];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((a) => a.id === id),
    [favorites]
  );

  const registerView = useCallback((alert: DisasterAlert) => {
    pushHistory(alert).then(setHistory);
  }, []);

  const clearHistory = useCallback(() => {
    clearHistoryStorage();
    setHistory([]);
  }, []);

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        favorites,
        history,
        loading,
        error,
        refresh,
        toggleFavorite,
        isFavorite,
        registerView,
        clearHistory,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = (): AlertsContextValue => {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts deve ser usado dentro de AlertsProvider');
  return ctx;
};
