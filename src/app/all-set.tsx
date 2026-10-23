import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FavoriteIcon from '@assets/icons/favorite.svg';
import HelpIcon from '@assets/icons/help-outline.svg';
import InsightsIcon from '@assets/icons/insights.svg';
import { Artwork } from '@/components/Artwork';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/FadeIn';
import { InfoList } from '@/components/InfoList';
import { InlineButton } from '@/components/InlineButton';
import { useFirstName } from '@/state/profile';
import { colors, fonts } from '@/theme';

// Same statue as the splash, at 10% (Figma 54:4688). The dither isn't baked into
// this file, but it's barely visible at this opacity.
const statue = require('@assets/images/statue-faint.png');

// Figma: Onboarding / "complete" (54:4687)
export default function AllSetScreen() {
  const firstName = useFirstName();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[StyleSheet.absoluteFill, styles.statue]} pointerEvents="none">
        <Artwork source={statue} x={-141} y={-68} width={727} height={920} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <FadeIn style={styles.content}>
          <View style={styles.headline}>
            <Text style={[styles.title, styles.lead]}>You’re all set</Text>
            <Text style={styles.title}>{firstName ? `Welcome to LoopedIn, ${firstName}` : 'Welcome to LoopedIn'}</Text>
          </View>
          <Text style={styles.body}>Here’s what you can expect.</Text>
        </FadeIn>
        <FadeIn delay={90} style={styles.content}>
          <InfoList
            rows={[
              {
                label: 'Tomorrow',
                value: 'A quick question about you to fill your profile.',
                trailing: (
                  <Badge color={colors.accentRed}>
                    <HelpIcon width={14} height={14} />
                  </Badge>
                ),
              },
              {
                label: 'Add someone close to you',
                value: 'Invite people in your life onto LoopedIn and see how you two really work together.',
                trailing: (
                  <Badge color={colors.accentLime}>
                    <FavoriteIcon width={14} height={14} />
                  </Badge>
                ),
              },
              {
                label: 'Get insights',
                value: 'Get insights into yourself, and how you and the people close to you work together.',
                trailing: (
                  <Badge color={colors.accentBlue}>
                    <InsightsIcon width={14} height={14} />
                  </Badge>
                ),
              },
            ]}
          />
        </FadeIn>

        <FadeIn delay={180} style={styles.actions}>
          <Button label="Add someone" onPress={() => router.replace('/home?invite=1')} />
          <InlineButton prompt="Not ready yet?" action="I’ll do this later" onPress={() => router.replace('/home')} />
        </FadeIn>
      </ScrollView>
    </View>
  );
}

// 24pt round badge with a black outline holding a 14pt icon.
function Badge({ color, children }: { color: string; children: ReactNode }) {
  return <View style={[styles.badge, { backgroundColor: color }]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  statue: { opacity: 0.1 },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 118,
    paddingBottom: 33,
    gap: 24,
  },
  content: { width: '100%', maxWidth: 361, gap: 24 },
  headline: { gap: 8 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    color: colors.black1000,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  lead: { color: colors.accentLimeText },
  body: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: -0.48,
    color: colors.black600,
    textAlign: 'center',
  },
  // Pushed to the bottom of the screen, 33pt from the edge, like onboarding's actions.
  actions: { width: '100%', maxWidth: 361, marginTop: 'auto', paddingTop: 32, alignItems: 'center', gap: 16 },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.black1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
