import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@shared/components/Screen';
import { Button } from '@shared/components/buttons';
import { InfoCard } from '@shared/components/cards';
import { colors, spacing, typography } from '@shared/theme';
import type { RootStackParamList } from '@app/navigation/types';

const results = [
  { id: '1', name: 'Lancha Expresso', time: '08:00', duration: '8h 30m', price: 'R$ 380,00' },
  { id: '2', name: 'N/M Amazon Star', time: '18:00', duration: '24h 00m', price: 'R$ 159,00' },
  { id: '3', name: 'Ferry Boat', time: '11:00', duration: '20h 00m', price: 'R$ 220,00' },
];

export function SearchResultsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Resultados de Busca</Text>
        <Text style={styles.subtitle}>Manaus → Parintins</Text>
      </View>
      <View style={styles.filters}>
        {['Lanchas', 'Recreio', 'Regional'].map((label) => (
          <View key={label} style={styles.filterTag}>
            <Text style={styles.filterText}>{label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.list}>
        {results.map((item) => (
          <InfoCard key={item.id}>
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardMeta}>Saída {item.time}</Text>
                <Text style={styles.cardMeta}>Duração {item.duration}</Text>
              </View>
              <View style={styles.cardPrice}>
                <Text style={styles.price}>{item.price}</Text>
                <Button
                  label="Ver detalhes"
                  size="sm"
                  onPress={() => {
                    navigation.navigate('RouteDetails');
                  }}
                />
              </View>
            </View>
          </InfoCard>
        ))}
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
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterTag: {
    backgroundColor: colors.soft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  filterText: {
    ...typography.caption,
    color: colors.primary,
  },
  list: {
    gap: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cardInfo: {
    gap: spacing.xs,
    flex: 1,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  cardMeta: {
    ...typography.caption,
    color: colors.muted,
  },
  cardPrice: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    ...typography.subtitle,
    color: colors.primary,
  },
});
