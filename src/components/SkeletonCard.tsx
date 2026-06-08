import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

/** Placeholder animado (skeleton loading) durante o carregamento. */
export const SkeletonCard: React.FC = () => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const block = (w: number | string, h: number, mt = 0) => (
    <Animated.View
      style={{
        width: w as any,
        height: h,
        marginTop: mt,
        borderRadius: 6,
        backgroundColor: theme.colors.surfaceAlt,
        opacity,
      }}
    />
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {block('40%', 12)}
      {block('85%', 18, 12)}
      {block('55%', 12, 8)}
      {block('100%', 34, 16)}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 12 },
});
