import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@shared/components/Screen';
import { colors, spacing, typography } from '@shared/theme';

export function MapScreen() {
  return (
    <Screen>
      <View style={styles.mapContainer}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>🧭</Text>
        </View>
        <Text style={styles.mapLabel}>Mapa fluvial interativo</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Portos em destaque</Text>
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>Porto de Manaus</Text>
          <Text style={styles.footerMeta}>Aberto • 2 rotas ativas</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: colors.soft,
    borderRadius: 20,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  marker: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    fontSize: 22,
    color: colors.white,
  },
  mapLabel: {
    ...typography.subtitle,
    color: colors.primary,
  },
  footer: {
    gap: spacing.sm,
  },
  footerTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  footerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerText: {
    ...typography.subtitle,
    color: colors.text,
  },
  footerMeta: {
    ...typography.caption,
    color: colors.muted,
  },
});
