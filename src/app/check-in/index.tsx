import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckWhite from '@assets/icons/check-white.svg';
import EditSmall from '@assets/icons/edit-small.svg';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/FadeIn';
import { TextField } from '@/components/TextField';
import { Toggle } from '@/components/Toggle';
import { CheckInBackground } from '@/components/checkIn/CheckInBackground';
import { CheckInTopBar } from '@/components/checkIn/CheckInTopBar';
import { AddChip, Chip, ChipRow } from '@/components/checkIn/Chips';
import { MoodSlider } from '@/components/checkIn/MoodSlider';
import { PrivacyCaption } from '@/components/checkIn/PrivacyCaption';
import { useConnections } from '@/state/connections';
import {
  TAG_GROUPS,
  startCheckIn,
  submitCheckIn,
  updateCheckIn,
  useCheckInDraft,
  type TagGroup,
} from '@/state/checkIn';
import { CONNECTION_TYPES } from '@/state/invites';
import { colors, fonts } from '@/theme';

// Figma lays the page out under a 59-tall status bar; where the real inset is shorter the
// page moves up by the difference (as on People).
const FIGMA_STATUS_BAR = 59;
// The Done button ends 86 above the bottom of the frame.
const PAGE_BOTTOM_PADDING = 86;

// Figma: Check in / "check in (v2) / more context open" (173:2247)
export default function CheckInScreen() {
  const draft = useCheckInDraft();
  const connections = useConnections();
  const lift = Math.max(0, FIGMA_STATUS_BAR - useSafeAreaInsets().top);

  // Fresh draft (or today's check-in, when editing) each time the screen opens.
  useEffect(() => startCheckIn(), []);

  const toggle = (group: TagGroup, option: string) => {
    const picked = draft.picked[group];
    updateCheckIn({
      picked: {
        ...draft.picked,
        [group]: picked.includes(option) ? picked.filter((item) => item !== option) : [...picked, option],
      },
    });
  };

  // Their own option is added and picked straight away.
  const add = (group: TagGroup, option: string) => {
    const known = [...TAG_GROUPS[group], ...draft.added[group]].includes(option);
    updateCheckIn({
      added: known ? draft.added : { ...draft.added, [group]: [...draft.added[group], option] },
      picked: draft.picked[group].includes(option)
        ? draft.picked
        : { ...draft.picked, [group]: [...draft.picked[group], option] },
    });
  };

  const toggleShare = (id: string) =>
    updateCheckIn({
      sharedWith: draft.sharedWith.includes(id)
        ? draft.sharedWith.filter((shared) => shared !== id)
        : [...draft.sharedWith, id],
    });

  const done = () => {
    submitCheckIn();
    router.replace('/check-in/complete');
  };

  const chips = (group: TagGroup) => (
    <ChipRow>
      {[...TAG_GROUPS[group], ...draft.added[group]].map((option) => (
        <Chip
          key={option}
          label={option}
          selected={draft.picked[group].includes(option)}
          onPress={() => toggle(group, option)}
        />
      ))}
      <AddChip onAdd={(option) => add(group, option)} />
    </ChipRow>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: FIGMA_STATUS_BAR - lift }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CheckInBackground lift={lift} paperHeight={2446} />

        {/* Back to Home wherever the check-in was opened from (it may not be the screen below). */}
        <CheckInTopBar title="Daily Check-In" tone="light" onClose={() => router.dismissTo('/home')} />

        <FadeIn style={styles.hero}>
          <Text style={styles.question}>How are you feeling today?</Text>
          <MoodSlider value={draft.mood} onChange={(mood) => updateCheckIn({ mood })} />
        </FadeIn>

        <FadeIn delay={90} style={styles.sections}>
          <Rule />

          <View style={styles.noteBlock}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/check-in/note')}
              style={({ pressed }) => [styles.noteButton, pressed && styles.pressed]}
            >
              <Text style={[styles.noteText, !!draft.note && styles.noteFilled]} numberOfLines={2}>
                {draft.note || 'Add a private note'}
              </Text>
              <EditSmall width={16} height={16} />
            </Pressable>
            <PrivacyCaption />
          </View>

          <Rule />

          <View style={styles.groups}>
            <Field title="Anything happening?" context="Pick any. These can be shared.">
              {chips('happening')}
            </Field>
            <Field title="What are you doing?" context="Pick any">
              {chips('doing')}
            </Field>
            <Field title="Who are you with?" context="Pick any. Only you see this.">
              <ChipRow>
                {connections.map((connection) => {
                  const firstName = connection.name.split(' ')[0];
                  return (
                    <Chip
                      key={connection.id}
                      person
                      label={firstName}
                      selected={draft.picked.with.includes(firstName)}
                      onPress={() => toggle('with', firstName)}
                    />
                  );
                })}
                {[...TAG_GROUPS.with, ...draft.added.with].map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    selected={draft.picked.with.includes(option)}
                    onPress={() => toggle('with', option)}
                  />
                ))}
                <AddChip onAdd={(option) => add('with', option)} />
              </ChipRow>
            </Field>
            <Field title="Where are you?" context="Pick any">
              {chips('where')}
            </Field>
          </View>

          <Rule />

          <View style={styles.block}>
            <Badge label="ABOUT YOU" background={colors.accentBlue} size="small" align="start" />
            <Field
              title="When you’re stretched thin, what helps the most?"
              context="Pick any. Only you see your answer."
            >
              {chips('stretchedThin')}
            </Field>
          </View>

          <Rule />

          <View style={styles.block}>
            <Field
              title="What’s something you’re looking forward to this month?"
              context="You’ll both see each other’s answers once you’ve both answered."
            >
              <TextField
                multiline
                value={draft.lookingForward}
                onChangeText={(lookingForward) => updateCheckIn({ lookingForward })}
                placeholder="Write as much or as little as you like"
                style={styles.textArea}
              />
            </Field>
          </View>

          <Rule />

          <View style={styles.block}>
            <Field title="Share with" context="Off until you choose, every check-in. Your note is never shared.">
              <View style={styles.shareRows}>
                {connections.map((connection) => {
                  const type = CONNECTION_TYPES.find((option) => option.key === connection.type)!;
                  return (
                    <View key={connection.id} style={styles.shareRow}>
                      <Avatar name={connection.name} size={32} tone="dark" />
                      <View style={styles.shareName}>
                        <Text style={styles.name}>{connection.name}</Text>
                        <Badge
                          label={type.name.toUpperCase()}
                          background={type.background}
                          color={type.color}
                          size="small"
                          align="start"
                        />
                      </View>
                      <Toggle
                        value={draft.sharedWith.includes(connection.id)}
                        onValueChange={() => toggleShare(connection.id)}
                        accessibilityLabel={`Share with ${connection.name}`}
                      />
                    </View>
                  );
                })}
              </View>
            </Field>
          </View>

          <Rule />

          <Button
            label="Done"
            icon={<CheckWhite width={18} height={18} />}
            style={styles.done}
            onPress={done}
          />
        </FadeIn>
      </ScrollView>
    </View>
  );
}

