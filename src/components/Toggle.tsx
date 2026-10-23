import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { colors } from '@/theme';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

const SLIDE_MS = 180;

// Figma component "Switch" (53:3131): iOS-style pill, light grey off, black on, white knob.
export function Toggle({ value, onValueChange, accessibilityLabel }: ToggleProps) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: SLIDE_MS,
      easing: Easing.out(Easing.cubic),
      // Colour can't use the native driver.
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      aria-checked={value}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={styles.hitArea}
    >
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: progress.interpolate({ inputRange: [0, 1], outputRange: [colors.toggleOff, colors.black1000] }) },
        ]}
      >
        <Animated.View
          style={[styles.knob, { transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) }] }]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitArea: { width: 59, height: 31, alignItems: 'center', justifyContent: 'center' },
  track: { width: 51, height: 31, borderRadius: 15.5, padding: 2 },
  knob: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: colors.white,
    boxShadow: '0px 3px 1px rgba(0,0,0,0.06), 0px 3px 8px rgba(0,0,0,0.15)',
  },
});
