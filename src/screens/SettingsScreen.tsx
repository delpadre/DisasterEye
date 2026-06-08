import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAlerts } from '@/contexts/AlertsContext';

export const SettingsScreen: React.FC = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const { alerts, favorites, history } = useAlerts();

  const Section = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionLabel, { color: theme.colors.textFaint }]}>{title}</Text>
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {children}
      </View>
    </View>
  );

  const Item = ({
    icon,
    label,
    right,
    onPress,
    last,
  }: {
    icon: string;
    label: string;
    right?: React.ReactNode;
    onPress?: () => void;
    last?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      style={[styles.item, !last && { borderBottomColor: theme.colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
    >
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text style={[styles.itemLabel, { color: theme.colors.text }]}>{label}</Text>
      <View style={styles.itemRight}>{right}</View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Configurações</Text>

        <Section title="APARÊNCIA">
          <Item
            icon={mode === 'dark' ? '🌙' : '☀️'}
            label="Modo escuro"
            last
            right={
              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                thumbColor="#fff"
              />
            }
          />
        </Section>

        <Section title="ESTATÍSTICAS">
          <Item icon="📡" label="Alertas carregados" right={<Badge text={`${alerts.length}`} theme={theme} />} />
          <Item icon="⭐" label="Favoritos salvos" right={<Badge text={`${favorites.length}`} theme={theme} />} />
          <Item icon="🕑" label="Itens no histórico" last right={<Badge text={`${history.length}`} theme={theme} />} />
        </Section>

        <Section title="FONTES DE DADOS">
          <Item
            icon="🛰"
            label="INPE — Programa Queimadas"
            onPress={() => Linking.openURL('https://terrabrasilis.dpi.inpe.br/queimadas/portal/')}
            right={<Text style={{ color: theme.colors.primary }}>↗</Text>}
          />
          <Item
            icon="🌍"
            label="NASA Open APIs"
            last
            onPress={() => Linking.openURL('https://api.nasa.gov/')}
            right={<Text style={{ color: theme.colors.primary }}>↗</Text>}
          />
        </Section>

        <Section title="SOBRE">
          <Item icon="ℹ️" label="DisasterEye" right={<Text style={{ color: theme.colors.textMuted }}>v1.0.0</Text>} />
          <Item icon="🎓" label="Global Solution — FIAP" last right={<Text style={{ color: theme.colors.textMuted }}>2026</Text>} />
        </Section>

        <Text style={[styles.footer, { color: theme.colors.textFaint }]}>
          DisasterEye conecta dados de satélites à vida cotidiana, transformando imagens orbitais em
          alertas que salvam vidas. 🛰️🌎
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Badge = ({ text, theme }: { text: string; theme: any }) => (
  <View style={[styles.badge, { backgroundColor: theme.colors.surfaceAlt }]}>
    <Text style={[styles.badgeText, { color: theme.colors.text }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8, marginBottom: 8 },
  sectionWrap: { marginTop: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  section: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
  itemIcon: { fontSize: 18, marginRight: 12 },
  itemLabel: { fontSize: 15, fontWeight: '500', flex: 1 },
  itemRight: { marginLeft: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 13, fontWeight: '700' },
  footer: { fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 28, paddingHorizontal: 12 },
});
