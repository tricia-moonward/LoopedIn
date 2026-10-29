import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

type BadgeProps = {
  label: string;
  background: string;
  // Defaults to black; white on the darker accents (red, purple).
  color?: string;
  // Small is the 10pt tag under names (People list, View Connection).
  size?: 'regular' | 'small';
  // Centred by default; 'start' for badges in a left-aligned column.
  align?: 'center' | 'start';
};

// Square-cornered label with a black outline (Figma "💭 DAILY CHECK IN", "🤍 ROMANTIC").
export function Badge({ label, background, color = colors.black1000, size = 'regular', align = 'center' }: BadgeProps) {
  return (
    <View style={[styles.badge, align === 'start' && styles.start, { backgroundColor: background }]}>
      <Text style={[styles.text, size === 'small' && styles.smallText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.black1000,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  start: { alignSelf: 'flex-start' },
  text: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36 },
  smallText: { fontSize: 10, letterSpacing: -0.3 },
});
