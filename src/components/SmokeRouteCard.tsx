import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { AirQualityImpact, SmokeImpactedCity, SmokePlumeForecast } from '@/types';

interface Props {
  plume: SmokePlumeForecast;
  compact?: boolean;
}

const impactConfig: Record<
  AirQualityImpact,
  { label: string; emoji: string }
> = {
  low: { label: 'Baixo', emoji: '🟢' },
  moderate: { label: 'Moderado', emoji: '🟡' },
  high: { label: 'Alto', emoji: '🟠' },
  hazardous: { label: 'Perigoso', emoji: '🔴' },
};

const impactColor = (impact: AirQualityImpact, t: any): string => {
  switch (impact) {
    case 'low': return t.colors.success;
    case 'moderate': return t.colors.warning;
    case 'high': return t.colors.accent;
    case 'hazardous': return t.colors.danger;
  }
};

/**
 * Card que visualiza a rota da fumaça originada de uma queimada:
 * uma "bússola" mostra a direção do vento e abaixo lista-se as cidades
 * que serão atingidas com ETA e impacto previsto na qualidade do ar.
 */
export const SmokeRouteCard: React.FC<Props> = ({ plume, compact }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Origem + bússola */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.eyebrow, { color: theme.colors.accent }]}>FOCO DE EMISSÃO</Text>
          <Text style={[styles.source, { color: theme.colors.text }]}>{plume.sourceLocation}</Text>
          <View style={styles.windRow}>
            <Text style={[styles.windText, { color: theme.colors.textMuted }]}>
              💨 {plume.windSpeedKmh} km/h · sentido{' '}
            </Text>
            <Text style={[styles.windDir, { color: theme.colors.primary }]}>
              {plume.windDirection}
            </Text>
          </View>
        </View>

        {/* Bússola visual */}
        <Compass degrees={plume.windDirectionDegrees} theme={theme} />
      </View>

      {!compact && (
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      )}

      {/* Cidades impactadas */}
      <Text style={[styles.sectionLabel, { color: theme.colors.textFaint }]}>
        CIDADES NA ROTA · {plume.affectedCities.length}
      </Text>

      {plume.affectedCities.map((city, idx) => (
        <CityRow
          key={`${city.name}-${idx}`}
          city={city}
          isLast={idx === plume.affectedCities.length - 1}
          theme={theme}
        />
      ))}

      <View style={[styles.sourceTag, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Text style={[styles.sourceTagText, { color: theme.colors.primary }]}>
          🛰 {plume.source}
        </Text>
      </View>
    </View>
  );
};

const Compass: React.FC<{ degrees: number; theme: any }> = ({ degrees, theme }) => (
  <View style={[compassStyles.outer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt }]}>
    {/* Anel interno decorativo */}
    <View style={[compassStyles.inner, { borderColor: theme.colors.border }]} />

    {/* Pontos cardeais */}
    <Text style={[compassStyles.cardinal, compassStyles.n, { color: theme.colors.text }]}>N</Text>
    <Text style={[compassStyles.cardinal, compassStyles.s, { color: theme.colors.textFaint }]}>S</Text>
    <Text style={[compassStyles.cardinal, compassStyles.e, { color: theme.colors.textFaint }]}>L</Text>
    <Text style={[compassStyles.cardinal, compassStyles.w, { color: theme.colors.textFaint }]}>O</Text>

    {/* Marcações intermediárias (8 traços a cada 45°) */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <View
        key={deg}
        style={[
          compassStyles.tickWrap,
          { transform: [{ rotate: `${deg}deg` }] },
        ]}
      >
        <View
          style={[
            compassStyles.tick,
            { backgroundColor: theme.colors.textFaint, opacity: deg % 90 === 0 ? 0.6 : 0.25 },
          ]}
        />
      </View>
    ))}

    {/* Agulha: triângulo da frente (cor de alerta) + triângulo de trás (cinza) */}
    <View
      style={[
        compassStyles.needleWrap,
        { transform: [{ rotate: `${degrees}deg` }] },
      ]}
    >
      {/* Ponta frontal — aponta para onde a fumaça vai */}
      <View
        style={[
          compassStyles.needleFront,
          { borderBottomColor: theme.colors.accent },
        ]}
      />
      {/* Cauda traseira */}
      <View
        style={[
          compassStyles.needleBack,
          { borderTopColor: theme.colors.textFaint, opacity: 0.55 },
        ]}
      />
      {/* Pino central */}
      <View style={[compassStyles.pivot, { backgroundColor: theme.colors.text, borderColor: theme.colors.surface }]} />
    </View>
  </View>
);

