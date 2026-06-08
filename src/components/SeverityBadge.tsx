import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { severityColor, severityLabel } from '@/theme';
import { DisasterSeverity } from '@/types';

interface Props {
  severity: DisasterSeverity;
  compact?: boolean;
}

/** Badge colorido que indica a gravidade do alerta. */
export const SeverityBadge: React.FC<Props> = ({ severity, compact }) => {
  const { theme } = useTheme();
  const color = severityColor(severity, theme);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + '22', borderColor: color + '55' },
        compact && styles.compact,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{severityLabel[severity]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  compact: { paddingHorizontal: 8, paddingVertical: 3 },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
});
