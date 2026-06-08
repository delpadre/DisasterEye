import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { DisasterAlert } from '@/types';
import { formatDateTime } from '@/utils/format';

interface Props {
  alert: DisasterAlert;
}

/** Infere o instrumento/sensor com base no tipo de evento e fonte. */
const inferSensor = (alert: DisasterAlert): { sensor: string; algorithm: string } => {
  const isInpe = alert.source === 'INPE';
  switch (alert.type) {
    case 'wildfire':
      return isInpe
        ? { sensor: 'MODIS Aqua/Terra · banda 21', algorithm: 'Detecção de anomalia térmica (BRIGHTNESS_T4)' }
        : { sensor: 'VIIRS Suomi NPP', algorithm: 'Active Fire Detection (NRT)' };
    case 'flood':
      return { sensor: 'Sentinel-1 SAR · banda C', algorithm: 'Diferença de retroespalhamento (σ⁰) pré/pós' };
    case 'storm':
      return { sensor: 'GOES-16 ABI · banda 13', algorithm: 'Convective Initiation (CI)' };
    case 'drought':
      return { sensor: 'MODIS · NDVI (MOD13Q1)', algorithm: 'Anomalia de índice de vegetação (16d)' };
  }
};

/**
 * Painel de relatório técnico operacional. Mostra metadata
 * (ID, timestamp da análise, sensor, algoritmo), o resumo da
 * detecção e uma barra visual de confiança.
 */
export const SatelliteReportCard: React.FC<Props> = ({ alert }) => {
  const { theme } = useTheme();
  const { sensor, algorithm } = inferSensor(alert);

  // Cor da barra de confiança
  const confColor =
    alert.confidence >= 90 ? theme.colors.success
    : alert.confidence >= 75 ? theme.colors.warning
    : theme.colors.accent;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      {/* Cabeçalho do relatório */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View>
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
            RELATÓRIO TÉCNICO · {alert.source}
          </Text>
          <Text style={[styles.reportId, { color: theme.colors.text }]}>{alert.id}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: theme.colors.success + '22', borderColor: theme.colors.success + '55' }]}>
          <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
          <Text style={[styles.statusText, { color: theme.colors.success }]}>VALIDADO</Text>
        </View>
      </View>

      {/* Detecção */}
      <Text style={[styles.sectionLabel, { color: theme.colors.textFaint }]}>DETECÇÃO</Text>
      <Text style={[styles.desc, { color: theme.colors.text }]}>{alert.description}</Text>

      {/* Linha técnica: sensor + algoritmo */}
      <View style={[styles.techBlock, { backgroundColor: theme.colors.surfaceAlt }]}>
        <TechRow icon="🛰" label="Sensor" value={sensor} theme={theme} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <TechRow icon="⚙️" label="Algoritmo" value={algorithm} theme={theme} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <TechRow icon="🕐" label="Análise" value={formatDateTime(alert.detectedAt)} theme={theme} />
      </View>

      {/* Confiança visual */}
      <View style={styles.confidenceWrap}>
        <View style={styles.confidenceHeader}>
          <Text style={[styles.confidenceLabel, { color: theme.colors.textMuted }]}>
            Confiança da detecção
          </Text>
          <Text style={[styles.confidenceValue, { color: confColor }]}>
            {alert.confidence}%
          </Text>
        </View>
        <View style={[styles.confidenceTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
          <View
            style={[
              styles.confidenceFill,
              { width: `${alert.confidence}%`, backgroundColor: confColor },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const TechRow: React.FC<{ icon: string; label: string; value: string; theme: any }> = ({
  icon,
  label,
  value,
  theme,
}) => (
  <View style={styles.techRow}>
    <Text style={styles.techIcon}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={[styles.techLabel, { color: theme.colors.textFaint }]}>{label}</Text>
      <Text style={[styles.techValue, { color: theme.colors.text }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 16, marginTop: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 14,
  },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  reportId: { fontSize: 16, fontWeight: '700', marginTop: 3 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 7 },
  desc: { fontSize: 14, lineHeight: 21 },
  techBlock: { borderRadius: 12, padding: 12, marginTop: 14 },
  techRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  techIcon: { fontSize: 15, marginRight: 10, width: 18, textAlign: 'center' },
  techLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  techValue: { fontSize: 13, fontWeight: '600', marginTop: 1 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 2 },
  confidenceWrap: { marginTop: 14 },
  confidenceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  confidenceLabel: { fontSize: 12, fontWeight: '600' },
  confidenceValue: { fontSize: 13, fontWeight: '800' },
  confidenceTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  confidenceFill: { height: '100%', borderRadius: 3 },
});
