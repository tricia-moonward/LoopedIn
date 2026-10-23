import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ArrowForward from '@assets/icons/arrow-forward.svg';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/FadeIn';
import { PaperBackground } from '@/components/PaperBackground';
import { colors, fonts } from '@/theme';

type IntroScreenProps = {
  // Gradient tint at the bottom of the paper background.
  tint: string;
  // Coloured first line of the headline, and its colour.
  lead: string;
  leadColor: string;
  title: string;
  body: string;
  // Decorative artwork, positioned in design coordinates.
  artwork: ReactNode;
  buttonLabel?: string;
  // Arrow after the label; on by default ("Let's go →").
  showArrow?: boolean;
  onContinue: () => void;
};

// Section intro (Figma "onboarding / 4", "/ 5" and "notification"): tinted paper, artwork, a centred
// two-colour headline and a "Let's go" button pinned near the bottom.
export function IntroScreen({
  tint,
  lead,
  leadColor,
  title,
  body,
  artwork,
  buttonLabel = "Let's go",
  showArrow = true,
  onContinue,
}: IntroScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <PaperBackground tint={tint} />
      <FadeIn style={StyleSheet.absoluteFill} pointerEvents="none">
        {artwork}
      </FadeIn>

      <View style={styles.center} pointerEvents="box-none">
        <FadeIn delay={90} style={styles.copy}>
          <View style={styles.headline}>
            <Text style={[styles.title, { color: leadColor }]}>{lead}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.body}>{body}</Text>
        </FadeIn>
      </View>

      <FadeIn delay={180} style={styles.actions}>
        <Button
          label={buttonLabel}
          trailingIcon={showArrow ? <ArrowForward width={16} height={16} /> : undefined}
          onPress={onContinue}
        />
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, overflow: 'hidden' },
  center: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  copy: { width: '100%', maxWidth: 361, gap: 24 },
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
  body: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: -0.48,
    color: colors.black600,
    textAlign: 'center',
  },
  actions: { position: 'absolute', left: 16, right: 16, bottom: 43, alignItems: 'center' },
});
