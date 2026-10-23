import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Handle from '@assets/icons/handle.svg';
import { colors } from '@/theme';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

const SLIDE_MS = 280;

// Figma "overlay" sheets (81:2553 etc.): a white handle above a white panel with
// 24pt padding and 32pt gaps, sliding up over a dimmed screen. Tap outside to close.
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const offset = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    offset.setValue(1);
    Animated.timing(offset, {
      toValue: 0,
      duration: SLIDE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [visible, offset]);

  const translateY = offset.interpolate({ inputRange: [0, 1], outputRange: [0, 400] });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      {/* Lifts the sheet above the keyboard when it has text fields (e.g. New Key Date). */}
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <Handle width={49} height={5} />
          <View style={[styles.panel, { paddingBottom: 24 + insets.bottom }]}>{children}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { alignItems: 'center', gap: 14 },
  panel: { alignSelf: 'stretch', backgroundColor: colors.white, padding: 24, gap: 32, alignItems: 'center' },
});
