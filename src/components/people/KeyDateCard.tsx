import { Pressable, StyleSheet, Text, View } from 'react-native';

import EditIcon from '@assets/icons/edit.svg';
import { Avatar } from '@/components/Avatar';
import { daysUntil, formatKeyDate, type KeyDate } from '@/state/connections';
import { colors, fonts } from '@/theme';

type KeyDateCardProps = {
  keyDate: KeyDate;
  // Home shows who the date is with; the connection page doesn't need to.
  personName?: string;
  onEdit?: () => void;
};

// Days-to-go countdown beside the date's name (Figma 125:2533 on View Connection, 133:1579 on Home).
export function KeyDateCard({ keyDate, personName, onEdit }: KeyDateCardProps) {
  const days = daysUntil(keyDate.date);
  return (
    <View style={styles.card}>
      <View style={styles.countdown}>
        <Text style={styles.countdownNumber}>{days}</Text>
        <Text style={styles.countdownUnit}>{days === 1 ? 'Day' : 'Days'}</Text>
      </View>
      <View style={styles.text}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {keyDate.emoji} {keyDate.title}
          </Text>
          {personName && (
            <>
              <View style={styles.rule} />
              <View style={styles.person}>
                <Avatar name={personName} size={24} tone="dark" />
                <Text style={styles.personName}>{personName}</Text>
              </View>
            </>
          )}
        </View>
        <Text style={styles.date}>{formatKeyDate(keyDate.date)}</Text>
      </View>
      {onEdit && (
        <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${keyDate.title}`} onPress={onEdit} hitSlop={10}>
          <EditIcon width={24} height={24} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  countdown: {
    minWidth: 56,
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.black100,
  },
  countdownNumber: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 24, letterSpacing: -0.72, color: colors.black1000 },
  countdownUnit: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
  text: { flex: 1, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flexShrink: 1, fontFamily: fonts.sansBold, fontSize: 16, letterSpacing: -0.48, color: colors.black1000 },
  rule: { width: 1, height: 18, backgroundColor: colors.black100 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  personName: { fontFamily: fonts.serif, fontSize: 14, lineHeight: 14, letterSpacing: -0.42, color: colors.black1000 },
  date: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black600 },
});
