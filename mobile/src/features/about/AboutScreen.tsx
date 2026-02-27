import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@shared/components/Screen';
import { InfoCard } from '@shared/components/cards';
import { colors, spacing, typography } from '@shared/theme';

const items = ['Política de Privacidade', 'Perguntas Frequentes', 'Suporte'];

export function AboutScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Sobre o Projeto</Text>
        <Text style={styles.subtitle}>Navega AM</Text>
      </View>
      <InfoCard>
        <Text style={styles.sectionTitle}>Nossa missão</Text>
        <Text style={styles.body}>
          Facilitar o deslocamento fluvial e conectar comunidades da Amazônia com mais segurança e
          informação.
        </Text>
      </InfoCard>
      <InfoCard>
        <Text style={styles.sectionTitle}>Links úteis</Text>
        <View style={styles.links}>
          {items.map((item) => (
            <Text key={item} style={styles.linkText}>
              • {item}
            </Text>
          ))}
        </View>
      </InfoCard>
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
    ...typography.caption,
    color: colors.muted,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.muted,
  },
  links: {
    gap: spacing.xs,
  },
  linkText: {
    ...typography.caption,
    color: colors.primary,
  },
});
