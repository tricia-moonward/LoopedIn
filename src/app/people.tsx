import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ArrowForward from '@assets/icons/arrow-forward.svg';
import ChevronRight from '@assets/icons/chevron-right.svg';
import PersonDark from '@assets/icons/person-dark.svg';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/FadeIn';
import { NavBar, type NavTab } from '@/components/NavBar';
import { InviteSheet } from '@/components/sheets/InviteSheet';
import { useConnections } from '@/state/connections';
import { CONNECTION_TYPES, useInviteRequests } from '@/state/invites';
import { colors, fonts, useDesignScale } from '@/theme';

// The header hands have a dither + bloom effect in Figma that can't run in React Native,
// so this is the plain photo at 30%. Swap in a baked export to match exactly.
const hands = require('@assets/images/hands-reaching.png');
const paper = require('@assets/images/paper-texture.png');
const tornPaper = require('@assets/images/torn-paper.png');
const orchid = require('@assets/images/orchid-blue.png');

// Figma lays the page out under a 59-tall status bar. Where the real inset is shorter
// (web, older phones) the whole page moves up by the difference so there's no gap.
const FIGMA_STATUS_BAR = 59;

// "Your core read" copy from the design; not yet generated from quiz answers.
const CORE_READ = [
  {
    label: '✨ ABOUT YOU',
    background: colors.accentBlue,
    color: colors.black1000,
    paragraphs: [
      'You feel closest when things are said out loud and dealt with straight away. You get your energy from people, and you need to be able to trust them.',
    ],
  },
  {
    label: '✨ YOUR ROMANTIC PARTNERS',
    background: colors.accentRed,
    color: colors.white,
    paragraphs: [
      'You work best with a partner who says how they feel, shows you off, and talks things through the same day.',
      'You might struggle with a partner who needs space in conflict. Agree on a time to come back to it if conflict arises.',
      'Watch out for a tendency to give love the way you like to receive it. Quiet acts of care may not register with you.',
    ],
  },
  {
    label: '👯 YOUR FRIENDSHIPS',
    background: colors.accentPurple,
    color: colors.white,
    paragraphs: [
      'You get along best with people who are social and expressive and see you in person.',
      'You might struggle with friendships that exists online only.',
      'Watch out for small broken promises as these tend to hit you harder than most.',
    ],
  },
];

