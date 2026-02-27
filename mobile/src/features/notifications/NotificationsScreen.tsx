import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@shared/components/Screen';
import { InfoCard } from '@shared/components/cards';
import { colors, spacing, typography } from '@shared/theme';

const notifications = [
  { id: '1', title: 'Embarque iniciado: Ana Karoline', detail: 'Embarque aberto no portão 02.' },
  { id: '2', title: 'Saída confirmada: Expresso Rio Negro', detail: 'Saída às 08:00 de amanhã.' },
  { id: '3', title: 'Bilhete atualizado', detail: 'Sua reserva foi confirmada.' },
];

export function NotificationsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Notificações</Text>
      <View style={styles.list}>
        {notifications.map((notification) => (
          <InfoCard key={notification.id}>
            <Text style={styles.cardTitle}>{notification.title}</Text>
            <Text style={styles.cardDetail}>{notification.detail}</Text>
          </InfoCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: colors.text,
  },
  list: {
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  cardDetail: {
    ...typography.caption,
    color: colors.muted,
    marginTop: spacing.xs,
  },
});
