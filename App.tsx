// ============================================================
// DisasterEye — ponto de entrada
// Detecção de desastres naturais via satélite (INPE / NASA)
// Global Solution — React Native + Expo + TypeScript
// ============================================================

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AlertsProvider } from '@/contexts/AlertsContext';
import { RootNavigator } from '@/navigation/RootNavigator';

const Inner: React.FC = () => {
  const { mode } = useTheme();
  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AlertsProvider>
          <Inner />
        </AlertsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
