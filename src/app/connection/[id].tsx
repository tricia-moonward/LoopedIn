import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import ArrowBack from '@assets/icons/arrow-back.svg';
import MoreHoriz from '@assets/icons/more-horiz.svg';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { CheckInCard } from '@/components/CheckInCard';
import { FadeIn } from '@/components/FadeIn';
import { ComparisonCard } from '@/components/people/ComparisonCard';
import { ConnectionChart } from '@/components/people/ConnectionChart';
import { KeyDateCard } from '@/components/people/KeyDateCard';
import { CONNECTION_TABS, TAB_CONTENT, type ConnectionTab } from '@/components/people/insights';
import { KeyDateSheet } from '@/components/sheets/KeyDateSheet';
import { PaperTexture } from '@/components/PaperTexture';
import { useConnection, type Connection, type KeyDate } from '@/state/connections';
import { CONNECTION_TYPES } from '@/state/invites';
import { colors, fonts, useDesignScale } from '@/theme';

const header = require('@assets/images/connection-header.webp');
const statueDark = require('@assets/images/statue-dark.png');
const tornPaper = require('@assets/images/torn-paper.png');
const lily = require('@assets/images/lily-small.png');

// Figma: People / "view connection / people" — Overview (106:3649, 125:2450), Love (112:4004),
// Communication (125:1353), Conflict (125:1620).
export default function ConnectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const connection = useConnection(id);
  const { scale } = useDesignScale();
  const [tab, setTab] = useState<ConnectionTab>('overview');
  // undefined = closed, null = new date, KeyDate = editing that date.
  const [keyDateSheet, setKeyDateSheet] = useState<KeyDate | null | undefined>(undefined);

  if (!connection) return <Redirect href="/people" />;
  const type = CONNECTION_TYPES.find((option) => option.key === connection.type)!;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Faded sky and statue behind the name, exported from Figma at its 40% and cropped to
            what shows on screen. */}
        <Image
          source={header}
          contentFit="cover"
          style={{ position: 'absolute', left: 0, top: 0, width: 393 * scale, height: 391 * scale }}
        />
        <PaperTexture />
        <View
          pointerEvents="none"
          style={[styles.centred, { left: -94 * scale, top: 169 * scale, width: 581.191 * scale, height: 406.871 * scale }]}
        >
          <Image
            source={tornPaper}
            contentFit="cover"
            style={{ width: 297.402 * scale, height: 528.526 * scale, transform: [{ rotate: '77.23deg' }] }}
          />
        </View>

        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} hitSlop={12}>
            <ArrowBack width={24} height={24} />
          </Pressable>
          <Text style={styles.topBarTitle}>View Connection</Text>
          {/* TODO: connection options menu once it's designed. */}
          <MoreHoriz width={24} height={24} />
        </View>
        <View style={styles.topRule} />

        <FadeIn style={styles.intro}>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{connection.name}</Text>
            <Badge label={`${type.emoji}  ${type.name.toUpperCase()}`} background={colors.white} size="small" />
          </View>
          <ConnectionCheckIn connection={connection} />
        </FadeIn>

        <View style={styles.tabs}>
          <View style={styles.rule} />
          <View style={styles.tabRow} accessibilityRole="tablist">
            {CONNECTION_TABS.map((option) => {
              const active = option.key === tab;
              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="tab"
                  aria-selected={active}
                  onPress={() => setTab(option.key)}
                  hitSlop={{ top: 16, bottom: 16, left: 8, right: 8 }}
                >
                  <Text style={[styles.tabText, active && styles.tabActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.rule} />
        </View>

        <FadeIn key={tab} style={styles.tabContent}>
          {tab === 'overview' ? (
            <>
              <View style={[styles.card, { borderColor: type.background }]}>
                <View style={styles.cardHeading}>
                  <Text style={styles.cardTitle}>{connection.insight.title}</Text>
                  <Badge label={`${type.emoji} YOUR CONNECTION`} background={type.background} color={type.color} />
                </View>
                <Text style={styles.cardBody}>{connection.insight.body}</Text>
                <Text style={styles.basis}>{connection.insight.basis}</Text>
              </View>

              {connection.chart && (
                <View style={styles.decorWrap}>
                  {/* Lily behind the left edge and a faint statue by the top right (Figma 170:4369). */}
                  <View pointerEvents="none" style={[styles.decor, { left: -72 * scale, top: 65 }]}>
                    <Image source={lily} contentFit="contain" style={{ width: 158 * scale, height: 146 * scale }} />
                  </View>
                  <View pointerEvents="none" style={[styles.decor, { left: 279 * scale, top: 5 }]}>
                    <View style={[styles.centred, { position: 'relative', width: 187.06 * scale, height: 207.874 * scale }]}>
                      <Image
                        source={statueDark}
                        contentFit="cover"
                        style={{ width: 135 * scale, height: 171 * scale, opacity: 0.2, transform: [{ rotate: '-20.87deg' }] }}
                      />
                    </View>
                  </View>
                  <View style={styles.chartColumn}>
                    <ConnectionChart chart={connection.chart} name={connection.name.split(' ')[0]} />
                  </View>
                </View>
              )}

              <View style={styles.keyDatesWrap}>
                <View pointerEvents="none" style={[styles.decor, { left: 279 * scale, top: 3 }]}>
                  <View style={[styles.centred, { position: 'relative', width: 187.06 * scale, height: 207.874 * scale }]}>
                    <Image
                      source={statueDark}
                      contentFit="cover"
                      style={{ width: 135 * scale, height: 171 * scale, opacity: 0.2, transform: [{ rotate: '-20.87deg' }] }}
                    />
                  </View>
                </View>
                <View style={[styles.card, { borderColor: colors.black1000 }]}>
                  <View style={styles.keyDatesHeading}>
                    <Text style={styles.cardTitle}>Key Dates</Text>
                    <Text style={[styles.cardBody, styles.centredText]}>
                      Add in dates that are important to your relationship.
                    </Text>
                  </View>
                  {connection.keyDates.map((keyDate) => (
                    <KeyDateCard key={keyDate.id} keyDate={keyDate} onEdit={() => setKeyDateSheet(keyDate)} />
                  ))}
                  <Button label="Add dates" variant="soft" onPress={() => setKeyDateSheet(null)} />
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Large torn-paper strip running behind the cards, rotated 57.5°. */}
              <View
                pointerEvents="none"
                style={[
                  styles.centred,
                  { left: -326.91 * scale, top: -20, width: 981.557 * scale, height: 866.796 * scale },
                ]}
              >
                <Image
                  source={tornPaper}
                  contentFit="cover"
                  style={{ width: 482.066 * scale, height: 856.7 * scale, transform: [{ rotate: '57.51deg' }] }}
                />
              </View>

              <Image
                source={TAB_CONTENT[tab].artwork.source}
                contentFit="cover"
                contentPosition="bottom"
                style={{
                  width: TAB_CONTENT[tab].artwork.width,
                  height: TAB_CONTENT[tab].artwork.height,
                  transform: TAB_CONTENT[tab].artwork.rotate ? [{ rotate: TAB_CONTENT[tab].artwork.rotate! }] : [],
                }}
              />
              <Text style={styles.cardTitle}>{TAB_CONTENT[tab].heading}</Text>
              <View style={styles.comparisons}>
                {TAB_CONTENT[tab].cards.map((comparison) => (
                  <ComparisonCard key={comparison.title} comparison={comparison} />
                ))}
              </View>
            </>
          )}
        </FadeIn>
      </ScrollView>

      <KeyDateSheet
        visible={keyDateSheet !== undefined}
        connectionId={connection.id}
        editing={keyDateSheet ?? undefined}
        onClose={() => setKeyDateSheet(undefined)}
      />
    </View>
  );
}

// Their latest check-in with a suggestion, or a placeholder until they've done one.
function ConnectionCheckIn({ connection }: { connection: Connection }) {
  const { checkIn } = connection;
  if (!checkIn) {
    return (
      <View style={[styles.checkIn, styles.checkInEmpty]}>
        <Badge label="NO CHECK-IN YET" background={colors.black100} color={colors.black600} />
        <Text style={[styles.cardBody, styles.centredText]}>
          Their check-in will appear here once they’ve completed it.
        </Text>
      </View>
    );
  }
  return (
    <CheckInCard
      mood={checkIn.mood}
      note={checkIn.note}
      sharedAgo={checkIn.sharedAgo}
      tryThis={checkIn.tryThis}
      tone="blue"
    />
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingTop: 146, paddingBottom: 64, alignItems: 'center', gap: 32 },
  centred: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  decor: { position: 'absolute' },
  topBar: {
    position: 'absolute',
    top: 74,
    left: 16,
    right: 16,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: -0.48,
    color: colors.black1000,
  },
  topRule: { position: 'absolute', top: 114, left: 0, right: 0, height: 1, backgroundColor: colors.black1000 },
  intro: { width: 361, maxWidth: '92%', alignItems: 'center', gap: 32 },
  nameBlock: { alignItems: 'center', gap: 16 },
  name: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 32, letterSpacing: -0.96, color: colors.black1000 },
  checkIn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  checkInEmpty: { gap: 16 },
  tabs: { alignSelf: 'stretch', gap: 16 },
  rule: { height: 1, backgroundColor: colors.black1000 },
  tabRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  tabText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    letterSpacing: -0.36,
    color: colors.black600,
    textTransform: 'uppercase',
  },
  tabActive: { fontFamily: fonts.sansBold, color: colors.black1000 },
  tabContent: { alignSelf: 'stretch', alignItems: 'center', gap: 32 },
  card: { width: 361, maxWidth: '92%', alignItems: 'center', gap: 24, padding: 16, borderWidth: 1 },
  cardHeading: { alignSelf: 'stretch', alignItems: 'center', gap: 16 },
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
  centredText: { textAlign: 'center' },
  basis: { alignSelf: 'stretch', fontFamily: fonts.sansMedium, fontSize: 12, lineHeight: 16.8, color: colors.black600 },
  keyDatesWrap: { alignSelf: 'stretch', alignItems: 'center' },
  decorWrap: { alignSelf: 'stretch', alignItems: 'center' },
  // Same width as the cards around it.
  chartColumn: { width: 361, maxWidth: '92%' },
  keyDatesHeading: { alignSelf: 'stretch', gap: 8 },
  comparisons: { width: 361, maxWidth: '92%', gap: 16 },
});
