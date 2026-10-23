import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme';

type InlineButtonProps = {
  prompt: string;
  action: string;
  onPress?: () => void;
};

// Figma component "inlineButton" (49:500): prompt text followed by an underlined action.
export function InlineButton({ prompt, action, onPress }: InlineButtonProps) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} style={styles.row}>
      <Text style={[styles.text, styles.prompt]}>{prompt}</Text>
      <Text style={[styles.text, styles.action]}>{action}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  text: {
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black1000,
    textTransform: 'uppercase',
  },
  prompt: { fontFamily: fonts.sansSemiBold },
  action: { fontFamily: fonts.sansExtraBold, textDecorationLine: 'underline' },
});
