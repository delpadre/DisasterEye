import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  icon: string;
  title: string;
  subtitle?: string;
}

/** Estado vazio reutilizável para listas sem dados. */
export const EmptyState: React.FC<Props> = ({ icon, title, subtitle }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, paddingHorizontal: 32 },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 },
});
