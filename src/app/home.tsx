import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ArrowForward from '@assets/icons/arrow-forward.svg';
import ArrowForwardDark from '@assets/icons/arrow-forward-dark.svg';
import { Artwork } from '@/components/Artwork';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/FadeIn';
import { NavBar, type NavTab } from '@/components/NavBar';
import { useProfile } from '@/components/profileQuiz/profiles';
import { HomeKeyDates } from '@/components/people/HomeKeyDates';
import { InviteSheet } from '@/components/sheets/InviteSheet';
import { useFirstName } from '@/state/profile';
import { colors, fonts, useDesignScale } from '@/theme';

// Flowers and statue are flat dithered exports from Figma; the header statue isn't
// dithered (same file as the "You're all set" background).
const statue = require('@assets/images/statue-faint.png');
const paper = require('@assets/images/paper-texture.png');
const tornPaper = require('@assets/images/torn-paper.png');
const lily = require('@assets/images/lily-small.png');
const orchid = require('@assets/images/orchid.png');
const statueDark = require('@assets/images/statue-dark.png');

// Figma frame is 1482 tall (1497 with a key date countdown); cards start at 221 and the
// page scrolls until the last card sits 39 above the 73-tall navBar.
const CARDS_TOP = 221;
const PAGE_BOTTOM_PADDING = 39;
const NAV_BAR_HEIGHT = 73;

// "Tuesday, 20 October"
function formatToday() {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-AU', { weekday: 'long' });
  const month = now.toLocaleDateString('en-AU', { month: 'long' });
  return `${weekday}, ${now.getDate()} ${month}`;
}

// Figma: Home / "Home" (68:1401)
export default function HomeScreen() {
  const { invite } = useLocalSearchParams<{ invite?: string }>();
  const firstName = useFirstName();
  const profile = useProfile();
  const { scale } = useDesignScale();
  const [inviting, setInviting] = useState(invite === '1');

  const onTab = (tab: NavTab) => {
    // The You tab isn't designed yet.
    if (tab === 'people') router.replace('/people');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        // Clip the oversized background art so it can't add scrollable space.
        contentContainerStyle={{ paddingTop: CARDS_TOP, paddingBottom: PAGE_BOTTOM_PADDING, overflow: 'hidden' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dark header with the statue at 50%. */}
        <View style={[styles.header, { left: -6 * scale, width: 404 * scale, height: 345 * scale }]}>
          <Image
            source={statue}
            contentFit="cover"
            style={{ position: 'absolute', top: -97 * scale, width: 401 * scale, height: 507 * scale, opacity: 0.5 }}
          />
        </View>
        <Image
          source={paper}
          contentFit="cover"
          style={[
            styles.paper,
            { left: -260 * scale, top: -30 * scale, width: 980 * scale, height: 1453 * scale },
          ]}
        />
        {/* Torn paper edge along the bottom of the header, rotated 72° as in Figma. */}
        <View
          pointerEvents="none"
          style={[
            styles.tornBox,
            { left: -184 * scale, top: 4 * scale, width: 743.816 * scale, height: 557.599 * scale },
          ]}
        >
          <Image
            source={tornPaper}
            contentFit="cover"
            style={{ width: 372.168 * scale, height: 661.395 * scale, transform: [{ rotate: '72.08deg' }] }}
          />
        </View>

        <FadeIn style={styles.greeting}>
          <Text style={styles.hello}>Hello, {firstName || 'there'}</Text>
          <Text style={styles.date}>{formatToday()}</Text>
        </FadeIn>

        <FadeIn delay={90} style={styles.cards}>
          <HomeKeyDates />

          <Card style={styles.checkInCard}>
            <CardHeading title="How are you feeling?">
              <Badge label="💭 DAILY CHECK IN" background={colors.accentLime} />
            </CardHeading>
            <Text style={styles.cardBody}>
              How you’re doing, what’s going on, and one quick question. The more you share, the better LoopedIn gets
              to know you.
            </Text>
            {/* TODO: daily check-in once it's designed in. */}
            <Button label="Start check-in" trailingIcon={<ArrowForward width={16} height={16} />} />
          </Card>

          <Divider />

          <Card style={{ borderColor: colors.accentRed }}>
            <CardHeading title="What we’ve learnt about you">
              <Badge label="✨ FROM YOUR PROFILE" background={colors.accentRed} color={colors.white} />
            </CardHeading>
            <Text style={styles.cardBody}>{profile.home}</Text>
          </Card>

          <Card style={{ borderColor: colors.accentPurple }}>
            <CardHeading title="Your mantra for today">
              <Badge label="😌 AFFIRMATIONS" background={colors.accentPurple} color={colors.white} />
            </CardHeading>
            <Text style={styles.cardBody}>
              You’re allowed to be celebrated. Enjoying recognition doesn’t make you needy. It’s how you know you
              belong.
            </Text>
          </Card>

          <Divider />

          <Card style={{ borderColor: colors.accentBlue }}>
            <CardHeading title="Is someone on your mind?">
              <Badge label="❤️  INVITE SOMEONE" background={colors.accentBlue} />
            </CardHeading>
            <Text style={styles.cardBody}>Invite someone and see how you two really work together.</Text>
            <Button
              label="Invite someone"
              variant="text"
              trailingIcon={<ArrowForwardDark width={16} height={16} />}
              onPress={() => setInviting(true)}
            />
          </Card>
        </FadeIn>

        {/* Decorative cut-outs, layered over the cards as in the design. */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Artwork source={lily} x={316} y={451} width={158} height={146} />
          <Artwork source={lily} x={-33} y={706} width={96} height={89} />
          <Artwork source={orchid} x={313} y={710} width={158} height={148} />
          <Artwork source={orchid} x={-44} y={1034} width={122} height={115} />
          {/* Sits on the bottom of the page, however tall the cards make it, running on
              behind the navBar as in Figma (clipped there). */}
          <Image
            source={statueDark}
            contentFit="contain"
            style={[
              styles.statueDark,
              { left: 90 * scale, bottom: -NAV_BAR_HEIGHT * scale, width: 223 * scale, height: 282 * scale },
            ]}
          />
        </View>
      </ScrollView>

      <NavBar active="home" onSelect={onTab} />
      <InviteSheet visible={inviting} onClose={() => setInviting(false)} />
    </View>
  );
}

function Card({ style, children }: { style?: object; children: ReactNode }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function CardHeading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.cardHeading}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

// Full-width 1pt rule between card groups (Figma "Vector 3").
function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { position: 'absolute', top: 0, backgroundColor: colors.black1000, overflow: 'hidden' },
  paper: { position: 'absolute', opacity: 0.4, mixBlendMode: 'multiply' },
  tornBox: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  greeting: { position: 'absolute', left: 16, top: 83, gap: 8 },
  hello: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    color: colors.white,
    textTransform: 'capitalize',
  },
  date: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.white },
  cards: { alignItems: 'center', gap: 32 },
  // Full width with a 16pt gutter each side.
  card: {
    alignSelf: 'stretch',
    marginHorizontal: 16,
    padding: 16,
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  checkInCard: { backgroundColor: colors.white, borderColor: colors.black1000 },
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
  divider: { alignSelf: 'stretch', height: 1, backgroundColor: colors.black1000 },
  statueDark: { position: 'absolute', opacity: 0.2 },
});
