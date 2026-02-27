import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '@shared/theme';
import type { RootTabParamList } from '@app/navigation/types';

const items: { label: string; route: keyof RootTabParamList }[] = [
  { label: 'Início', route: 'Home' },
  { label: 'Bilhetes', route: 'Tickets' },
  { label: 'Alertas', route: 'Alerts' },
  { label: 'Menu', route: 'Menu' },
];

export function BottomNav() {
  const navigation = useNavigation<NativeStackNavigationProp<RootTabParamList>>();

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <Pressable
          key={item.label}
          style={styles.item}
          onPress={() => {
            navigation.navigate(item.route);
          }}
        >
          <Text style={styles.icon}>⬤</Text>
          <Text style={styles.label}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    color: colors.primary,
  },
  label: {
    ...typography.caption,
    color: colors.muted,
  },
});
