import { PropsWithChildren } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  useFonts,
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@shared/theme';

export function AppProviders({ children }: PropsWithChildren) {
  const [fontsLoaded] = useFonts({
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return <SafeAreaProvider>{children}</SafeAreaProvider>;
}
