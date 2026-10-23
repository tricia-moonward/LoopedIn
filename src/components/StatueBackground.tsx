import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

// Full-screen paper + faded dithered statue, exported flat from Figma at @2x (393×852).
// Shared background for the sign-up / account screens after onboarding.
export function StatueBackground() {
  return (
    <Image
      source={require('@assets/images/statue-background.webp')}
      contentFit="cover"
      contentPosition="top"
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}
