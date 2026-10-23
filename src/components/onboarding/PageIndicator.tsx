import { Animated, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type PageIndicatorProps = {
  count: number;
  active: number;
  // Width of the active bar; animates 2 → 40 as the slide comes in.
  activeWidth?: Animated.Value | number;
};

// Active page is a 40×2 bar; the rest are 2×2 dots at 40% opacity.
export function PageIndicator({ count, active, activeWidth = 40 }: PageIndicatorProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) =>
        i === active ? (
          <Animated.View key={i} style={[styles.active, { width: activeWidth }]} />
        ) : (
          <View key={i} style={styles.dot} />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  active: { height: 2, backgroundColor: colors.black1000 },
  dot: { width: 2, height: 2, backgroundColor: colors.black1000, opacity: 0.4 },
});
