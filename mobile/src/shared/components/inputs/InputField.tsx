import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@shared/theme';

type InputFieldProps = {
  label: string;
  placeholder: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
};

export function InputField({ label, placeholder, iconName }: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {iconName ? (
          <View style={styles.leading}>
            <MaterialIcons name={iconName} size={20} color={colors.primary} />
          </View>
        ) : null}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.soft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  leading: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    ...typography.body,
    paddingVertical: spacing.sm,
  },
});
