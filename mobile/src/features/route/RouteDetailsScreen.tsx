import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@shared/components/Screen';
import { Button } from '@shared/components/buttons';
import { InfoCard } from '@shared/components/cards';
import { colors, spacing, typography } from '@shared/theme';
import type { RootStackParamList } from '@app/navigation/types';

const itinerary = [
  { id: '1', label: 'Saída', value: 'Manaus (08:00)' },
  { id: '2', label: 'Chegada', value: 'Parintins (16:30)' },
  { id: '3', label: 'Duração', value: '8h 30m' },
];

export function RouteDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Expresso Rio Negro</Text>
        <Text style={styles.subtitle}>Histórico</Text>
      </View>
      <InfoCard>
        {itinerary.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </InfoCard>
      <InfoCard>
        <Text style={styles.sectionTitle}>Comodidades a bordo</Text>
        <View style={styles.badges}>
          {['Wi-Fi', 'Cabine', 'Lanchonete'].map((item) => (
            <View key={item} style={styles.badge}>
              <Text style={styles.badgeText}>{item}</Text>
            </View>
          ))}
        </View>
      </InfoCard>
      <View style={styles.actions}>
        <Button
          label="Ver Mapa"
          onPress={() => {
            navigation.navigate('Map');
          }}
        />
        <Button label="Compartilhar Rota" variant="outline" />
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
    ...typography.caption,
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.muted,
  },
  value: {
    ...typography.subtitle,
    color: colors.text,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.soft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primary,
  },
  actions: {
    gap: spacing.sm,
  },
});
