import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { fetchGlobalFireHotspots } from '@/services/api';
import { GlobalFireHotspot } from '@/types';
import { WorldMapView } from '@/components/WorldMapView';
import { timeAgo } from '@/utils/format';

/**
 * Tela "🌍 Globo em Chamas" — visualização planetária dos focos
 * ativos em tempo real (NASA FIRMS · VIIRS / MODIS).
 */
export const GlobalFiresScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [hotspots, setHotspots] = useState<GlobalFireHotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const load = async () => {
    setLoading(true);
    const data = await fetchGlobalFireHotspots();
    setHotspots(data);
    setLastUpdate(new Date().toISOString());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Estatísticas agregadas
  const stats = useMemo(() => {
    const high = hotspots.filter((h) => h.confidence === 'high').length;
    // Agrupa por região (pegando só a parte antes do " · ")
    const byRegion: Record<string, number> = {};
    hotspots.forEach((h) => {
      const key = h.region.split('·')[0].trim() || h.region;
      byRegion[key] = (byRegion[key] || 0) + 1;
    });
    const topRegions = Object.entries(byRegion)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    return { high, topRegions };
  }, [hotspots]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.colors.primary} />
        }
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
            <Text style={[styles.back, { color: theme.colors.text }]}>‹ Voltar</Text>
          </Pressable>
          <View style={[styles.livePill, { backgroundColor: theme.colors.danger + '1A' }]}>
            <View style={[styles.liveDot, { backgroundColor: theme.colors.danger }]} />
            <Text style={[styles.liveText, { color: theme.colors.danger }]}>FIRMS · LIVE</Text>
          </View>
        </View>

        {/* Cabeçalho */}
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
          MONITORAMENTO GLOBAL
        </Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>Globo em chamas 🌍</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Focos ativos detectados pelos satélites VIIRS e MODIS nas últimas 24h.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Stat icon="🔥" value={hotspots.length} label="Focos totais" theme={theme} accent={theme.colors.accent} />
          <View style={{ width: 10 }} />
          <Stat icon="🚨" value={stats.high} label="Alta confiança" theme={theme} accent={theme.colors.danger} />
        </View>

        {/* O MAPA */}
        <View style={styles.mapWrap}>
          {loading && hotspots.length === 0 ? (
            <View style={[styles.mapLoading, { backgroundColor: theme.colors.bgElevated, borderColor: theme.colors.border }]}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={[styles.mapLoadingText, { color: theme.colors.textMuted }]}>
                Sincronizando com NASA FIRMS...
              </Text>
            </View>
          ) : (
            <WorldMapView hotspots={hotspots} />
          )}
        </View>

        {/* Legenda */}
        <View style={[styles.legend, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.legendTitle, { color: theme.colors.textFaint }]}>LEGENDA</Text>
          <View style={styles.legendRow}>
            <LegendItem color={theme.colors.danger} label="Alta confiança" theme={theme} />
            <LegendItem color={theme.colors.accent} label="Nominal" theme={theme} />
            <LegendItem color={theme.colors.warning} label="Baixa" theme={theme} />
          </View>
        </View>

        {/* Top regiões */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Regiões mais afetadas
        </Text>
        <View style={[styles.regionList, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {stats.topRegions.map(([region, count], i) => {
            const max = stats.topRegions[0][1];
            return (
              <View
                key={region}
                style={[
                  styles.regionRow,
                  i < stats.topRegions.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <Text style={[styles.regionRank, { color: theme.colors.textFaint }]}>
                  #{i + 1}
                </Text>
                <View style={styles.regionMain}>
                  <Text style={[styles.regionName, { color: theme.colors.text }]}>{region}</Text>
                  <View style={[styles.regionBarTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
                    <View
                      style={[
                        styles.regionBarFill,
                        { width: `${(count / max) * 100}%`, backgroundColor: theme.colors.accent },
                      ]}
                    />
                  </View>
                </View>
                <Text style={[styles.regionCount, { color: theme.colors.text }]}>{count}</Text>
              </View>
            );
          })}
        </View>

        {/* Fonte + update */}
        <View style={[styles.sourceCard, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={[styles.sourceTitle, { color: theme.colors.text }]}>🛰 Fonte de dados</Text>
          <Text style={[styles.sourceText, { color: theme.colors.textMuted }]}>
            NASA FIRMS · Fire Information for Resource Management System. Atualizada a cada ~3h
            via sensores VIIRS (Suomi-NPP, NOAA-20) e MODIS (Terra, Aqua).
          </Text>
          {lastUpdate && (
            <Text style={[styles.updateText, { color: theme.colors.textFaint }]}>
              Última atualização: {timeAgo(lastUpdate)}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat: React.FC<{ icon: string; value: number; label: string; theme: any; accent: string }> = ({
  icon, value, label, theme, accent,
}) => (
  <View style={[statStyles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
    <View style={[statStyles.iconWrap, { backgroundColor: accent + '1A' }]}>
      <Text style={statStyles.icon}>{icon}</Text>
    </View>
    <Text style={[statStyles.value, { color: theme.colors.text }]}>{value}</Text>
    <Text style={[statStyles.label, { color: theme.colors.textMuted }]}>{label}</Text>
  </View>
);

const LegendItem: React.FC<{ color: string; label: string; theme: any }> = ({ color, label, theme }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={[styles.legendLabel, { color: theme.colors.textMuted }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  back: { fontSize: 16, fontWeight: '600' },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  liveText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginTop: 12 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -1, marginTop: 2 },
  subtitle: { fontSize: 13, marginTop: 4, lineHeight: 19 },
  statsRow: { flexDirection: 'row', marginTop: 16 },
  mapWrap: { marginTop: 16 },
  mapLoading: {
    width: '100%',
    aspectRatio: 2,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLoadingText: { fontSize: 13, marginTop: 12, fontWeight: '500' },
  legend: { borderRadius: 14, borderWidth: 1, padding: 12, marginTop: 12 },
  legendTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginVertical: 2 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendLabel: { fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  regionList: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  regionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  regionRank: { fontSize: 12, fontWeight: '800', width: 28, letterSpacing: 0.5 },
  regionMain: { flex: 1 },
  regionName: { fontSize: 14, fontWeight: '700', marginBottom: 5 },
  regionBarTrack: { height: 5, borderRadius: 3, overflow: 'hidden' },
  regionBarFill: { height: '100%', borderRadius: 3 },
  regionCount: { fontSize: 16, fontWeight: '800', marginLeft: 12, minWidth: 30, textAlign: 'right' },
  sourceCard: { borderRadius: 14, padding: 14, marginTop: 18 },
  sourceTitle: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  sourceText: { fontSize: 12, lineHeight: 18 },
  updateText: { fontSize: 11, marginTop: 8, fontWeight: '600' },
});

const statStyles = StyleSheet.create({
  card: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 12 },
  iconWrap: {
    width: 34, height: 34, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 16 },
  value: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  label: { fontSize: 12, fontWeight: '500', marginTop: 1 },
});
