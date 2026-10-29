import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckWhite from '@assets/icons/check-white.svg';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { CheckInTopBar } from '@/components/checkIn/CheckInTopBar';
import { PrivacyCaption } from '@/components/checkIn/PrivacyCaption';
import { updateCheckIn, useCheckInDraft } from '@/state/checkIn';
import { colors, useDesignScale } from '@/theme';

const paper = require('@assets/images/paper-texture.png');

// Figma: Check in / "journal entry / check in" (162:3091)
export default function PrivateNoteScreen() {
  const draft = useCheckInDraft();
  const insets = useSafeAreaInsets();
  const { scale } = useDesignScale();
  const [note, setNote] = useState(draft.note);

  // Close leaves the note as it was; Done keeps the edit.
  const done = () => {
    updateCheckIn({ note: note.trim() });
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Image
        source={paper}
        contentFit="cover"
        style={[styles.paper, { left: -291 * scale, top: -30 * scale, width: 1043 * scale, height: 1546 * scale }]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        // The Done button sits 39 above the bottom of the frame.
        style={[styles.page, { paddingTop: insets.top, paddingBottom: Math.max(39, insets.bottom + 16) }]}
      >
        <View style={styles.body}>
          <CheckInTopBar title="Private Note" tone="dark" onClose={() => router.back()} />
          <View style={styles.area}>
            <TextField
              multiline
              autoFocus
              value={note}
              onChangeText={setNote}
              placeholder="Write as much or as little as you like"
              accessibilityLabel="Private note"
              style={styles.input}
            />
          </View>
          <PrivacyCaption centred />
        </View>
        <Button label="Done" icon={<CheckWhite width={18} height={18} />} style={styles.done} onPress={done} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, overflow: 'hidden' },
  paper: { position: 'absolute', opacity: 0.4, mixBlendMode: 'multiply' },
  page: { flex: 1, gap: 24 },
  // Top bar, note and caption, with the note taking the spare height (502 on the Figma
  // frame). The caption ends 85 above the Done button.
  body: { flex: 1, gap: 24, paddingBottom: 61 },
  area: { flex: 1, marginHorizontal: 18 },
  // Figma's instance has a solid square border here.
  input: { height: '100%', borderColor: colors.black1000, borderRadius: 0 },
  done: { height: 56, marginHorizontal: 18 },
});
