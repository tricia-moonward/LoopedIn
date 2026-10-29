import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SvgProps } from 'react-native-svg';

import ArrowBack from '@assets/icons/arrow-back.svg';
import ChevronRight from '@assets/icons/chevron-right-faint.svg';
import BellIcon from '@assets/icons/settings-bell.svg';
import ChatIcon from '@assets/icons/settings-chat.svg';
import FlagIcon from '@assets/icons/settings-flag.svg';
import HelpIcon from '@assets/icons/settings-help.svg';
import LockIcon from '@assets/icons/settings-lock.svg';
import PersonIcon from '@assets/icons/settings-person.svg';
import { FadeIn } from '@/components/FadeIn';
import { PaperTexture } from '@/components/PaperTexture';
import { setFirstName } from '@/state/profile';
import { colors, fonts, useDesignScale } from '@/theme';

// Dithered statue at 10% (a shader effect in Figma, exported flat as it renders).
const statue = require('@assets/images/settings-statue.png');

const FIGMA_STATUS_BAR = 59;

// None of these screens are designed yet, so the rows don't open anything.
const ROWS: { title: string; detail: string; Icon: ComponentType<SvgProps> }[] = [
  { title: 'Account', detail: 'Name, email and identity details', Icon: PersonIcon },
  { title: 'Goals', detail: 'What you want LoopedIn to help with', Icon: FlagIcon },
  { title: 'Privacy & sharing', detail: 'What each connection can see', Icon: LockIcon },
  { title: 'Notifications', detail: 'Reminders and your check-in time', Icon: BellIcon },
  { title: 'Help & support', detail: 'Support services, terms and privacy policy', Icon: HelpIcon },
  { title: 'Share feedback', detail: 'Tell us what’s working and what isn’t', Icon: ChatIcon },
];

// Figma: You / "Settings" (170:4713)
export default function SettingsScreen() {
  const { scale } = useDesignScale();
  const lift = Math.max(0, FIGMA_STATUS_BAR - useSafeAreaInsets().top);

  const logOut = () => {
    setFirstName('');
    router.dismissAll();
    router.replace('/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <PaperTexture />
      <Image
        source={statue}
        contentFit="cover"
        style={{ position: 'absolute', left: 0, top: 48 * scale - lift, width: 393 * scale, height: 804 * scale }}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: 66 - lift }]}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={12} onPress={() => router.back()}>
            <ArrowBack width={24} height={24} />
          </Pressable>
          <Text style={styles.topBarTitle}>Settings</Text>
          <View style={styles.trailing} />
        </View>

        <FadeIn style={styles.settings}>
          <View style={styles.list}>
            {ROWS.map(({ title, detail, Icon }, index) => (
              <Pressable
                key={title}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.row,
                  index < ROWS.length - 1 && styles.rowRuled,
                  pressed && styles.pressed,
                ]}
              >
                <Icon width={22} height={22} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{title}</Text>
                  <Text style={styles.rowDetail}>{detail}</Text>
                </View>
                <ChevronRight width={20} height={20} />
              </Pressable>
            ))}
          </View>
          <Text accessibilityRole="button" style={styles.logOut} onPress={logOut}>
            Log out
          </Text>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, overflow: 'hidden' },
  content: { paddingBottom: 48 },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.black100,
  },
  topBarTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: -0.48,
    color: colors.black1000,
    textTransform: 'capitalize',
  },
  trailing: { width: 24, height: 24 },
  settings: { marginTop: 14, marginHorizontal: 16, gap: 16, alignItems: 'flex-start' },
  list: { alignSelf: 'stretch', borderWidth: 1, borderColor: colors.black1000, backgroundColor: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  rowRuled: { borderBottomWidth: 1, borderBottomColor: colors.black100 },
  pressed: { backgroundColor: colors.black100 },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.sansSemiBold, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
  rowDetail: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36, color: colors.black600 },
  logOut: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black1000,
    textDecorationLine: 'underline',
  },
});
