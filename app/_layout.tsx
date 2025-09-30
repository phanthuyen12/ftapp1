import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });

  // if (!loaded) {
  //   // Async font loading only occurs in development.
  //   return null;
  // }

    const [fontsLoaded] = useFonts({
        'SFProDisplay-Regular': require('../assets/fonts/SFProDisplay-Regular.otf'),
        'SFProDisplay-Bold': require('../assets/fonts/SFProDisplay-Bold.otf'),
        'SFProDisplay-Medium': require('../assets/fonts/SFProDisplay-Medium.otf'),
      });
    
      if (!fontsLoaded) {
        return null; // hoặc custom loading view
      }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
