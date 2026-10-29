import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckCircle from '@assets/icons/check-circle.svg';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/FadeIn';
import { CheckInBackground } from '@/components/checkIn/CheckInBackground';
import { CheckInTopBar } from '@/components/checkIn/CheckInTopBar';
import { MOODS, suggestionFor, useTodayCheckIn } from '@/state/checkIn';
import { useFirstName } from '@/state/profile';
import { colors, fonts } from '@/theme';

const FIGMA_STATUS_BAR = 59;

// Figma: Check in / "check in / complete" (169:2191)
export default function CheckInCompleteScreen() {
  const checkIn = useTodayCheckIn();
  const firstName = useFirstName();
  const lift = Math.max(0, FIGMA_STATUS_BAR - useSafeAreaInsets().top);

  if (!checkIn) return <Redirect href="/home" />;
  const mood = MOODS[checkIn.mood];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: FIGMA_STATUS_BAR - lift }]}
        showsVerticalScrollIndicator={false}
      >
        <CheckInBackground lift={lift} paperHeight={1278} />

        <CheckInTopBar title="Daily Check-In" tone="light" onClose={() => router.replace('/home')} />

        <FadeIn style={styles.hero}>
          <CheckCircle width={56} height={56} />
          <Text style={styles.title}>You’re checked in</Text>
          <Text style={styles.subtitle}>
            That’s today done{firstName ? `, ${firstName}` : ''}. Here’s what came out of it.
          </Text>
          <Badge
            label={`${mood.emoji} FEELING ${mood.label.toUpperCase()}`}
            background={colors.white}
            size="small"
          />
        </FadeIn>

        <FadeIn delay={90} style={styles.card}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>For you today</Text>
            <Badge label="💡 FROM TODAY’S CHECK-IN" background={colors.accentPurple} color={colors.white} />
          </View>
          <Text style={styles.cardBody}>{suggestionFor(checkIn)}</Text>
        </FadeIn>

        <FadeIn delay={180} style={styles.actions}>
          <Button label="Back to home" onPress={() => router.replace('/home')} />
          <Text accessibilityRole="link" style={styles.edit} onPress={() => router.replace('/check-in')}>
            Edit today’s check-in
          </Text>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  // Actions sit 39 above the bottom of the frame; the page scrolls on shorter screens.
  content: { flexGrow: 1, paddingBottom: 39, overflow: 'hidden' },
  // Hero starts 32 below the top bar; the card 102 below the hero (on the torn paper).
  hero: { marginTop: 32, marginHorizontal: 16, alignItems: 'center', gap: 16 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    color: colors.white,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  subtitle: {
    width: 300,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: -0.48,
    color: colors.white,
    textAlign: 'center',
  },
  card: {
    marginTop: 102,
    marginHorizontal: 16,
    padding: 16,
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accentPurple,
  },
  cardHeading: { alignSelf: 'stretch', alignItems: 'center', gap: 16 },
  cardTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.72,
    color: colors.black1000,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  cardBody: {
    alignSelf: 'stretch',
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black800,
  },
  actions: { marginTop: 'auto', paddingTop: 32, marginHorizontal: 16, alignItems: 'center', gap: 16 },
  edit: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black1000,
    textDecorationLine: 'underline',
  },
});
