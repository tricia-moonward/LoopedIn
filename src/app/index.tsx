import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import LogoWordmark from '@assets/icons/logo-wordmark.svg';
import { Artwork } from '@/components/Artwork';
import { colors } from '@/theme';

const SPLASH_DURATION_MS = 2000;

// Figma: Onboarding / "Splash Screen" (48:149)
export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/onboarding'), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Artwork
        source={require('@assets/images/splash-statue.png')}
        x={0}
        y={0}
        width={393}
        height={852}
      />
      <View style={styles.logo}>
        <LogoWordmark width={235.991} height={48} accessibilityLabel="LoopedIn" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.splashBackground,
    overflow: 'hidden',
  },
  logo: { zIndex: 1 },
});