// Figma "fieldDetails": bold title over a grey hint, then the field itself.
function Field({ title, context, children }: { title: string; context: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldDetails}>
        <Text style={styles.fieldTitle}>{title}</Text>
        <Text style={styles.fieldContext}>{context}</Text>
      </View>
      {children}
    </View>
  );
}

// Full-width 1pt rule between sections.
function Rule() {
  return <View style={styles.rule} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  // Clips the oversized background art so it can't add scrollable space.
  content: { paddingBottom: PAGE_BOTTOM_PADDING, overflow: 'hidden' },
  // Heading starts 40 below the top bar; the rule sits 45 below the slider labels.
  hero: { marginTop: 40, marginBottom: 45, marginHorizontal: 16, gap: 32 },
  question: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    color: colors.white,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  sections: { gap: 24 },
  rule: { height: 1, backgroundColor: colors.black1000 },
  noteBlock: { marginHorizontal: 16, gap: 8 },
  noteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  pressed: { opacity: 0.85 },
  noteText: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black600 },
  noteFilled: { fontFamily: fonts.sansBold, color: colors.black1000 },
  groups: { marginHorizontal: 16, gap: 24 },
  block: { marginHorizontal: 18, gap: 14 },
  field: { gap: 14 },
  fieldDetails: { gap: 2 },
  fieldTitle: { fontFamily: fonts.sansBold, fontSize: 14, letterSpacing: -0.42, color: colors.charcoal100 },
  fieldContext: { fontFamily: fonts.sansRegular, fontSize: 14, letterSpacing: -0.42, color: colors.charcoal60 },
  // Figma's instance has a solid square border here.
  textArea: { height: 100, borderColor: colors.black1000, borderRadius: 0 },
  shareRows: { gap: 8 },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.black1000,
    backgroundColor: colors.white,
  },
  shareName: { flex: 1, gap: 4 },
  name: { fontFamily: fonts.sansBold, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
  done: { marginHorizontal: 18 },
});
