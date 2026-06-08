import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAlerts } from '@/contexts/AlertsContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { fetchFireRiskForecast } from '@/services/api';
import { FireRiskForecast } from '@/types';
import { StatCard } from '@/components/StatCard';
import { AlertCard } from '@/components/AlertCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { LiveBadge } from '@/components/LiveBadge';
import { DistributionChart } from '@/components/DistributionChart';
import { disasterMeta } from '@/theme';
import { DisasterType } from '@/types';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { alerts, loading, refresh, toggleFavorite, isFavorite, registerView } = useAlerts();
  const stats = useDashboardStats(alerts);

  // Risco mais crítico — para o card-teaser da aba Previsão
  const [topRisk, setTopRisk] = useState<FireRiskForecast | null>(null);
  useEffect(() => {
    fetchFireRiskForecast().then((list) => {
      const sorted = [...list].sort((a, b) => b.vulnerabilityIndex - a.vulnerabilityIndex);
      setTopRisk(sorted[0] ?? null);
    });
  }, []);

  // Animação de entrada (fade + slide)
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!loading) {
      Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [loading, anim]);

  // Distribuição por tipo de desastre (mini gráfico de barras)
  const typeCounts = (Object.keys(disasterMeta) as DisasterType[]).map((t) => ({
    type: t,
    count: alerts.filter((a) => a.type === t).length,
  }));

  const recent = alerts.slice(0, 3);

  const openDetail = (id: string) => {
    const a = alerts.find((x) => x.id === id);
    if (a) registerView(a);
    navigation.navigate('AlertDetail', { id });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.colors.primary} />
        }
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
              MONITORAMENTO ORBITAL
            </Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>DisasterEye</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Detecção de desastres via satélite • INPE / NASA
            </Text>
          </View>
          <View style={styles.headerRight}>
            <LiveBadge />
            <Pressable
              onPress={() => navigation.navigate('GlobalFires')}
              hitSlop={10}
              style={({ pressed }) => [
                styles.globeBtn,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.primary + '55',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={styles.globeIcon}>🌍</Text>
            </Pressable>
          </View>
        </View>

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <Animated.View
            style={{
              opacity: anim,
              transform: [
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              ],
            }}
          >
            {/* Indicadores */}
            <View style={styles.statsRow}>
              <StatCard label="Alertas ativos" value={stats.activeAlerts} icon="📡" accent={theme.colors.primary} />
              <View style={{ width: 12 }} />
              <StatCard label="Críticos" value={stats.criticalAlerts} icon="🚨" accent={theme.colors.danger} />
            </View>
            <View style={[styles.statsRow, { marginTop: 12 }]}>
              <StatCard label="Estados monitorados" value={stats.monitoredAreas} icon="🗺" accent={theme.colors.success} />
              <View style={{ width: 12 }} />
              <StatCard label="Resolvidos hoje" value={stats.resolvedToday} icon="✅" accent={theme.colors.warning} />
            </View>

            {/* Mini gráfico — distribuição por tipo */}
            <DistributionChart data={typeCounts} total={alerts.length} />

            {/* Teaser de previsão preditiva (SMAP) — leva para a aba Previsão */}
            {topRisk && (
              <Pressable
                onPress={() => navigation.navigate('Previsao')}
                style={({ pressed }) => [
                  styles.predictCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.accent + '55',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={[styles.predictGlow, { backgroundColor: theme.colors.accent + '14' }]} />
                <View style={styles.predictContent}>
                  <Text style={[styles.predictEyebrow, { color: theme.colors.accent }]}>
                    🔮 ANÁLISE PREDITIVA · SMAP
                  </Text>
                  <Text style={[styles.predictTitle, { color: theme.colors.text }]}>
                    Risco crítico previsto
                  </Text>
                  <Text style={[styles.predictDesc, { color: theme.colors.textMuted }]}>
                    {topRisk.region} · solo a {topRisk.soilMoisture.toFixed(1)}% de umidade
                  </Text>
                  <Text style={[styles.predictCta, { color: theme.colors.accent }]}>
                    Ver índice de vulnerabilidade →
                  </Text>
                </View>
                <View style={[styles.predictBadge, { backgroundColor: theme.colors.accent }]}>
                  <Text style={styles.predictBadgeValue}>{topRisk.vulnerabilityIndex}</Text>
                  <Text style={styles.predictBadgeLabel}>ÍNDICE</Text>
                </View>
              </Pressable>
            )}

            {/* Recentes */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Alertas recentes
              </Text>
              <Pressable onPress={() => navigation.navigate('Alertas')}>
                <Text style={[styles.seeAll, { color: theme.colors.primary }]}>Ver todos →</Text>
              </Pressable>
            </View>

            {recent.map((a) => (
              <AlertCard
                key={a.id}
                alert={a}
                favorite={isFavorite(a.id)}
                onToggleFavorite={() => toggleFavorite(a)}
                onPress={() => openDetail(a.id)}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1, marginTop: 2 },
  subtitle: { fontSize: 13, marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  globeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  globeIcon: { fontSize: 22 },
  statsRow: { flexDirection: 'row' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  seeAll: { fontSize: 13, fontWeight: '600' },
  predictCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
    overflow: 'hidden',
  },
  predictGlow: { ...StyleSheet.absoluteFillObject },
  predictContent: { flex: 1 },
  predictEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  predictTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, marginTop: 4 },
  predictDesc: { fontSize: 13, marginTop: 3 },
  predictCta: { fontSize: 12, fontWeight: '700', marginTop: 8 },
  predictBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 12,
  },
  predictBadgeValue: { fontSize: 24, fontWeight: '900', color: '#fff', lineHeight: 26 },
  predictBadgeLabel: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 1, marginTop: 2 },
});
