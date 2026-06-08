// ============================================================
// Custom Hook — calcula os indicadores do dashboard a partir
// da lista de alertas ativa.
// ============================================================

import { useMemo } from 'react';
import { DashboardStats, DisasterAlert } from '@/types';

export function useDashboardStats(alerts: DisasterAlert[]): DashboardStats {
  return useMemo(() => {
    const critical = alerts.filter((a) => a.severity === 'critical').length;
    const states = new Set(alerts.map((a) => a.state));
    return {
      activeAlerts: alerts.length,
      criticalAlerts: critical,
      monitoredAreas: states.size,
      resolvedToday: 3, // valor simulado de eventos encerrados no dia
    };
  }, [alerts]);
}
