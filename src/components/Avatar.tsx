import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

type AvatarTone =
  // Black circle, white initial (people in lists, the other person when pending).
  | 'dark'
  // White circle with a faint border (you, before connecting).
  | 'light'
  // White circle with a black border (you, once connected).
  | 'outlined'
  // Lime circle with a black border (the other person, once connected).
  | 'lime';

type AvatarProps = {
  name: string;
  size: 24 | 32 | 64;
  tone: AvatarTone;
};

// Round initial avatar (Figma 92:2826, 92:2961).
export function Avatar({ name, size, tone }: AvatarProps) {
  const textStyle = size === 64 ? styles.bigText : size === 24 ? styles.tinyText : styles.smallText;
  return (
    <View style={[styles.circle, { width: size, height: size }, toneStyles[tone]]}>
      <Text style={[textStyle, tone === 'dark' && styles.lightText]}>
        {name.trim().charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  tinyText: { fontFamily: fonts.serif, fontSize: 10, lineHeight: 10, letterSpacing: -0.3, color: colors.black1000 },
  smallText: { fontFamily: fonts.serif, fontSize: 16, lineHeight: 16, letterSpacing: -0.48, color: colors.black1000 },
  bigText: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 40, letterSpacing: -0.96, color: colors.black1000 },
  lightText: { color: colors.white },
});

const toneStyles = StyleSheet.create({
  dark: { backgroundColor: colors.black1000 },
  light: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.black100 },
  outlined: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.black1000 },
  lime: { backgroundColor: colors.accentLime, borderWidth: 1, borderColor: colors.black1000 },
});
