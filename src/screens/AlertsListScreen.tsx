import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAlerts } from '@/contexts/AlertsContext';
import { useFilteredAlerts } from '@/hooks/useFilteredAlerts';
import { AlertCard } from '@/components/AlertCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { FilterChip } from '@/components/FilterChip';
import { disasterMeta } from '@/theme';
import { DisasterType, SortOption } from '@/types';

const typeOptions: Array<{ key: DisasterType | 'all'; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'wildfire', label: '🔥 Queimadas' },
  { key: 'flood', label: '🌊 Enchentes' },
  { key: 'storm', label: '⛈️ Tempestades' },
  { key: 'drought', label: '🌵 Secas' },
];

const sortOptions: Array<{ key: SortOption; label: string }> = [
  { key: 'recent', label: 'Recentes' },
  { key: 'severity', label: 'Gravidade' },
  { key: 'area', label: 'Área' },
];

export const AlertsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { alerts, loading, refresh, toggleFavorite, isFavorite, registerView } = useAlerts();
  const { filters, result, updateFilter } = useFilteredAlerts(alerts);

  const openDetail = (id: string) => {
    const a = alerts.find((x) => x.id === id);
    if (a) registerView(a);
    navigation.navigate('AlertDetail', { id });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]} edges={['top']}>
      <View style={styles.headerWrap}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Alertas</Text>
        <Text style={[styles.count, { color: theme.colors.textMuted }]}>
          {result.length} evento{result.length !== 1 ? 's' : ''} detectado{result.length !== 1 ? 's' : ''}
        </Text>

        {/* Busca */}
        <View style={[styles.searchBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Buscar por cidade, estado..."
            placeholderTextColor={theme.colors.textFaint}
            value={filters.search}
            onChangeText={(t) => updateFilter('search', t)}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
        </View>

        {/* Filtros por tipo */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {typeOptions.map((opt) => (
            <FilterChip
              key={opt.key}
              label={opt.label}
              active={filters.type === opt.key}
              onPress={() => updateFilter('type', opt.key)}
            />
          ))}
        </ScrollView>

        {/* Ordenação */}
        <View style={styles.sortRow}>
          <Text style={[styles.sortLabel, { color: theme.colors.textFaint }]}>Ordenar:</Text>
          {sortOptions.map((opt) => (
            <FilterChip
              key={opt.key}
              label={opt.label}
              active={filters.sort === opt.key}
              onPress={() => updateFilter('sort', opt.key)}
            />
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.list}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={result}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={loading}
          renderItem={({ item }) => (
            <AlertCard
              alert={item}
              favorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item)}
              onPress={() => openDetail(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="🛰"
              title="Nenhum alerta encontrado"
              subtitle="Ajuste os filtros ou tente outra busca."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerWrap: { paddingHorizontal: 16, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  count: { fontSize: 13, marginTop: 2 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
  chipsRow: { marginTop: 14, flexGrow: 0 },
  sortRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  sortLabel: { fontSize: 12, fontWeight: '600', marginRight: 8 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
});
