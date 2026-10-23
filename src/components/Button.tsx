import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type ButtonVariant =
  // Black fill, white label.
  | 'solid'
  // 1pt black border, black label (Figma social sign-in buttons).
  | 'outline'
  // 10% black fill, 80% black label (secondary buttons in sheets: "Share", "Decline", "Finish").
  | 'soft'
  // No fill, underlined black label (Figma "Invite someone →" on Home).
  | 'text';

type ButtonProps = {
  label: string;
  icon?: ReactNode;
  // Shown after the label (e.g. the arrow on "Let's go").
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

// Figma component "button" (49:473): uppercase label with an optional leading icon.
export function Button({ label, icon, trailingIcon, variant = 'solid', style, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, variantStyles[variant], pressed && styles.pressed, style]}
    >
      {icon}
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      {trailingIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.black1000,
  },
  pressed: { opacity: 0.85 },
  label: {
    fontFamily: fonts.sansExtraBold,
    fontSize: 14,
    color: colors.white,
    textTransform: 'uppercase',
  },
});

const variantStyles = StyleSheet.create({
  solid: {},
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.black1000 },
  soft: { backgroundColor: colors.black100 },
  text: { backgroundColor: 'transparent', paddingHorizontal: 0, paddingVertical: 12 },
});

const labelStyles = StyleSheet.create({
  solid: {},
  outline: { color: colors.black1000 },
  soft: { color: colors.black800 },
  text: { color: colors.black1000, textDecorationLine: 'underline' },
});
