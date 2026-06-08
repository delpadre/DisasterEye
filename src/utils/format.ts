// ============================================================
// Funções utilitárias de formatação
// ============================================================

/** Tempo relativo em pt-BR (ex.: "há 2 h"). */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} d`;
}

/** Data completa formatada em pt-BR. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Área em km² com separador de milhar. */
export function formatArea(km2: number): string {
  return `${km2.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km²`;
}
