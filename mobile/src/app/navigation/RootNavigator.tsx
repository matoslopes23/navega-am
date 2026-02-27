import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { SearchResultsScreen } from '@features/search/SearchResultsScreen';
import { RouteDetailsScreen } from '@features/route/RouteDetailsScreen';
import { MapScreen } from '@features/map/MapScreen';
import { NotificationsScreen } from '@features/notifications/NotificationsScreen';
import { ContributionScreen } from '@features/contribution/ContributionScreen';
import { AboutScreen } from '@features/about/AboutScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="SearchResults"
          component={SearchResultsScreen}
          options={{ title: 'Resultados de Busca' }}
        />
        <Stack.Screen
          name="RouteDetails"
          component={RouteDetailsScreen}
          options={{ title: 'Detalhes da Rota' }}
        />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mapa Fluvial' }} />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: 'Notificações' }}
        />
        <Stack.Screen
          name="Contribution"
          component={ContributionScreen}
          options={{ title: 'Contribuir com a Rede' }}
        />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'Sobre o Projeto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
