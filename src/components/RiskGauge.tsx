import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  value: number; // 0-100
  size?: number;
}

/**
 * Indicador do Índice de Vulnerabilidade Espacial.
 * Anel exterior pulsante (com cor por severidade) + número grande +
 * barra de progresso horizontal animada. Sem dependências extras.
 */
export const RiskGauge: React.FC<Props> = ({ value, size = 180 }) => {
  const { theme } = useTheme();
  const v = Math.max(0, Math.min(100, value));

  const color =
    v >= 85 ? theme.colors.danger
    : v >= 70 ? theme.colors.accent
    : v >= 50 ? theme.colors.warning
    : theme.colors.success;

  const label =
    v >= 85 ? 'CRÍTICO'
    : v >= 70 ? 'ALTO'
    : v >= 50 ? 'MODERADO'
    : 'BAIXO';

  // Pulsação suave do anel exterior
  const pulse = useRef(new Animated.Value(0.5)).current;
  // Preenchimento animado da barra
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
    Animated.timing(fill, { toValue: v, duration: 900, useNativeDriver: false }).start();
  }, [v, pulse, fill]);

  return (
    <View style={styles.wrap}>
      {/* Disco central com número */}
      <View style={[styles.discWrap, { width: size, height: size }]}>
        {/* Anel pulsante */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color,
              opacity: pulse,
              transform: [
                {
                  scale: pulse.interpolate({ inputRange: [0.5, 1], outputRange: [1, 1.08] }),
                },
              ],
            },
          ]}
        />
        {/* Disco interno */}
        <View
          style={[
            styles.disc,
            {
              width: size - 16,
              height: size - 16,
              borderRadius: (size - 16) / 2,
              backgroundColor: color + '14',
              borderColor: color + '55',
            },
          ]}
        >
          <Text style={[styles.value, { color }]}>{v}</Text>
          <Text style={[styles.scale, { color: theme.colors.textMuted }]}>ÍNDICE / 100</Text>
        </View>
      </View>

      {/* Tag de severidade */}
      <View style={[styles.tag, { backgroundColor: color }]}>
        <Text style={styles.tagText}>{label}</Text>
      </View>

      {/* Barra de progresso */}
      <View style={[styles.barTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: color,
              width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
      <View style={styles.scaleRow}>
        <Text style={[styles.scaleMark, { color: theme.colors.textFaint }]}>0</Text>
        <Text style={[styles.scaleMark, { color: theme.colors.textFaint }]}>50</Text>
        <Text style={[styles.scaleMark, { color: theme.colors.textFaint }]}>100</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  discWrap: { alignItems: 'center', justifyContent: 'center' },
  pulseRing: { position: 'absolute', borderWidth: 2 },
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  value: { fontSize: 56, fontWeight: '900', letterSpacing: -2, lineHeight: 58 },
  scale: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginTop: 4 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 14,
  },
  tagText: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, color: '#fff' },
  barTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginTop: 18,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  scaleMark: { fontSize: 10, fontWeight: '600' },
});
