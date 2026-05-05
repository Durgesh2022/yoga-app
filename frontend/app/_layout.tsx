import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useInter,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  useFonts as usePlayfair,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import { UserProvider } from '../context/UserContext';
import { fonts } from '../constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [interLoaded] = useInter({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [playfairLoaded] = usePlayfair({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
  });

  const fontsLoaded = interLoaded && playfairLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      const TextAny = Text as any;
      const TextInputAny = TextInput as any;
      TextAny.defaultProps = TextAny.defaultProps || {};
      TextAny.defaultProps.style = [{ fontFamily: fonts.sans }, TextAny.defaultProps.style];
      TextInputAny.defaultProps = TextInputAny.defaultProps || {};
      TextInputAny.defaultProps.style = [{ fontFamily: fonts.sans }, TextInputAny.defaultProps.style];
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <UserProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 280,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="astrologer-detail" />
        <Stack.Screen name="talk-to-expert" />
        <Stack.Screen name="consultation-confirm" />
        <Stack.Screen name="personal-info" />
        <Stack.Screen name="wallet" />
        <Stack.Screen name="transactions" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="spiritual-preferences" />
      </Stack>
    </UserProvider>
  );
}
