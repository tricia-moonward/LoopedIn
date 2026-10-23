import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import RadioOff from '@assets/icons/radio-off.svg';
import RadioOn from '@assets/icons/radio-on.svg';
import { colors, fonts } from '@/theme';

type SelectionCardProps = {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  // "radio" shows the radio button (single choice); "tile" is the plain multi-select tile.
  kind: 'radio' | 'tile';
  style?: StyleProp<ViewStyle>;
};

// Figma "selectionControls" (53:3189): 20% border at rest; selected gets a solid
// border, 10% fill and a bold title.
export function SelectionCard({ title, description, selected, onPress, kind, style }: SelectionCardProps) {
  const radio = kind === 'radio';
  return (
    <Pressable
      accessibilityRole={radio ? 'radio' : 'checkbox'}
      aria-checked={selected}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        radio ? styles.radioCard : styles.tileCard,
        selected && styles.selected,
        pressed && styles.pressed,
        style,
      ]}
    >
      {radio && (selected ? <RadioOn width={20} height={20} /> : <RadioOff width={20} height={20} />)}
      <View style={styles.details}>
        <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

type AddOwnCardProps = { label: string; onPress: () => void; children?: ReactNode };

// Dashed "Something else (Write your own)" card (Figma 53:3591).
export function AddOwnCard({ label, onPress, children }: AddOwnCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.addOwn}>
      {children}
      <Text style={styles.addOwnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.black200,
  },
  radioCard: { padding: 12 },
  tileCard: { padding: 16, height: 100 },
  selected: { borderColor: colors.black1000, backgroundColor: colors.black100 },
  pressed: { opacity: 0.8 },
  details: { flex: 1, gap: 4 },
  title: { fontFamily: fonts.sansSemiBold, fontSize: 16, letterSpacing: -0.48, color: colors.black800 },
  titleSelected: { fontFamily: fonts.sansBold, color: colors.charcoal100 },
  description: { fontFamily: fonts.sansRegular, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
  addOwn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.black200,
  },
  addOwnText: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 16, letterSpacing: -0.48, color: colors.black600 },
});
