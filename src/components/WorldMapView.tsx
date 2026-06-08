import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, LayoutChangeEvent,Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { GlobalFireHotspot, HotspotConfidence } from '@/types';

interface Props {
  hotspots: GlobalFireHotspot[];
}

const project = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * 100,
  y: ((90 - lat) / 180) * 100,
});

const confidenceColor = (c: HotspotConfidence, t: any): string => {
  switch (c) {
    case 'high':    return t.colors.danger;
    case 'nominal': return t.colors.accent;
    case 'low':     return t.colors.warning;
  }
};

const confidenceSize = (c: HotspotConfidence): number => {
  switch (c) {
    case 'high':    return 10;
    case 'nominal': return 8;
    case 'low':     return 6;
  }
};

export const WorldMapView: React.FC<Props> = ({ hotspots }) => {
  const { theme } = useTheme();
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  };

  return (
    <View
      onLayout={onLayout}
      style={[styles.frame, { backgroundColor: theme.colors.bgElevated, borderColor: theme.colors.border }]}
    >
      <Continents theme={theme} />
      <Grid theme={theme} />

      {size.w > 0 &&
        hotspots.map((h) => {
          const { x, y } = project(h.latitude, h.longitude);
          return (
            <HotspotDot
              key={h.id}
              hotspot={h}
              left={(x / 100) * size.w}
              top={(y / 100) * size.h}
              theme={theme}
            />
          );
        })}

      <View style={[styles.corner, styles.cornerTL, { borderColor: theme.colors.primary }]} />
      <View style={[styles.corner, styles.cornerTR, { borderColor: theme.colors.primary }]} />
      <View style={[styles.corner, styles.cornerBL, { borderColor: theme.colors.primary }]} />
      <View style={[styles.corner, styles.cornerBR, { borderColor: theme.colors.primary }]} />
    </View>
  );
};

const HotspotDot: React.FC<{ hotspot: GlobalFireHotspot; left: number; top: number; theme: any }> = ({
  hotspot, left, top, theme,
}) => {
  const color = confidenceColor(hotspot.confidence, theme);
  const size = confidenceSize(hotspot.confidence);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = Math.random() * 1500;
    const anim = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1800, delay, useNativeDriver: true })
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  return (
    <View pointerEvents="none" style={[styles.dotWrap, { left: left - 16, top: top - 16 }]}>
      <Animated.View
        style={[
          styles.halo,
          {
            borderColor: color, width: size, height: size, borderRadius: size / 2,
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 4] }) }],
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
          },
        ]}
      />
      <View style={[styles.dot, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]} />
    </View>
  );
};

const Continents: React.FC<{ theme: any }> = ({ theme }) => {
  return (
    <Image
      source={require('../assets/images/worldMap.png')}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
        opacity: theme.mode === 'dark' ? 0.3 : 0.45,
      }}
    />
  );
};

const Grid: React.FC<{ theme: any }> = ({ theme }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[25, 50, 75].map((y) => (
        <View
          key={`h-${y}`}
          style={{
            position: 'absolute',
            top: `${y}%`,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: theme.colors.primary + '20',
          }}
        />
      ))}

      {[25, 50, 75].map((x) => (
        <View
          key={`v-${x}`}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: theme.colors.primary + '20',
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 2.05, borderRadius: 16, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  dotWrap: { position: 'absolute', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', borderWidth: 2 },
  dot: {},
  corner: { position: 'absolute', width: 14, height: 14, borderWidth: 1.5 },
  cornerTL: { top: 6, left: 6, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 6, right: 6, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 6, left: 6, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 6, right: 6, borderLeftWidth: 0, borderTopWidth: 0 },
});