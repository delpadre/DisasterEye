import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAlerts } from '@/contexts/AlertsContext';
import { fetchAlertById, fetchSmokePlumeForAlert, fetchWeather } from '@/services/api';
import { disasterMeta, severityColor } from '@/theme';
import { DisasterAlert, SmokePlumeForecast, WeatherData } from '@/types';
import { SeverityBadge } from '@/components/SeverityBadge';
import { SmokeRouteCard } from '@/components/SmokeRouteCard';
import { SatelliteReportCard } from '@/components/SatelliteReportCard';
import { formatDateTime, formatArea } from '@/utils/format';

export const AlertDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { id } = route.params;
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useAlerts();
  const [alert, setAlert] = useState<DisasterAlert | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [plume, setPlume] = useState<SmokePlumeForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const a = await fetchAlertById(id);
      if (!active || !a) return;
      setAlert(a);
      setLoading(false);
      // Clima local e — se for queimada — rota da fumaça em paralelo
      const [w, p] = await Promise.all([
        fetchWeather(a.coordinates.latitude, a.coordinates.longitude, a.type),
        a.type === 'wildfire' ? fetchSmokePlumeForAlert(a.id) : Promise.resolve(undefined),
      ]);
      if (!active) return;
      setWeather(w);
      if (p) setPlume(p);
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading || !alert) {
    return (
      <SafeAreaView style={[styles.safe, styles.center, { backgroundColor: theme.colors.bg }]}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  const meta = disasterMeta[alert.type];
  const accent = severityColor(alert.severity, theme);
  const fav = isFavorite(alert.id);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.rowLabel, { color: theme.colors.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: theme.colors.text }]}>‹ Voltar</Text>
        </Pressable>
        <Pressable hitSlop={12} onPress={() => toggleFavorite(alert)}>
          <Text style={[styles.star, { color: fav ? theme.colors.warning : theme.colors.textFaint }]}>
            {fav ? '★' : '☆'}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: accent + '14', borderColor: accent + '40' }]}>
          <Text style={styles.heroEmoji}>{meta.icon}</Text>
          <SeverityBadge severity={alert.severity} />
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>{alert.title}</Text>
          <Text style={[styles.heroLocation, { color: theme.colors.textMuted }]}>
            📍 {alert.location} — {alert.state}
          </Text>
        </View>

        {/* Relatório técnico do satélite */}
        <SatelliteReportCard alert={alert} />

        {/* Dados técnicos */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Dados do evento</Text>
          <Row label="Tipo" value={meta.label} />
          <Row label="Fonte" value={`🛰 ${alert.source}`} />
          <Row label="Confiança" value={`${alert.confidence}%`} />
          <Row label="Área afetada" value={formatArea(alert.affectedAreaKm2)} />
          <Row label="Detectado em" value={formatDateTime(alert.detectedAt)} />
          <Row
            label="Coordenadas"
            value={`${alert.coordinates.latitude.toFixed(3)}, ${alert.coordinates.longitude.toFixed(3)}`}
          />
        </View>

        {/* Clima correlacionado */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Condição meteorológica
          </Text>
          {weather ? (
            <View style={styles.weatherRow}>
              <Text style={[styles.temp, { color: theme.colors.primary }]}>{weather.temperature}°C</Text>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={[styles.weatherDesc, { color: theme.colors.text }]}>
                  {weather.description}
                </Text>
                <Text style={[styles.weatherMeta, { color: theme.colors.textMuted }]}>
                  💧 {weather.humidity}% umidade · 💨 {weather.windSpeed} m/s
                </Text>
              </View>
            </View>
          ) : (
            <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 8 }} />
          )}
        </View>

        {/* Rota da fumaça — só aparece em queimadas */}
        {plume && (
          <>
            <View style={styles.smokeHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                💨 Rota da fumaça
              </Text>
              <Text style={[styles.smokeHint, { color: theme.colors.textMuted }]}>
                Trajetória prevista da fuligem por MODIS / ventos
              </Text>
            </View>
            <SmokeRouteCard plume={plume} />
          </>
        )}

        <Text style={[styles.disclaimer, { color: theme.colors.textFaint }]}>
          Dados processados pela API DisasterEye a partir de fontes INPE e NASA. Em caso de
          emergência, acione a Defesa Civil (199).
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  back: { fontSize: 16, fontWeight: '600' },
  star: { fontSize: 24 },
  scroll: { padding: 16, paddingBottom: 40 },
  hero: { borderRadius: 22, borderWidth: 1, padding: 20, alignItems: 'flex-start' },
  heroEmoji: { fontSize: 40, marginBottom: 12 },
  heroTitle: { fontSize: 24, fontWeight: '800', marginTop: 12, lineHeight: 30, letterSpacing: -0.5 },
  heroLocation: { fontSize: 14, marginTop: 6 },
  section: { borderRadius: 18, borderWidth: 1, padding: 16, marginTop: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  desc: { fontSize: 14, lineHeight: 21 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  weatherRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  temp: { fontSize: 44, fontWeight: '800', letterSpacing: -1 },
  weatherDesc: { fontSize: 15, fontWeight: '600', textTransform: 'capitalize' },
  weatherMeta: { fontSize: 13, marginTop: 4 },
  smokeHeader: { marginTop: 20, marginBottom: 8 },
  smokeHint: { fontSize: 12, marginTop: 2 },
  disclaimer: { fontSize: 12, lineHeight: 18, marginTop: 20, textAlign: 'center' },
});
