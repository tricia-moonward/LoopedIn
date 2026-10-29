import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ExpandMore from '@assets/icons/expand-more.svg';
import type { ProfileSection } from '@/components/you/profile';
import { colors, fonts } from '@/theme';

type ProfileCardProps = {
  section: ProfileSection;
  defaultOpen?: boolean;
};

// You tab "Comparison Card" (Figma 187:5630): your results as coloured badges; tap the
// header to read what they mean.
export function ProfileCard({ section, defaultOpen = false }: ProfileCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        aria-expanded={open}
        onPress={() => setOpen((value) => !value)}
        style={styles.header}
      >
        <Text style={styles.title}>{section.title}</Text>
        <View style={open && styles.flipped}>
          <ExpandMore width={16} height={16} />
        </View>
      </Pressable>

      <View style={styles.section}>
        {section.rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.label}>{row.label}</Text>
            <View style={[styles.badge, { backgroundColor: row.background }]}>
              <Text style={[styles.badgeText, { color: row.color }]} numberOfLines={1}>
                {row.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {open && (
        <View style={[styles.section, styles.about]}>
          {section.about.map((paragraph) => (
            <Text key={paragraph} style={styles.aboutText}>
              {paragraph}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderWidth: 1,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  title: { flex: 1, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36, color: colors.black1000 },
  flipped: { transform: [{ scaleY: -1 }] },
  section: {
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  label: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36, color: colors.black1000 },
  // Long values are cut short ("SECURE, REASSURANCE...") at 165 wide, as in the design.
  badge: {
    maxWidth: 165,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.black1000,
  },
  badgeText: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36 },
  // Paragraphs a blank line apart.
  about: { gap: 18 },
  aboutText: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
});
