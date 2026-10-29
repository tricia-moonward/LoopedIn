import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SettingsIcon from '@assets/icons/settings.svg';
import TrendingUp from '@assets/icons/trending-up.svg';
import TrendingWhite from '@assets/icons/trending-white.svg';
import { Badge } from '@/components/Badge';
import { FadeIn } from '@/components/FadeIn';
import { NavBar, type NavTab } from '@/components/NavBar';
import { ProfileCard } from '@/components/you/ProfileCard';
import { PATTERNS, PROFILE_SECTIONS } from '@/components/you/profile';
import { colors, fonts, useDesignScale } from '@/theme';

// Dithered, red-tinted flower (a shader effect in Figma, exported flat as it renders).
const header = require('@assets/images/you-header.png');
const paper = require('@assets/images/paper-texture.png');
const tornPaper = require('@assets/images/torn-paper.png');
// Same file as Figma's "Illustration / Hand Mirror".
const handMirror = require('@assets/images/bulb.png');
const flower = require('@assets/images/flower-pink.png');

// Figma lays the page out under a 59-tall status bar; where the real inset is shorter the
// page moves up by the difference (as on People).
const FIGMA_STATUS_BAR = 59;
// Cards start at 155; the last card ends 86 above the navBar.
const CONTENT_TOP = 155;
const PAGE_BOTTOM_PADDING = 86;
// The emotions card sits 64 below "Your patterns", leaving room for the hand mirror.
const PATTERNS_GAP = 64;

