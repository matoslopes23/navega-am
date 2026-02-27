import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@shared/theme';

type FloatingActionProps = {
  onPress?: () => void;
};

export function FloatingAction({ onPress }: FloatingActionProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name="map" size={18} color={colors.white} />
      </View>
      <Text style={styles.text}>Mapa fluvial</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.subtitle,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
