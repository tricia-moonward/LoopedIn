import { Pressable, StyleSheet, Text, View } from 'react-native';

import CloseDark from '@assets/icons/close-dark.svg';
import CloseWhite from '@assets/icons/close-white.svg';
import { colors, fonts } from '@/theme';

type CheckInTopBarProps = {
  title: string;
  // Light sits on the sky (white close and title); dark sits on paper.
  tone: 'light' | 'dark';
  onClose: () => void;
};

// Figma "topBar" (148:591) with a close button and centred title.
export function CheckInTopBar({ title, tone, onClose }: CheckInTopBarProps) {
  const light = tone === 'light';
  return (
    <View style={[styles.bar, light ? styles.lightRule : styles.darkRule]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} onPress={onClose}>
        {light ? <CloseWhite width={24} height={24} /> : <CloseDark width={24} height={24} />}
      </Pressable>
      <Text style={[styles.title, light && styles.lightTitle]}>{title}</Text>
      {/* Balances the close button so the title stays centred. */}
      <View style={styles.trailing} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  lightRule: { borderBottomColor: 'rgba(255,255,255,0.4)' },
  darkRule: { borderBottomColor: colors.black200 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: -0.48,
    color: colors.black1000,
    textTransform: 'capitalize',
  },
  lightTitle: { color: colors.white },
  trailing: { width: 24, height: 24 },
});
