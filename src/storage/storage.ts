// ============================================================
// Camada de persistência local — AsyncStorage
// Guarda favoritos, histórico de visualização e preferência de tema.
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DisasterAlert, ThemeMode } from '@/types';

const KEYS = {
  favorites: '@disastereye:favorites',
  history: '@disastereye:history',
  theme: '@disastereye:theme',
} as const;

// ---------- Favoritos ----------
export async function loadFavorites(): Promise<DisasterAlert[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.favorites);
    return raw ? (JSON.parse(raw) as DisasterAlert[]) : [];
  } catch {
    return [];
  }
}

export async function saveFavorites(items: DisasterAlert[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(items));
  } catch {
    // silencioso — falha de escrita não deve quebrar a UI
  }
}

// ---------- Histórico recente ----------
export async function loadHistory(): Promise<DisasterAlert[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.history);
    return raw ? (JSON.parse(raw) as DisasterAlert[]) : [];
  } catch {
    return [];
  }
}

export async function pushHistory(alert: DisasterAlert): Promise<DisasterAlert[]> {
  try {
    const current = await loadHistory();
    const deduped = [alert, ...current.filter((a) => a.id !== alert.id)].slice(0, 15);
    await AsyncStorage.setItem(KEYS.history, JSON.stringify(deduped));
    return deduped;
  } catch {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.history);
  } catch {}
}

// ---------- Tema ----------
export async function loadThemeMode(): Promise<ThemeMode | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.theme);
    return raw === 'light' || raw === 'dark' ? raw : null;
  } catch {
    return null;
  }
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.theme, mode);
  } catch {}
}