const CityRow: React.FC<{ city: SmokeImpactedCity; isLast: boolean; theme: any }> = ({
  city,
  isLast,
  theme,
}) => {
  const cfg = impactConfig[city.impact];
  const color = impactColor(city.impact, theme);

  return (
    <View style={cityStyles.row}>
      {/* Coluna do timeline */}
      <View style={cityStyles.timeline}>
        <View style={[cityStyles.dot, { backgroundColor: color, borderColor: theme.colors.bg }]} />
        {!isLast && <View style={[cityStyles.line, { backgroundColor: theme.colors.border }]} />}
      </View>

      {/* Conteúdo */}
      <View style={cityStyles.content}>
        <View style={cityStyles.headerRow}>
          <Text style={[cityStyles.cityName, { color: theme.colors.text }]}>
            {city.name} — {city.state}
          </Text>
          <Text style={[cityStyles.eta, { color: theme.colors.primary }]}>
            +{city.etaHours}h
          </Text>
        </View>
        <Text style={[cityStyles.distance, { color: theme.colors.textFaint }]}>
          {city.distanceKm.toLocaleString('pt-BR')} km de distância
        </Text>
        <View style={cityStyles.impactRow}>
          <View style={[cityStyles.impactPill, { backgroundColor: color + '1A', borderColor: color + '55' }]}>
            <Text style={[cityStyles.impactPillText, { color }]}>
              {cfg.emoji} {cfg.label}
            </Text>
          </View>
          <Text style={[cityStyles.pmText, { color: theme.colors.textMuted }]}>
            ar -{city.pm25Reduction}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  source: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3, marginTop: 4 },
  windRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap' },
  windText: { fontSize: 13 },
  windDir: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  divider: { height: 1, marginVertical: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 14, marginBottom: 8 },
  sourceTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 6,
  },
  sourceTagText: { fontSize: 11, fontWeight: '700' },
});

const COMPASS_SIZE = 84;
const NEEDLE_LEN = 26;
const NEEDLE_WIDTH = 9;

const compassStyles = StyleSheet.create({
  outer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  inner: {
    position: 'absolute',
    width: COMPASS_SIZE - 16,
    height: COMPASS_SIZE - 16,
    borderRadius: (COMPASS_SIZE - 16) / 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardinal: {
    fontSize: 9,
    fontWeight: '900',
    position: 'absolute',
    letterSpacing: 0.5,
  },
  n: { top: 5 },
  s: { bottom: 5 },
  e: { right: 7 },
  w: { left: 7 },
  // Marcações radiais
  tickWrap: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: 'center',
  },
  tick: {
    width: 1,
    height: 4,
    marginTop: 2,
  },
  // Agulha — centralizada pelo flex do container outer
  needleWrap: {
    width: NEEDLE_WIDTH,
    height: NEEDLE_LEN * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleFront: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: NEEDLE_WIDTH / 2,
    borderRightWidth: NEEDLE_WIDTH / 2,
    borderBottomWidth: NEEDLE_LEN,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  needleBack: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: NEEDLE_WIDTH / 2,
    borderRightWidth: NEEDLE_WIDTH / 2,
    borderTopWidth: NEEDLE_LEN,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  // Pino central (no meio da agulha)
  pivot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
  },
});

const cityStyles = StyleSheet.create({
  row: { flexDirection: 'row' },
  timeline: { alignItems: 'center', width: 18, marginRight: 8 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, borderWidth: 2 },
  line: { width: 2, flex: 1, marginTop: 2 },
  content: { flex: 1, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cityName: { fontSize: 15, fontWeight: '700', flex: 1 },
  eta: { fontSize: 13, fontWeight: '800', marginLeft: 8 },
  distance: { fontSize: 12, marginTop: 2 },
  impactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  impactPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  impactPillText: { fontSize: 11, fontWeight: '700' },
  pmText: { fontSize: 12, marginLeft: 10, fontWeight: '600' },
});
