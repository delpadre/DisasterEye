import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { disasterMeta, typeColor } from '@/theme';
import { DisasterType } from '@/types';

interface Props {
  data: Array<{ type: DisasterType; count: number }>;
  total: number;
}

/**
 * Mini-gráfico de distribuição por tipo de desastre.
 * Cada barra cresce animadamente do zero, tem cor temática do tipo,
 * mostra count + percentual e label do tipo.
 */
export const DistributionChart: React.FC<Props> = ({ data, total }) => {
  const { theme } = useTheme();
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Distribuição por tipo</Text>
        <Text style={[styles.totalChip, { color: theme.colors.textMuted, backgroundColor: theme.colors.surfaceAlt }]}>
          {total} eventos
        </Text>
      </View>

      <View style={styles.chart}>
        {data.map((d) => (
          <Bar
            key={d.type}
            type={d.type}
            count={d.count}
            ratio={d.count / max}
            percent={total > 0 ? Math.round((d.count / total) * 100) : 0}
          />
        ))}
      </View>
    </View>
  );
};

const Bar: React.FC<{ type: DisasterType; count: number; ratio: number; percent: number }> = ({
  type,
  count,
  ratio,
  percent,
}) => {
  const { theme } = useTheme();
  const color = typeColor(type, theme);
  const grow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(grow, {
      toValue: ratio,
      duration: 900,
      delay: 100,
      useNativeDriver: false,
    }).start();
  }, [grow, ratio]);

  return (
    <View style={styles.barCol}>
      {/* Valor + % */}
      <View style={styles.valueWrap}>
        <Text style={[styles.value, { color: theme.colors.text }]}>{count}</Text>
        <Text style={[styles.percent, { color: theme.colors.textFaint }]}>
          {percent}%
        </Text>
      </View>

      {/* Trilha da barra */}
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceAlt }]}>
        {/* Preenchimento animado */}
        <Animated.View
          style={[
            styles.fill,
            {
              height: grow.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              backgroundColor: color,
            },
          ]}
        >
          {/* Faixa superior mais clara para dar profundidade */}
          <View style={[styles.highlight, { backgroundColor: color }]} />
        </Animated.View>
      </View>

      {/* Ícone + label */}
      <Text style={styles.emoji}>{disasterMeta[type].icon}</Text>
      <Text style={[styles.label, { color: theme.colors.textMuted }]} numberOfLines={1}>
        {disasterMeta[type].label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 16, marginTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  totalChip: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    alignItems: 'flex-end',
  },
  barCol: { alignItems: 'center', flex: 1 },
  valueWrap: { alignItems: 'center', marginBottom: 6, height: 32, justifyContent: 'flex-end' },
  value: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5, lineHeight: 20 },
  percent: { fontSize: 10, fontWeight: '700', marginTop: 1 },
  track: {
    width: 22,
    height: 90,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: { width: '100%', borderRadius: 7, overflow: 'hidden' },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  emoji: { fontSize: 16, marginTop: 10 },
  label: { fontSize: 10, fontWeight: '700', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
});
