import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Badge "AO VIVO" com pulsação real:
 * - bolinha interna que respira (scale + opacity)
 * - halo externo que se expande continuamente como onda de rádio
 */
export const LiveBadge: React.FC = () => {
  const { theme } = useTheme();

  const breathe = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Respiração suave da bolinha central
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Onda expandindo (sinal de rádio)
    Animated.loop(
      Animated.timing(wave, { toValue: 1, duration: 1600, useNativeDriver: true })
    ).start();
  }, [breathe, wave]);

  return (
    <View style={[styles.badge, { backgroundColor: theme.colors.danger + '1A' }]}>
      <View style={styles.dotWrap}>
        {/* Onda de rádio expandindo */}
        <Animated.View
          style={[
            styles.wave,
            {
              borderColor: theme.colors.danger,
              transform: [
                { scale: wave.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.6] }) },
              ],
              opacity: wave.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
            },
          ]}
        />
        {/* Bolinha respirando */}
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: theme.colors.danger,
              transform: [
                { scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.15] }) },
              ],
              opacity: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }),
            },
          ]}
        />
      </View>
      <Text style={[styles.text, { color: theme.colors.danger }]}>AO VIVO</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },
  dotWrap: {
    width: 9,
    height: 9,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  wave: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  text: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
});
