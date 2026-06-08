import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAlerts } from '@/contexts/AlertsContext';
import { AlertCard } from '@/components/AlertCard';
import { EmptyState } from '@/components/EmptyState';
import { timeAgo } from '@/utils/format';

type Tab = 'favorites' | 'history';

export const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { favorites, history, toggleFavorite, isFavorite, registerView, clearHistory, alerts } =
    useAlerts();
  const [tab, setTab] = useState<Tab>('favorites');

  const openDetail = (id: string) => {
    const a = alerts.find((x) => x.id === id) ?? [...favorites, ...history].find((x) => x.id === id);
    if (a) registerView(a);
    navigation.navigate('AlertDetail', { id });
  };

  const data = tab === 'favorites' ? favorites : history;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Salvos</Text>

        {/* Tabs internas */}
        <View style={[styles.tabs, { backgroundColor: theme.colors.surfaceAlt }]}>
          {(['favorites', 'history'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.tab,
                tab === t && { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: tab === t ? theme.colors.text : theme.colors.textMuted },
                ]}
              >
                {t === 'favorites' ? `⭐ Favoritos (${favorites.length})` : `🕑 Histórico (${history.length})`}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'history' && history.length > 0 && (
          <Pressable onPress={clearHistory} style={styles.clearBtn}>
            <Text style={[styles.clearText, { color: theme.colors.danger }]}>Limpar histórico</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AlertCard
            alert={item}
            favorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item)}
            onPress={() => openDetail(item.id)}
          />
        )}
        ListEmptyComponent={
          tab === 'favorites' ? (
            <EmptyState
              icon="⭐"
              title="Nenhum favorito ainda"
              subtitle="Toque na estrela de um alerta para salvá-lo aqui e acompanhar."
            />
          ) : (
            <EmptyState
              icon="🕑"
              title="Histórico vazio"
              subtitle="Os alertas que você visualizar aparecerão aqui."
            />
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  tabs: { flexDirection: 'row', borderRadius: 12, padding: 4, marginTop: 14 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '700' },
  clearBtn: { alignSelf: 'flex-end', marginTop: 10 },
  clearText: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 },
});
