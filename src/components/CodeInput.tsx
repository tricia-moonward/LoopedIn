import { useRef } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { TextField } from '@/components/TextField';

type CodeInputProps = {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
};

// Six equal boxes, 4pt apart (Figma 49:1514). Typing moves to the next box,
// backspace on an empty box moves back, and pasting or SMS autofill of the
// whole code fills every box at once.
export function CodeInput({ length = 6, value, onChange, onComplete }: CodeInputProps) {
  const inputs = useRef<(TextInputInstance | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setFrom = (index: number, text: string) => {
    const typed = text.replace(/\D/g, '');
    // Keep what's before this box, write the typed digits from here on.
    const next = (value.slice(0, index) + typed).slice(0, length);
    onChange(next);
    const focusAt = Math.min(next.length, length - 1);
    if (typed) inputs.current[focusAt]?.focus();
    if (next.length === length) onComplete?.(next);
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, i) => (
        <TextField
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={digit}
          onChangeText={(text) => setFrom(i, digit ? text.replace(digit, '') || text : text)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !digit && i > 0) {
              onChange(value.slice(0, i - 1));
              inputs.current[i - 1]?.focus();
            }
          }}
          placeholder="X"
          keyboardType="number-pad"
          textContentType={i === 0 ? 'oneTimeCode' : 'none'}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoFocus={i === 0}
          selectTextOnFocus
          accessibilityLabel={`Digit ${i + 1} of ${length}`}
          style={styles.box}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  box: { flex: 1, minWidth: 0, textAlign: 'center' },
});
