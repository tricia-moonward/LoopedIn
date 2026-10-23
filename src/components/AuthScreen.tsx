import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import ArrowBack from '@assets/icons/arrow-back.svg';
import { FadeIn } from '@/components/FadeIn';
import { StatueBackground } from '@/components/StatueBackground';
import { colors, fonts } from '@/theme';

type AuthScreenProps = {
  title?: string;
  subtitle?: string;
  // Small line above the title (e.g. "Question 1 of 8").
  eyebrow?: string;
  // Replaces the eyebrow/title/subtitle block entirely when a screen needs its own heading.
  heading?: ReactNode;
  showBack?: boolean;
  // Tighter layout for long screens (Figma "goals"): starts at y=112 with 20pt gaps.
  compact?: boolean;
  // Shows "Skip" top-right (profile questions) and runs this when tapped.
  onSkip?: () => void;
  // Pinned to the bottom of the screen (e.g. legal copy).
  footer?: ReactNode;
  children: ReactNode;
};

// Delay between the heading, the body and the footer settling in.
const STAGGER_MS = 90;

// Shared layout for the sign-up flow (Figma "sign up", "code", "name"): statue
// background, optional back arrow at 16/64, and a 361-wide column starting at y=126.
export function AuthScreen({
  title,
  subtitle,
  eyebrow,
  heading,
  showBack,
  compact,
  onSkip,
  footer,
  children,
}: AuthScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <StatueBackground />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, compact && styles.scrollCompact]}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={[styles.content, compact && styles.compactGap]}>
            <FadeIn style={styles.heading}>
              {heading ?? (
                <>
                  {eyebrow ? <Text style={styles.subtitle}>{eyebrow}</Text> : null}
                  {title ? <Text style={styles.title}>{title}</Text> : null}
                  {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </>
              )}
            </FadeIn>
            <FadeIn delay={STAGGER_MS} style={[styles.body, compact && styles.compactGap]}>
              {children}
            </FadeIn>
          </View>
          {footer ? (
            <FadeIn delay={STAGGER_MS * 2} style={styles.footer}>
              {footer}
            </FadeIn>
          ) : null}
          {/* Inside the scroll view so they scroll away with the content on long screens. */}
          {showBack && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={() => router.back()}
              hitSlop={12}
              style={styles.back}
            >
              <ArrowBack width={24} height={24} />
            </Pressable>
          )}
          {onSkip && (
            <Pressable accessibilityRole="button" onPress={onSkip} hitSlop={12} style={styles.skip}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// A button pinned to the bottom of an AuthScreen (pass as `footer`), 43pt from the bottom edge.
export function FooterAction({ children }: { children: ReactNode }) {
  return <View style={styles.footerAction}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 126,
    paddingBottom: 36,
    gap: 32,
  },
  scrollCompact: { paddingTop: 112 },
  content: { width: '100%', maxWidth: 361, gap: 32 },
  compactGap: { gap: 20 },
  heading: { alignItems: 'center', gap: 14 },
  body: { gap: 32 },
  footer: { width: '100%', alignItems: 'center' },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    color: colors.black1000,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  subtitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: -0.48,
    color: colors.black600,
    textAlign: 'center',
  },
  back: { position: 'absolute', left: 16, top: 64 },
  // Vertically centred on the back arrow (y = 76).
  skip: { position: 'absolute', right: 16, top: 64, height: 24, justifyContent: 'center' },
  skipText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black600,
    textDecorationLine: 'underline',
  },
  footerAction: { width: '100%', maxWidth: 361, marginBottom: 7 },
});
