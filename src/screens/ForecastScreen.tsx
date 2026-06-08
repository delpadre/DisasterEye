import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { fetchFireRiskForecast, fetchSmokePlumes } from '@/services/api';
import { FireRiskForecast, SmokePlumeForecast } from '@/types';
import { RiskGauge } from '@/components/RiskGauge';
import { RiskRegionCard } from '@/components/RiskRegionCard';
import { SmokeRouteCard } from '@/components/SmokeRouteCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';

type Mode = 'risk' | 'smoke';

/**
 * Tela de previsão preditiva — dois modos:
 *  1. Risco de Ignição (SMAP / GRACE-FO)  → onde o fogo PODE começar
 *  2. Rota da Fumaça (MODIS / MAIA)       → para onde a fuligem está indo
 */
export const ForecastScreen: React.FC = () => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<Mode>('risk');
  const [risks, setRisks] = useState<FireRiskForecast[]>([]);
  const [plumes, setPlumes] = useState<SmokePlumeForecast[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [r, p] = await Promise.all([fetchFireRiskForecast(), fetchSmokePlumes()]);
    setRisks(r);
    setPlumes(p);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Maior índice de vulnerabilidade no momento (destaque do hero)
  const highestRisk = useMemo(
    () => [...risks].sort((a, b) => b.vulnerabilityIndex - a.vulnerabilityIndex)[0],
    [risks]
  );

  // Total estimado de pessoas/cidades na rota
  const totalCitiesAtRisk = useMemo(
    () => plumes.reduce((sum, p) => sum + p.affectedCities.length, 0),
    [plumes]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.colors.primary} />
        }
      >
        {/* Cabeçalho */}
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
          ANÁLISE PREDITIVA ORBITAL
        </Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>Previsão</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          De alerta a prevenção: cruzamento de dados de umidade do solo, aerossóis e ventos.
        </Text>

        {/* Toggle entre modos */}
        <View style={[styles.toggle, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Pressable
            onPress={() => setMode('risk')}
            style={[
              styles.toggleBtn,
              mode === 'risk' && { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: mode === 'risk' ? theme.colors.text : theme.colors.textMuted },
              ]}
            >
              🔥 Risco de ignição
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('smoke')}
            style={[
              styles.toggleBtn,
              mode === 'smoke' && { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: mode === 'smoke' ? theme.colors.text : theme.colors.textMuted },
              ]}
            >
              💨 Rota da fumaça
            </Text>
          </Pressable>
        </View>

        {/* ============== MODO: RISCO DE IGNIÇÃO ============== */}
        {mode === 'risk' && (
          <>
            {loading || !highestRisk ? (
              <SkeletonCard />
            ) : (
              <View
                style={[
                  styles.heroCard,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                ]}
              >
                <Text style={[styles.heroEyebrow, { color: theme.colors.accent }]}>
                  ÍNDICE DE VULNERABILIDADE ESPACIAL
                </Text>
                <Text style={[styles.heroLocation, { color: theme.colors.text }]}>
                  {highestRisk.region} · {highestRisk.state}
                </Text>
                <View style={styles.gaugeWrap}>
                  <RiskGauge value={highestRisk.vulnerabilityIndex} />
                </View>
                <Text style={[styles.heroRecommendation, { color: theme.colors.textMuted }]}>
                  {highestRisk.recommendation}
                </Text>
                <View style={[styles.heroFooter, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <Text style={[styles.heroFooterLabel, { color: theme.colors.textFaint }]}>
                    JANELA PREVISTA
                  </Text>
                  <Text style={[styles.heroFooterValue, { color: theme.colors.primary }]}>
                    próximas {highestRisk.ignitionWindowHours}h
                  </Text>
                </View>
              </View>
            )}

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Outras regiões monitoradas
            </Text>
            <Text style={[styles.sectionHint, { color: theme.colors.textFaint }]}>
              Dados de umidade do solo cruzados com vento e temperatura
            </Text>

            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              risks
                .filter((r) => r.id !== highestRisk?.id)
                .map((r) => <RiskRegionCard key={r.id} forecast={r} />)
            )}
          </>
        )}

        {/* ============== MODO: ROTA DA FUMAÇA ============== */}
        {mode === 'smoke' && (
          <>
            {/* Resumo */}
            <View style={styles.statsRow}>
              <SummaryStat
                label="Plumas ativas"
                value={loading ? '—' : `${plumes.length}`}
                icon="💨"
                theme={theme}
              />
              <View style={{ width: 12 }} />
              <SummaryStat
                label="Cidades na rota"
                value={loading ? '—' : `${totalCitiesAtRisk}`}
                icon="🏙"
                theme={theme}
                accent={theme.colors.accent}
              />
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.colors.primaryGlow, borderColor: theme.colors.primary + '55' }]}>
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                <Text style={{ fontWeight: '800' }}>Como funciona: </Text>
                aerossóis detectados pelo MODIS são combinados com direção dos ventos em alta
                atmosfera para prever para onde a fumaça das queimadas será transportada.
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Plumas ativas
            </Text>

            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : plumes.length === 0 ? (
              <EmptyState
                icon="🌬"
                title="Nenhuma pluma ativa"
                subtitle="Sem queimadas com transporte significativo de fumaça no momento."
              />
            ) : (
              plumes.map((p) => <SmokeRouteCard key={p.id} plume={p} />)
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const SummaryStat: React.FC<{
  label: string;
  value: string;
  icon: string;
  theme: any;
  accent?: string;
}> = ({ label, value, icon, theme, accent }) => {
  const color = accent ?? theme.colors.primary;
  return (
    <View
      style={[
        sumStyles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={[sumStyles.iconWrap, { backgroundColor: color + '1A' }]}>
        <Text style={sumStyles.icon}>{icon}</Text>
      </View>
      <Text style={[sumStyles.value, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[sumStyles.label, { color: theme.colors.textMuted }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1, marginTop: 2 },
  subtitle: { fontSize: 13, marginTop: 4, lineHeight: 19 },
  toggle: { flexDirection: 'row', borderRadius: 14, padding: 4, marginTop: 18 },
  toggleBtn: { flex: 1, paddingVertical: 11, borderRadius: 11, alignItems: 'center' },
  toggleText: { fontSize: 13, fontWeight: '700' },
  heroCard: { borderRadius: 22, borderWidth: 1, padding: 20, marginTop: 18, alignItems: 'center' },
  heroEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textAlign: 'center' },
  heroLocation: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginTop: 8, textAlign: 'center' },
  gaugeWrap: { marginTop: 18, marginBottom: 14, width: '100%', alignItems: 'center' },
  heroRecommendation: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 4 },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
    width: '100%',
  },
  heroFooterLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroFooterValue: { fontSize: 14, fontWeight: '800' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 24, marginBottom: 4 },
  sectionHint: { fontSize: 12, marginBottom: 12 },
  statsRow: { flexDirection: 'row', marginTop: 18 },
  infoBox: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 14 },
  infoText: { fontSize: 13, lineHeight: 20 },
});

const sumStyles = StyleSheet.create({
  card: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 14 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: { fontSize: 17 },
  value: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  label: { fontSize: 12, fontWeight: '500', marginTop: 2 },
});
