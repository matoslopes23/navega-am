import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@shared/theme';
import type { Departure } from '../data/mockDepartures';

type DepartureCardProps = {
  departure: Departure;
  onPress?: () => void;
};

const statusLabelMap: Record<Departure['status'], string> = {
  'no-porto': 'NO PORTO',
  embarcando: 'EMBARCANDO',
  programado: 'PROGRAMADO',
};

const statusStyleMap: Record<Departure['status'], { backgroundColor: string; color: string }> = {
  'no-porto': { backgroundColor: colors.successBackground, color: colors.success },
  embarcando: { backgroundColor: colors.warningBackground, color: colors.primary },
  programado: { backgroundColor: colors.infoBackground, color: colors.mutedText },
};

export function DepartureCard({ departure, onPress }: DepartureCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <MaterialIcons name={departure.iconName} size={26} color={departure.iconColor} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{departure.name}</Text>
          <Text style={styles.subtitle}>{departure.subtitle}</Text>
          <View style={styles.timeRow}>
            <MaterialIcons name="schedule" size={14} color={colors.mutedText} />
            <Text style={styles.time}>{departure.time}</Text>
          </View>
        </View>
        <View style={styles.meta}>
          <Text style={styles.price}>{departure.price}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: statusStyleMap[departure.status].backgroundColor },
            ]}
          >
            <Text style={[styles.badgeText, { color: statusStyleMap[departure.status].color }]}>
              {statusLabelMap[departure.status]}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.muted,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  time: {
    ...typography.caption,
    color: colors.mutedText,
  },
  meta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    ...typography.subtitle,
    color: colors.primary,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.caption,
    textTransform: 'uppercase',
  },
});
