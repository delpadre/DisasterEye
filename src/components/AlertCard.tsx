import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { disasterMeta, severityColor } from '@/theme';
import { DisasterAlert } from '@/types';
import { timeAgo, formatArea } from '@/utils/format';
import { SeverityBadge } from './SeverityBadge';

interface Props {
  alert: DisasterAlert;
  onPress: () => void;
  favorite: boolean;
  onToggleFavorite: () => void;
}

/** Card de alerta exibido nas listagens e favoritos. */
export const AlertCard: React.FC<Props> = ({
  alert,
  onPress,
  favorite,
  onToggleFavorite,
}) => {
  const { theme } = useTheme();
  const meta = disasterMeta[alert.type];
  const accent = severityColor(alert.severity, theme);

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
      {/* Barra lateral colorida por severidade */}
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.typeRow}>
            <Text style={styles.emoji}>{meta.icon}</Text>
            <Text style={[styles.type, { color: theme.colors.textMuted }]}>
              {meta.label}
            </Text>
          </View>
          <Pressable hitSlop={10} onPress={onToggleFavorite}>
            <Text style={[styles.star, { color: favorite ? theme.colors.warning : theme.colors.textFaint }]}>
              {favorite ? '★' : '☆'}
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {alert.title}
        </Text>

        <Text style={[styles.location, { color: theme.colors.textMuted }]}>
          📍 {alert.location} — {alert.state}
        </Text>

        <View style={styles.footer}>
          <SeverityBadge severity={alert.severity} compact />
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: theme.colors.textFaint }]}>
              {formatArea(alert.affectedAreaKm2)}
            </Text>
            <Text style={[styles.dot, { color: theme.colors.textFaint }]}>•</Text>
            <Text style={[styles.meta, { color: theme.colors.textFaint }]}>
              {timeAgo(alert.detectedAt)}
            </Text>
          </View>
        </View>

        <View style={[styles.sourceTag, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={[styles.sourceText, { color: theme.colors.primary }]}>
            🛰 {alert.source}
          </Text>
          <Text style={[styles.confidence, { color: theme.colors.textMuted }]}>
            {alert.confidence}% confiança
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  accentBar: { width: 5 },
  content: { flex: 1, padding: 14 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeRow: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 15, marginRight: 6 },
  type: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  star: { fontSize: 22, lineHeight: 24 },
  title: { fontSize: 16, fontWeight: '700', marginTop: 8, lineHeight: 21 },
  location: { fontSize: 13, marginTop: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  meta: { fontSize: 12, fontWeight: '500' },
  dot: { fontSize: 12, marginHorizontal: 6 },
  sourceTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 12,
  },
  sourceText: { fontSize: 12, fontWeight: '700' },
  confidence: { fontSize: 11, fontWeight: '500' },
});
