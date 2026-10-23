import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, type TextInputInstance, type TextInputProps } from 'react-native';

import { colors, fonts } from '@/theme';

type TextFieldProps = TextInputProps & {
  // Red border and tint, for a value that needs fixing.
  error?: boolean;
};

// Figma components "textField" (49:806) and "textArea" (49:835): white box, 4pt radius.
// States: default (10% border), focus (80% border), error (red border, 10% red fill),
// disabled (20% border at 40% opacity). Typed text is bold; placeholders stay medium.
export const TextField = forwardRef<TextInputInstance, TextFieldProps>(function TextField(
  { style, error, onFocus, onBlur, onChangeText, multiline, ...props },
  ref,
) {
  // On web, autoFocus can fire before onFocus is wired up, so start focused if asked to.
  const [focused, setFocused] = useState(!!props.autoFocus);
  // Tracks uncontrolled fields; controlled ones use `value`.
  const [typed, setTyped] = useState(props.defaultValue ?? '');
  const filled = (props.value ?? typed).length > 0;
  const disabled = props.editable === false;

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={colors.black600}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : undefined}
      aria-invalid={error || undefined}
      {...props}
      onChangeText={(text) => {
        setTyped(text);
        onChangeText?.(text);
      }}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={[
        styles.input,
        filled && styles.filled,
        multiline && styles.area,
        focused && styles.focused,
        error && styles.error,
        disabled && styles.disabled,
        style,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black1000,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black100,
    borderRadius: 4,
    padding: 12,
    // Web: drop the browser's own focus ring; the border change below is the focus state.
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  filled: { fontFamily: fonts.sansBold },
  area: { height: 80, padding: 8 },
  focused: { borderColor: colors.black800 },
  error: { borderColor: colors.accentRed, backgroundColor: colors.errorFill },
  disabled: { borderColor: colors.black200, opacity: 0.4 },
});
