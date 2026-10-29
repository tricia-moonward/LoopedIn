import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { PaperTexture } from '@/components/PaperTexture';
import { colors } from '@/theme';

type PaperBackgroundProps = {
  // Tint the gradient fades into at the bottom of the screen, at 47% alpha.
  tint: string;
};

// White base, a white→tint vertical gradient, and a paper texture multiplied on top.
export function PaperBackground({ tint }: PaperBackgroundProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['rgba(255,255,255,0.47)', `${tint}78`]}
        locations={[0.41143, 0.99977]}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.white }]}
      />
      <PaperTexture />
    </View>
  );
}
