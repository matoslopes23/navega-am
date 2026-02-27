import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@shared/components/Screen';
import { colors, spacing, typography } from '@shared/theme';
import type { RootStackParamList } from '@app/navigation/types';
import { HeaderBar } from './components/HeaderBar';
import { SearchCard } from './components/SearchCard';
import { SectionHeader } from './components/SectionHeader';
import { DepartureCard } from './components/DepartureCard';
import { PromoBanner } from './components/PromoBanner';
import { FloatingAction } from './components/FloatingAction';
import { mockDepartures } from './data/mockDepartures';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <HeaderBar />

        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Olá, viajante!</Text>
          <Text style={styles.greetingSubtitle}>Para onde vamos navegar hoje?</Text>
        </View>

        <SearchCard
          onSearch={() => {
            navigation.navigate('SearchResults');
          }}
        />

        <SectionHeader title="Próximas Saídas" actionLabel="Ver todas" />
        <View style={styles.departuresList}>
          {mockDepartures.map((departure) => (
            <DepartureCard
              key={departure.id}
              departure={departure}
              onPress={() => {
                navigation.navigate('RouteDetails');
              }}
            />
          ))}
        </View>

        <PromoBanner />
        <FloatingAction
          onPress={() => {
            navigation.navigate('Map');
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  greeting: {
    gap: spacing.xs,
  },
  greetingTitle: {
    ...typography.heading,
    color: colors.text,
  },
  greetingSubtitle: {
    ...typography.body,
    color: colors.mutedText,
  },
  departuresList: {
    gap: spacing.md,
  },
});
