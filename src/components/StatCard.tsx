import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  label: string;
  value: number | string;
  accent?: string;
  icon: string;
}

/** Card de indicador usado no dashboard da Home. */
export const StatCard: React.FC<Props> = ({ label, value, accent, icon }) => {
  const { theme } = useTheme();
  const color = accent ?? theme.colors.primary;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + '1A' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    minWidth: 0,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: { fontSize: 18 },
  value: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  label: { fontSize: 12, marginTop: 2, fontWeight: '500' },
});
