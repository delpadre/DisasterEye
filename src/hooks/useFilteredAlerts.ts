// ============================================================
// Custom Hook — aplica filtros, busca e ordenação sobre os alertas.
// Encapsula a regra de negócio da tela de listagem.
// ============================================================

import { useMemo, useState } from 'react';
import { AlertFilters, DisasterAlert, DisasterSeverity } from '@/types';

const severityRank: Record<DisasterSeverity, number> = {
  critical: 4,
  high: 3,
  moderate: 2,
  low: 1,
};

const initialFilters: AlertFilters = {
  type: 'all',
  severity: 'all',
  search: '',
  sort: 'recent',
};

export function useFilteredAlerts(alerts: DisasterAlert[]) {
  const [filters, setFilters] = useState<AlertFilters>(initialFilters);

  const result = useMemo(() => {
    let list = [...alerts];

    if (filters.type !== 'all') list = list.filter((a) => a.type === filters.type);
    if (filters.severity !== 'all')
      list = list.filter((a) => a.severity === filters.severity);

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q)
      );
    }

    switch (filters.sort) {
      case 'severity':
        list.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
        break;
      case 'area':
        list.sort((a, b) => b.affectedAreaKm2 - a.affectedAreaKm2);
        break;
      case 'recent':
      default:
        list.sort(
          (a, b) =>
            new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
        );
    }

    return list;
  }, [alerts, filters]);

  const updateFilter = <K extends keyof AlertFilters>(key: K, value: AlertFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters(initialFilters);

  return { filters, result, updateFilter, resetFilters };
}