// Figma: You / "You / Profile" (187:5059)
export default function YouScreen() {
  const { scale } = useDesignScale();
  const lift = Math.max(0, FIGMA_STATUS_BAR - useSafeAreaInsets().top);
  const mostFelt = Math.max(...PATTERNS.emotions.map((emotion) => emotion.count));

  const onTab = (tab: NavTab) => {
    if (tab === 'home') router.replace('/home');
    if (tab === 'people') router.replace('/people');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: CONTENT_TOP - lift }]}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={header}
          contentFit="cover"
          style={{ position: 'absolute', left: 0, top: -lift, width: 393 * scale, height: 355 * scale }}
        />
        {/* Torn edge under the header, flipped and rotated -75° as in Figma. */}
        <View
          pointerEvents="none"
          style={[
            styles.centred,
            { left: -187 * scale, top: 25 * scale - lift, width: 721.679 * scale, height: 523.47 * scale },
          ]}
        >
          <Image
            source={tornPaper}
            contentFit="cover"
            style={{
              width: 364.742 * scale,
              height: 648.198 * scale,
              transform: [{ rotate: '-74.63deg' }, { scaleY: -1 }],
            }}
          />
        </View>
        <Image
          source={paper}
          contentFit="cover"
          style={[
            styles.paper,
            { left: -337 * scale, top: -30 * scale - lift, width: 1134 * scale, height: 2037 * scale },
          ]}
        />

        <FadeIn style={[styles.titleRow, { top: 91 - lift }]}>
          <Text style={styles.pageTitle}>You</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            hitSlop={12}
            onPress={() => router.push('/settings')}
          >
            <SettingsIcon width={24} height={24} />
          </Pressable>
        </FadeIn>

        <FadeIn delay={90} style={styles.cards}>
          {PROFILE_SECTIONS.map((section, index) => (
            <ProfileCard key={section.title} section={section} defaultOpen={index === 0} />
          ))}
        </FadeIn>

        <View style={styles.rule} />

        <View style={styles.intro}>
          <Text style={styles.sectionTitle}>Your patterns</Text>
          <Text style={styles.sectionBody}>What tends to lift or lower your mood, from your check-ins.</Text>
        </View>

        <View style={styles.patterns}>
          {/* Hand mirror peeking over the card's top-left corner, and a flower off the right edge. */}
          <Image
            source={handMirror}
            contentFit="contain"
            style={[styles.decor, { left: -26, top: -60, width: 71.805, height: 98.324 }]}
          />

          <View style={styles.emotions}>
            <View style={styles.emotionsHeader}>
              <Text style={styles.emotionsTitle}>THE EMOTIONS YOU FELT MOST</Text>
              <Text style={styles.period}>Last 30 Days</Text>
            </View>
            <View style={styles.bars}>
              {PATTERNS.emotions.map((emotion) => (
                <View key={emotion.label} style={styles.barRow}>
                  <Text style={styles.barLabel}>{emotion.label}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        { width: `${(emotion.count / mostFelt) * 100}%`, backgroundColor: emotion.background },
                      ]}
                    >
                      <Text style={[styles.barCount, { color: emotion.color }]}>{emotion.count}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.panel, styles.trends]}>
            <View style={styles.trendGroup}>
              <Text style={styles.caption}>Your trends:</Text>
              <Text style={styles.trendText}>{PATTERNS.trend}</Text>
            </View>
            <View style={styles.trendGroup}>
              <Text style={styles.caption}>Most logged:</Text>
              <View style={styles.tags}>
                {PATTERNS.mostLogged.map((tag) => (
                  <Badge key={tag} label={tag} background={colors.white} size="small" align="start" />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.panel, styles.insights]}>
            {PATTERNS.insights.map((insight, index) => {
              const up = insight.direction === 'up';
              return (
                <View key={insight.title} style={[styles.insight, index === 0 && styles.insightRuled]}>
                  <View style={[styles.trendIcon, { backgroundColor: up ? colors.accentLime : colors.accentRed }]}>
                    {up ? (
                      <TrendingUp width={12} height={12} />
                    ) : (
                      <View style={styles.pointDown}>
                        <TrendingWhite width={12} height={12} />
                      </View>
                    )}
                  </View>
                  <View style={styles.insightText}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <Text style={styles.insightBody}>{insight.body}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Image
            source={flower}
            contentFit="contain"
            style={[styles.decor, { left: 311 * scale, top: 113, width: 78, height: 79 }]}
          />
        </View>
      </ScrollView>

      <NavBar active="you" onSelect={onTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  // Clips the oversized background art so it can't add scrollable space.
  content: { paddingBottom: PAGE_BOTTOM_PADDING, overflow: 'hidden' },
  centred: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  paper: { position: 'absolute', opacity: 0.4, mixBlendMode: 'multiply' },
  decor: { position: 'absolute', zIndex: 1 },
  titleRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    color: colors.white,
    textTransform: 'capitalize',
  },
  cards: { marginHorizontal: 16, gap: 16 },
  rule: { height: 1, marginTop: 24, backgroundColor: colors.black1000 },
  intro: { marginTop: 24, marginHorizontal: 16, gap: 8 },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.72,
    color: colors.black1000,
    textTransform: 'capitalize',
  },
  sectionBody: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
  patterns: { marginTop: PATTERNS_GAP, marginHorizontal: 16 },
  emotions: { gap: 24, padding: 16, borderWidth: 1, borderColor: colors.black1000 },
  emotionsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emotionsTitle: { flex: 1, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36, color: colors.black1000 },
  period: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36, color: colors.black600 },
  bars: { gap: 14 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  barLabel: { width: 84, fontFamily: fonts.sansBold, fontSize: 16, letterSpacing: -0.48, color: colors.black1000 },
  barTrack: { flex: 1, alignItems: 'flex-start' },
  bar: { height: 20, minWidth: 32, justifyContent: 'center', paddingHorizontal: 8, borderWidth: 1, borderColor: '#000' },
  barCount: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42 },
  // Panels hang off the card above, sharing its bottom border.
  panel: { borderWidth: 1, borderTopWidth: 0, borderColor: colors.black1000 },
  trends: { gap: 16, padding: 16 },
  trendGroup: { gap: 8 },
  caption: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    letterSpacing: -0.36,
    color: colors.black800,
    textTransform: 'uppercase',
  },
  trendText: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  insights: { gap: 16, paddingVertical: 16 },
  insight: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingHorizontal: 16 },
  insightRuled: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.black1000 },
  trendIcon: { padding: 4, borderWidth: 1, borderColor: '#000' },
  // The red one points down: the same arrow turned 180°.
  pointDown: { transform: [{ rotate: '180deg' }] },
  insightText: { flex: 1, gap: 8 },
  insightTitle: { fontFamily: fonts.sansBold, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
  insightBody: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
});
