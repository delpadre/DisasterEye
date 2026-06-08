import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { FireRiskForecast } from '@/types';

interface Props {
  forecast: FireRiskForecast;
  onPress?: () => void;
}

/** Card compacto de previsão SMAP por região (lista da aba Previsão). */
export const RiskRegionCard: React.FC<Props> = ({ forecast, onPress }) => {
  const { theme } = useTheme();
  const v = forecast.vulnerabilityIndex;

  const color =
    v >= 85 ? theme.colors.danger
    : v >= 70 ? theme.colors.accent
    : v >= 50 ? theme.colors.warning
    : theme.colors.success;

  // Mini barra de "umidade do solo" — quanto MENOR a umidade, maior o risco
  const moisturePercent = Math.max(0, Math.min(100, (forecast.soilMoisture / 30) * 100));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.region, { color: theme.colors.text }]} numberOfLines={1}>
            {forecast.region}
          </Text>
          <Text style={[styles.state, { color: theme.colors.textMuted }]}>
            📍 {forecast.state} · {forecast.coordinates.latitude.toFixed(2)},{' '}
            {forecast.coordinates.longitude.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.indexBox, { backgroundColor: color + '1A', borderColor: color + '55' }]}>
          <Text style={[styles.indexValue, { color }]}>{v}</Text>
          <Text style={[styles.indexLabel, { color }]}>ÍNDICE</Text>
        </View>
      </View>

      {/* Métricas SMAP */}
      <View style={styles.metrics}>
        <Metric icon="💧" label="Solo" value={`${forecast.soilMoisture.toFixed(1)}%`} theme={theme} />
        <Metric icon="🌡" label="Temp" value={`${forecast.temperature}°`} theme={theme} />
        <Metric icon="💨" label="Vento" value={`${forecast.windSpeedKmh} km/h`} theme={theme} />
        <Metric icon="⏱" label="Janela" value={`${forecast.ignitionWindowHours}h`} theme={theme} />
      </View>

      {/* Barra de umidade do solo */}
      <View style={styles.moistureWrap}>
        <View style={styles.moistureLabelRow}>
          <Text style={[styles.moistureLabel, { color: theme.colors.textFaint }]}>
            Umidade do solo
          </Text>
          <Text style={[styles.moistureLabel, { color: theme.colors.textFaint }]}>
            seco ← → úmido
          </Text>
        </View>
        <View style={[styles.moistureTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
          <View
            style={[
              styles.moistureFill,
              { width: `${moisturePercent}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>

      <View style={[styles.sourceTag, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Text style={[styles.sourceText, { color: theme.colors.primary }]}>
          🛰 {forecast.source}
        </Text>
      </View>
    </Pressable>
  );
};

const Metric: React.FC<{ icon: string; label: string; value: string; theme: any }> = ({
  icon,
  label,
  value,
  theme,
}) => (
  <View style={metricStyles.box}>
    <Text style={metricStyles.icon}>{icon}</Text>
    <Text style={[metricStyles.value, { color: theme.colors.text }]}>{value}</Text>
    <Text style={[metricStyles.label, { color: theme.colors.textFaint }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  region: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  state: { fontSize: 12, marginTop: 3 },
  indexBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 64,
  },
  indexValue: { fontSize: 22, fontWeight: '900', lineHeight: 24 },
  indexLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 1 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  moistureWrap: { marginTop: 14 },
  moistureLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  moistureLabel: { fontSize: 10, fontWeight: '600' },
  moistureTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  moistureFill: { height: '100%', borderRadius: 3 },
  sourceTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 12,
  },
  sourceText: { fontSize: 11, fontWeight: '700' },
});

const metricStyles = StyleSheet.create({
  box: { alignItems: 'center', flex: 1 },
  icon: { fontSize: 16, marginBottom: 3 },
  value: { fontSize: 14, fontWeight: '700' },
  label: { fontSize: 10, fontWeight: '600', marginTop: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
});