// Figma: People / "people" (102:3213)
export default function PeopleScreen() {
  const { scale } = useDesignScale();
  const connections = useConnections();
  const pendingRequests = useInviteRequests().length;
  const [inviting, setInviting] = useState(false);
  const lift = Math.max(0, FIGMA_STATUS_BAR - useSafeAreaInsets().top);

  const onTab = (tab: NavTab) => {
    if (tab === 'home') router.replace('/home');
    if (tab === 'you') router.replace('/you');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: 155 - lift }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sky-blue header with the reaching hands, rotated -30° at 30%. */}
        <View style={[styles.header, { top: -lift, left: -6 * scale, width: 404 * scale, height: 287 * scale }]}>
          <LinearGradient
            colors={['rgba(120,203,255,0.9)', 'rgba(255,255,255,0.9)']}
            locations={[0.41143, 0.99977]}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.centred,
              { left: -120 * scale, top: -116 * scale, width: 600.735 * scale, height: 531.569 * scale },
            ]}
          >
            <View
              style={{
                width: 508.935 * scale,
                height: 319.969 * scale,
                overflow: 'hidden',
                opacity: 0.3,
                transform: [{ rotate: '-30deg' }],
              }}
            >
              <Image source={hands} contentFit="cover" style={{ width: '100%', height: '198.82%' }} />
            </View>
          </View>
        </View>
        <Image
          source={paper}
          contentFit="cover"
          style={[
            styles.paper,
            { left: -337 * scale, top: -30 * scale - lift, width: 1134 * scale, height: 1680 * scale },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.centred,
            { left: -175.74 * scale, top: 99.22 * scale - lift, width: 727.3 * scale, height: 509.157 * scale },
          ]}
        >
          <Image
            source={tornPaper}
            contentFit="cover"
            style={{ width: 372.168 * scale, height: 661.395 * scale, transform: [{ rotate: '77.23deg' }] }}
          />
        </View>

        <FadeIn style={[styles.titleRow, { top: 91 - lift }]}>
          <Text style={styles.pageTitle}>People</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Invite requests${pendingRequests ? `, ${pendingRequests} pending` : ''}`}
            onPress={() => router.push('/invites')}
            hitSlop={12}
          >
            <PersonDark width={24} height={24} />
            {pendingRequests > 0 && (
              <View style={styles.countDot}>
                <Text style={styles.countText}>{pendingRequests}</Text>
              </View>
            )}
          </Pressable>
        </FadeIn>

        <FadeIn delay={90} style={styles.sections}>
          <View style={styles.inviteCard}>
            <View style={styles.inviteHeading}>
              <Text style={styles.cardTitle}>Is Someone On Your Mind?</Text>
              <Badge label="❤️  INVITE SOMEONE" background={colors.accentBlue} />
            </View>
            <Text style={styles.cardBody}>Invite someone and see how you two really work together.</Text>
            <Button
              label="Invite someone"
              trailingIcon={<ArrowForward width={16} height={16} />}
              onPress={() => setInviting(true)}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.column}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Your Connections</Text>
                <Text style={styles.sectionCount}>{connections.length}</Text>
              </View>
              {/* TODO: full connections list once it's designed. */}
              <Text style={styles.viewAll}>View all</Text>
            </View>
            <View style={styles.connections}>
              {connections.map((connection) => {
                const type = CONNECTION_TYPES.find((option) => option.key === connection.type)!;
                return (
                  <Pressable
                    key={connection.id}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${connection.name}`}
                    onPress={() => router.push(`/connection/${connection.id}`)}
                    style={({ pressed }) => [styles.connectionRow, pressed && styles.pressed]}
                  >
                    <View style={styles.person}>
                      <Avatar name={connection.name} size={32} tone="dark" />
                      <View style={styles.personText}>
                        <Text style={styles.personName}>{connection.name}</Text>
                        <View style={styles.tag}>
                          <Badge
                            label={`${type.emoji}  ${type.name.toUpperCase()}`}
                            background={type.background}
                            color={type.color}
                            size="small"
                          />
                        </View>
                      </View>
                    </View>
                    <ChevronRight width={16} height={16} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.column}>
            <View style={styles.coreRead}>
              <Text style={styles.cardTitle}>Your Core Read</Text>
              {CORE_READ.map((block) => (
                <View key={block.label} style={styles.block}>
                  <View style={[styles.blockHeader, { backgroundColor: block.background }]}>
                    <Text style={[styles.blockLabel, { color: block.color }]}>{block.label}</Text>
                  </View>
                  <View style={styles.blockBody}>
                    {block.paragraphs.map((paragraph) => (
                      <Text key={paragraph} style={styles.blockText}>
                        {paragraph}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.orchidSlot} pointerEvents="none">
              <Image source={orchid} contentFit="contain" style={styles.orchid} />
            </View>
          </View>
        </FadeIn>
      </ScrollView>

      <NavBar active="people" onSelect={onTab} />
      <InviteSheet visible={inviting} onClose={() => setInviting(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  // Clips the oversized background art so it can't add scrollable space.
  content: { paddingBottom: 80, overflow: 'hidden' },
  header: { position: 'absolute', overflow: 'hidden', backgroundColor: colors.white },
  centred: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  paper: { position: 'absolute', opacity: 0.4, mixBlendMode: 'multiply' },
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
    color: colors.black1000,
  },
  // Pending-request count on the person icon (Figma "Frame 145").
  countDot: {
    position: 'absolute',
    left: 13,
    top: 0.25,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontFamily: fonts.serif, fontSize: 6, lineHeight: 6, color: colors.black1000 },
  sections: { alignItems: 'center', gap: 32 },
  // Full width with a 16pt gutter each side, like the column below.
  inviteCard: {
    alignSelf: 'stretch',
    marginHorizontal: 16,
    padding: 16,
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  inviteHeading: { alignSelf: 'stretch', alignItems: 'center', gap: 16 },
  cardTitle: {
    alignSelf: 'stretch',
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.72,
    color: colors.black1000,
    textAlign: 'center',
  },
  cardBody: {
    alignSelf: 'stretch',
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black800,
  },
  divider: { alignSelf: 'stretch', height: 1, backgroundColor: colors.black1000 },
  column: { alignSelf: 'stretch', marginHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 24, letterSpacing: -0.72, color: colors.black1000 },
  sectionCount: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.54,
    color: colors.black1000,
    opacity: 0.4,
  },
  viewAll: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black800,
    textDecorationLine: 'underline',
  },
  connections: { marginTop: 24, gap: 24 },
  connectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pressed: { opacity: 0.7 },
  person: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  personText: { gap: 12 },
  personName: { fontFamily: fonts.serif, fontSize: 16, lineHeight: 16, letterSpacing: -0.48, color: colors.black1000 },
  // Row so the badge hugs its label instead of centring under the name.
  tag: { flexDirection: 'row' },
  coreRead: {
    marginTop: 62,
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 24,
    borderWidth: 1,
    borderColor: colors.accentBlue,
  },
  orchidSlot: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  orchid: { width: 132, height: 123 },
  block: { alignSelf: 'stretch' },
  blockHeader: { padding: 8, borderWidth: 1, borderColor: colors.black1000 },
  blockLabel: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36 },
  blockBody: {
    padding: 12,
    gap: 17,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  blockText: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
});
