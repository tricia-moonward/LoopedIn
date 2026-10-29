import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Add from '@assets/icons/add.svg';
import { Avatar } from '@/components/Avatar';
import { colors, fonts } from '@/theme';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  // Shows their initial ahead of the name ("Who are you with?" connections).
  person?: boolean;
};

// Figma "Option" (check-in pick-any chips): faint outline at rest, black fill when picked.
export function Chip({ label, selected, onPress, person }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      // Without this the avatar's initial is read out too ("S Sam").
      accessibilityLabel={label}
      aria-checked={selected}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        person && styles.personChip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {person && <Avatar name={label} size={24} tone={selected ? 'outlined' : 'dark'} />}
      <Text style={[styles.label, person && styles.personLabel, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

// The "+" chip at the end of each group. Opens a field for their own option.
export function AddChip({ onAdd }: { onAdd: (label: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');

  const finish = () => {
    if (text.trim()) onAdd(text.trim());
    setText('');
    setAdding(false);
  };

  if (adding) {
    return (
      <TextInput
        autoFocus
        value={text}
        onChangeText={setText}
        onSubmitEditing={finish}
        onBlur={finish}
        returnKeyType="done"
        placeholder="Add your own"
        placeholderTextColor={colors.black600}
        style={[styles.chip, styles.input]}
      />
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add your own"
      onPress={() => setAdding(true)}
      style={({ pressed }) => [styles.chip, styles.add, pressed && styles.pressed]}
    >
      <Add width={16} height={16} />
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', rowGap: 8, columnGap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: colors.black100,
  },
  personChip: { paddingLeft: 8, paddingVertical: 8 },
  selected: { backgroundColor: colors.black1000 },
  pressed: { opacity: 0.8 },
  label: { fontFamily: fonts.sansSemiBold, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
  personLabel: { color: colors.black1000 },
  selectedLabel: { color: colors.white },
  add: { width: 44, height: 40, justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  input: {
    minWidth: 140,
    height: 40,
    paddingVertical: 0,
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black1000,
    borderColor: colors.black800,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
});
