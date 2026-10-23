import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ExpandMore from '@assets/icons/expand-more.svg';
import { Badge } from '@/components/Badge';
import type { Comparison } from '@/components/people/insights';
import { colors, fonts } from '@/theme';

// Figma component "Cards" (118:1841): you vs them, tap the header to show "Together".
export function ComparisonCard({ comparison }: { comparison: Comparison }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        aria-expanded={expanded}
        onPress={() => setExpanded((open) => !open)}
        style={styles.header}
      >
        <Text style={styles.title}>{comparison.title}</Text>
        <View style={styles.disclosure}>
          <Text style={styles.category}>{comparison.category}</Text>
          <View style={expanded && styles.flipped}>
            <ExpandMore width={16} height={16} />
          </View>
        </View>
      </Pressable>

      <View style={[styles.section, styles.comparison]}>
        <Row label="YOU" value={comparison.you} background={colors.accentPurple} color={colors.white} />
        <Row label="THEM" value={comparison.them} background={colors.accentLime} />
      </View>

      {expanded && (
        <View style={[styles.section, styles.together]}>
          <Text style={styles.togetherHeading}>TOGETHER</Text>
          <Text style={styles.togetherBody}>{comparison.together}</Text>
        </View>
      )}
    </View>
  );
}

function Row({ label, value, background, color }: { label: string; value: string; background: string; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowValue}>
        <Badge label={value} background={background} color={color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignSelf: 'stretch' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  title: { flex: 1, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36, color: colors.black1000 },
  disclosure: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  category: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36, color: colors.black1000, opacity: 0.8 },
  flipped: { transform: [{ scaleY: -1 }] },
  // Body sections hang off the header, so they skip the top border.
  section: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  comparison: { padding: 12, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rowLabel: { fontFamily: fonts.sansSemiBold, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
  rowValue: { maxWidth: 228 },
  together: { padding: 16, gap: 8 },
  togetherHeading: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36, color: colors.black1000 },
  togetherBody: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
});
