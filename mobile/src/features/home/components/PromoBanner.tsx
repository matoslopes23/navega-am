import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@shared/theme';

export function PromoBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.textBlock}>
        <Text style={styles.subtitle}>Curiosidade</Text>
        <Text style={styles.title}>Descubra as rotas pelo Rio Negro</Text>
        <Text style={styles.description}>
          Conheça destinos incríveis e horários atualizados para o seu passeio.
        </Text>
      </View>
      <View style={styles.iconWrapper}>
        <MaterialIcons name="explore" size={26} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.ink,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    shadowColor: '#0B1220',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    ...typography.heading,
    color: colors.white,
  },
  description: {
    ...typography.body,
    color: '#C7D2FE',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
