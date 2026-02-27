import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeScreen } from '@features/home/HomeScreen';
import { SearchResultsScreen } from '@features/search/SearchResultsScreen';
import { NotificationsScreen } from '@features/notifications/NotificationsScreen';
import { AboutScreen } from '@features/about/AboutScreen';
import { colors, typography } from '@shared/theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          height: 72,
          paddingTop: 10,
          paddingBottom: 12,
          shadowColor: '#0F172A',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          elevation: 10,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          fontFamily: 'Lexend_600SemiBold',
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<keyof RootTabParamList, keyof typeof MaterialIcons.glyphMap> = {
            Home: 'home',
            Tickets: 'confirmation-number',
            Alerts: 'notifications',
            Menu: 'menu',
          };
          return <MaterialIcons name={iconMap[route.name]} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Tickets" component={SearchResultsScreen} options={{ title: 'Bilhetes' }} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} options={{ title: 'Alertas' }} />
      <Tab.Screen name="Menu" component={AboutScreen} options={{ title: 'Menu' }} />
    </Tab.Navigator>
  );
}
