import {
  Mulish_400Regular,
  Mulish_500Medium,
  Mulish_600SemiBold,
  Mulish_700Bold,
  Mulish_800ExtraBold,
} from '@expo-google-fonts/mulish';
import { PTSerif_400Regular } from '@expo-google-fonts/pt-serif';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

import { preventIosInputZoom } from '@/utils/preventIosInputZoom';

preventIosInputZoom();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_800ExtraBold,
    PTSerif_400Regular,
  });

  // If a font fails or times out (e.g. mobile Safari on a slow LAN), render with
  // fallback fonts rather than leaving the screen blank.
  if (fontError) console.warn('Font loading failed', fontError);
  if (!fontsLoaded && !fontError) return null;

  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
