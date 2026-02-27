import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { InputField } from '@shared/components/inputs';
import { Button } from '@shared/components/buttons';
import { colors, spacing } from '@shared/theme';

type SearchCardProps = {
  onSearch?: () => void;
};

export function SearchCard({ onSearch }: SearchCardProps) {
  return (
    <View style={styles.card}>
      <InputField label="De onde você sai?" placeholder="Ex: Manaus" iconName="location-on" />
      <View style={styles.swapWrapper}>
        <Pressable style={styles.swapButton}>
          <MaterialIcons name="swap-vert" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <InputField label="Para onde deseja ir?" placeholder="Ex: Parintins" iconName="near-me" />
      <Button label="Buscar Rotas" onPress={onSearch} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  swapWrapper: {
    alignItems: 'center',
    marginVertical: -spacing.sm,
    zIndex: 2,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
