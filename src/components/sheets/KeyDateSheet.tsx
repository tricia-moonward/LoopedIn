import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ArrowDropDown from '@assets/icons/arrow-drop-down.svg';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Toggle } from '@/components/Toggle';
import { saveKeyDate, type KeyDate } from '@/state/connections';
import { colors, fonts } from '@/theme';

type KeyDateSheetProps = {
  visible: boolean;
  connectionId: string;
  // Set when editing an existing date; otherwise the sheet creates a new one.
  editing?: KeyDate;
  onClose: () => void;
};

// Tapping the emoji box steps through these.
const EMOJIS = ['📅', '❤️', '🎂', '💍', '✈️', '🎉', '🏡'];

// "23112026" → "23 / 11 / 2026", formatted as they type.
function formatDateInput(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join(' / ');
}

// "23 / 11 / 2026" → "2026-11-23", or null if it isn't a real date.
function parseDateInput(text: string) {
  const digits = text.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4));
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return `${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}

function toDateInput(isoDate: string) {
  const [year, month, day] = isoDate.split('-');
  return `${day} / ${month} / ${year}`;
}

// Figma: People / "accept invite / overlay" (125:1860), titled "New Key Date".
export function KeyDateSheet({ visible, connectionId, editing, onClose }: KeyDateSheetProps) {
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [title, setTitle] = useState('');
  const [dateText, setDateText] = useState('');
  const [showOnHome, setShowOnHome] = useState(false);

  // Start fresh (or from the date being edited) each time the sheet opens.
  useEffect(() => {
    if (!visible) return;
    setEmoji(editing?.emoji ?? EMOJIS[0]);
    setTitle(editing?.title ?? '');
    setDateText(editing ? toDateInput(editing.date) : '');
    setShowOnHome(editing?.showOnHome ?? false);
  }, [visible, editing]);

  const isoDate = parseDateInput(dateText);
  const dateInvalid = dateText.replace(/\D/g, '').length === 8 && !isoDate;
  const canSave = title.trim().length > 0 && !!isoDate;

  const save = () => {
    if (!isoDate || !canSave) return;
    saveKeyDate(connectionId, {
      id: editing?.id ?? `${Date.now()}`,
      emoji,
      title: title.trim(),
      date: isoDate,
      showOnHome,
    });
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.heading}>
        <Text style={styles.title}>{editing ? 'Edit Key Date' : 'New Key Date'}</Text>
        <Text style={styles.body}>Add dates that are important to your relationship.</Text>
      </View>

      <View style={styles.fields}>
        <View style={styles.field}>
          <Text style={styles.label}>Pick a title and emoji</Text>
          <View style={styles.titleRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Emoji ${emoji}, tap to change`}
              onPress={() => setEmoji(EMOJIS[(EMOJIS.indexOf(emoji) + 1) % EMOJIS.length])}
              style={({ pressed }) => [styles.emojiBox, pressed && styles.pressed]}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </Pressable>
            <TextField
              value={title}
              onChangeText={setTitle}
              placeholder="Name of event"
              returnKeyType="next"
              style={styles.flex}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pick a date</Text>
          <View>
            <TextField
              value={dateText}
              onChangeText={(text) => setDateText(formatDateInput(text))}
              placeholder="DD / MM / YYYY"
              keyboardType="number-pad"
              maxLength={14}
              error={dateInvalid}
              style={styles.dateInput}
            />
            <View style={styles.dateIcon} pointerEvents="none">
              <ArrowDropDown width={16} height={16} />
            </View>
          </View>
          {dateInvalid && <Text style={styles.error}>That date doesn’t exist. Check the day and month.</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Add to home screen</Text>
          <View style={styles.toggleBox}>
            <Text style={styles.toggleHint}>Toggle this ON to display a countdown to this event on your home page.</Text>
            <Toggle value={showOnHome} onValueChange={setShowOnHome} accessibilityLabel="Add to home screen" />
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label={editing ? 'Save' : 'Create'}
          onPress={save}
          style={[styles.action, !canSave && styles.disabled]}
        />
        <Button label="Discard" variant="soft" onPress={onClose} style={styles.action} />
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
  fields: { alignSelf: 'stretch', gap: 16 },
  field: { gap: 8 },
  label: { fontFamily: fonts.sansBold, fontSize: 14, letterSpacing: -0.42, color: colors.charcoal100 },
  titleRow: { flexDirection: 'row', gap: 8 },
  emojiBox: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: colors.black100,
  },
  pressed: { opacity: 0.7 },
  emoji: { fontSize: 24 },
  flex: { flex: 1 },
  dateInput: { paddingRight: 36 },
  dateIcon: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' },
  error: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.accentRed },
  toggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.black100,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  // Figma uses Overused Grotesk here; Mulish keeps the app to its loaded fonts.
  toggleHint: { flex: 1, fontFamily: fonts.sansRegular, fontSize: 14, letterSpacing: -0.42, color: colors.charcoal60 },
  actions: { alignSelf: 'stretch', flexDirection: 'row', gap: 8 },
  action: { flex: 1, alignSelf: 'auto' },
  disabled: { opacity: 0.4 },
});
