import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, Platform, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useReduceMotion } from '@/hooks/useReduceMotion';

type FadeInProps = {
  // Stagger later blocks so a screen settles in top to bottom.
  delay?: number;
  style?: StyleProp<ViewStyle>;
  pointerEvents?: ViewProps['pointerEvents'];
  children: ReactNode;
};

const DURATION_MS = 450;
const RISE = 12;

// Screen entrance: fades in and drifts up 12pt when the screen opens. Runs on
// web too, where the navigator itself doesn't animate between screens.
export function FadeIn({ delay = 0, style, pointerEvents, children }: FadeInProps) {
  const reduceMotion = useReduceMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: DURATION_MS,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [delay, progress, reduceMotion]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [RISE, 0] });
  return (
    <Animated.View pointerEvents={pointerEvents} style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
