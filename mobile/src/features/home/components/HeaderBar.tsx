import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography } from '@shared/theme';

export function HeaderBar() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <MaterialIcons name="directions-boat" size={22} color={colors.white} />
      </View>
      <Text style={styles.title}>Navega AM</Text>
      <View style={styles.avatar}>
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmbYfRGh5FO7LCz2xSl2oyJB7ueZxGvfNxQqccDRCSpJ4towXA-9sDco1EW-2E1Aq9ZQb6Y85KJFQfBc5IqrR6WzkmwA8CMSxpfTH0zaj0onaCj1xV8BzBkpACNSLrekmmAMj0bHb2WwAKkvI1QP1zHZNf4717iXUgBlchVRb-MXe0N5roqri-o8eCAZJMfXV7z2S-vAI7hmY6XFFVcEP7Q-pSd2xk4CifpgxsZzIsCw1P39xp1mJy4vj7Xd8LHc9RsQQZx6nDnng',
          }}
          style={styles.avatarImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.subtitle,
    color: colors.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.soft,
    borderWidth: 2,
    borderColor: `${colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});
