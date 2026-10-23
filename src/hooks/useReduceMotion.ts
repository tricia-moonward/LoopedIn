import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// True when the person has turned on "Reduce Motion" (iOS/Android) or prefers-reduced-motion (web).
export function useReduceMotion() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setEnabled);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setEnabled);
    return () => sub.remove();
  }, []);
  return enabled;
}
