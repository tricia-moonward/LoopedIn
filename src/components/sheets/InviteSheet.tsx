import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import CopyIcon from '@assets/icons/copy.svg';
import ShareIcon from '@assets/icons/share.svg';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { regenerateInviteLink, useInviteLink } from '@/state/invites';
import { useFirstName } from '@/state/profile';
import { colors, fonts } from '@/theme';

type InviteSheetProps = { visible: boolean; onClose: () => void };

// Figma: Home / "overlay" (81:2553) — your invite link with Copy and Share.
export function InviteSheet({ visible, onClose }: InviteSheetProps) {
  const link = useInviteLink(useFirstName());
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = async () => {
    try {
      await Clipboard.setStringAsync(`https://${link}`);
    } catch {
      // Some browsers block clipboard access (e.g. when the page isn't focused).
      return;
    }
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    try {
      await Share.share({ message: `Join me on LoopedIn: https://${link}` });
    } catch {
      // Browsers without a share sheet: copy instead.
      await copy();
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.heading}>
        <Text style={styles.title}>Invite people to use LoopedIn with you</Text>
        <Text style={styles.body}>Copy this link to connect with others on LoopedIn.</Text>
      </View>

      <View style={styles.linkField}>
        <Text style={styles.link} numberOfLines={1}>
          {link}
        </Text>
        <Pressable accessibilityRole="button" onPress={regenerateInviteLink} hitSlop={8}>
          <Text style={styles.regenerate}>Regenerate</Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Button
          label={copied ? 'Copied' : 'Copy'}
          icon={<CopyIcon width={18} height={18} />}
          onPress={copy}
          style={styles.action}
        />
        <Button
          label="Share"
          variant="soft"
          icon={<ShareIcon width={18} height={18} />}
          onPress={share}
          style={styles.action}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  heading: { alignSelf: 'stretch', gap: 16 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    color: colors.black1000,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  body: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800, textAlign: 'center' },
  linkField: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.black100,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  link: { flex: 1, fontFamily: fonts.sansBold, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
  regenerate: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    letterSpacing: -0.36,
    color: colors.black600,
    textDecorationLine: 'underline',
  },
  actions: { alignSelf: 'stretch', flexDirection: 'row', gap: 8 },
  action: { flex: 1, alignSelf: 'auto' },
});
