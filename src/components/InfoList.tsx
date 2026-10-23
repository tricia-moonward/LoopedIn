import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

export type InfoRow = {
  label: string;
  value: string;
  // Tag or icon badge on the right.
  trailing?: ReactNode;
};

// Bordered list of label/value rows (Figma 53:4521 "About You", 54:4921 "You're all set").
export function InfoList({ rows }: { rows: InfoRow[] }) {
  return (
    <View style={styles.list}>
      {rows.map((row, i) => (
        <View key={row.label} style={[styles.row, i < rows.length - 1 && styles.divider]}>
          <View style={styles.text}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
          {row.trailing}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { borderWidth: 1, borderColor: colors.black200 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.black200 },
  text: { flex: 1, gap: 8 },
  label: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    letterSpacing: -0.36,
    color: colors.black800,
    textTransform: 'uppercase',
  },
  value: { fontFamily: fonts.sansSemiBold, fontSize: 16, letterSpacing: -0.48, color: colors.black1000 },
});
