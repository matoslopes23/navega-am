import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@shared/components/Screen';
import { Button } from '@shared/components/buttons';
import { InfoCard } from '@shared/components/cards';
import { colors, spacing, typography } from '@shared/theme';

const steps = [
  'Selecione sua rota disponível',
  'Informe origem e destino',
  'Envie detalhes da embarcação',
];

export function ContributionScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Contribuir com a Rede</Text>
        <Text style={styles.subtitle}>Ajude outros viajantes com informações atualizadas.</Text>
      </View>
      <InfoCard>
        <Text style={styles.sectionTitle}>Como funciona</Text>
        <View style={styles.steps}>
          {steps.map((step) => (
            <Text key={step} style={styles.stepText}>
              • {step}
            </Text>
          ))}
        </View>
      </InfoCard>
      <View style={styles.actions}>
        <Button label="Enviar atualização" />
        <Button label="Upload de foto" variant="outline" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.muted,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  steps: {
    gap: spacing.xs,
  },
  stepText: {
    ...typography.caption,
    color: colors.muted,
  },
  actions: {
    gap: spacing.sm,
  },
});
