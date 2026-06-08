import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

/** Chip selecionável usado nos filtros e ordenação. */
export const FilterChip: React.FC<Props> = ({ label, active, onPress }) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.primary : theme.colors.surface,
          borderColor: active ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: active ? '#fff' : theme.colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  label: { fontSize: 13, fontWeight: '600' },
});
