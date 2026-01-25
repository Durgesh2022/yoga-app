import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '../context/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
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
