import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { colors, fonts } from '@/theme';

type CheckInCardProps = {
  mood: string;
  // Optional quote under the mood.
  note?: string;
  sharedAgo: string;
  tryThis: string;
  // Blue for a connection's check-in; purple for your own on Home.
  tone: 'blue' | 'purple';
};

// Figma "checkInCard" (149:568), Shared state: mood, quote and a suggested action.
export function CheckInCard({ mood, note, sharedAgo, tryThis, tone }: CheckInCardProps) {
  const purple = tone === 'purple';
  const accent = purple ? colors.accentPurple : colors.accentBlue;
  const onAccent = purple ? colors.white : colors.black1000;
  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Badge label="✨ TODAY’S INSIGHT" background={accent} color={onAccent} />
        <View style={styles.mood}>
          <Text style={styles.title}>{mood}</Text>
          {note ? <Text style={[styles.body, styles.centred]}>{note}</Text> : null}
        </View>
        <Text style={styles.sharedAgo}>{sharedAgo}</Text>
      </View>
      <View style={[styles.tryThis, { backgroundColor: accent }]}>
        <Text style={[styles.tryThisLabel, { color: onAccent }]}>💡 TRY THIS</Text>
        <Text style={[styles.body, { color: purple ? colors.white : colors.black800 }]}>{tryThis}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  card: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  mood: { alignSelf: 'stretch', gap: 8 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.72,
    color: colors.black1000,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  body: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
  centred: { textAlign: 'center' },
  sharedAgo: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36, color: colors.black600 },
  tryThis: { gap: 8, padding: 16, borderWidth: 1, borderTopWidth: 0, borderColor: colors.black1000 },
  tryThisLabel: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36 },
});
