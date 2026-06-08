// ============================================================
// Navegação — Bottom Tabs + Native Stack (tipada)
// ============================================================

import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { HomeScreen } from '@/screens/HomeScreen';
import { AlertsListScreen } from '@/screens/AlertsListScreen';
import { AlertDetailScreen } from '@/screens/AlertDetailScreen';
import { ForecastScreen } from '@/screens/ForecastScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { GlobalFiresScreen } from '@/screens/GlobalFiresScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

// Tipagem das rotas
export type RootStackParamList = {
  Tabs: undefined;
  AlertDetail: { id: string };
  GlobalFires: undefined;
};

export type TabParamList = {
  Home: undefined;
  Alertas: undefined;
  Previsao: undefined;
  Salvos: undefined;
  Config: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const tabIcon = (emoji: string) => ({ color, focused }: { color: string; focused: boolean }) => (
  <Text style={{ fontSize: focused ? 22 : 19, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
);

const Tabs: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textFaint,
        tabBarStyle: {
          backgroundColor: theme.colors.bgElevated,
          borderTopColor: theme.colors.border,
          // Soma a altura da barra do sistema (gestos / 3 botões / home indicator)
          // para que o tab bar nunca fique sobreposto.
          height: 64 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="Alertas" component={AlertsListScreen} options={{ tabBarIcon: tabIcon('🛰') }} />
      <Tab.Screen
        name="Previsao"
        component={ForecastScreen}
        options={{ tabBarIcon: tabIcon('🔮'), title: 'Previsão' }}
      />
      <Tab.Screen name="Salvos" component={FavoritesScreen} options={{ tabBarIcon: tabIcon('⭐') }} />
      <Tab.Screen name="Config" component={SettingsScreen} options={{ tabBarIcon: tabIcon('⚙️') }} />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { theme, mode } = useTheme();

  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme : DefaultTheme).colors,
      background: theme.colors.bg,
      card: theme.colors.bgElevated,
      text: theme.colors.text,
      primary: theme.colors.primary,
      border: theme.colors.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="AlertDetail"
          component={AlertDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="GlobalFires"
          component={GlobalFiresScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
