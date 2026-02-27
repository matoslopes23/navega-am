import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@shared/theme';

type PageProps = PropsWithChildren<{ scroll?: boolean }>;

export function Page({ children, scroll = true }: PageProps) {
  if (!scroll) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  scroll: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
});
