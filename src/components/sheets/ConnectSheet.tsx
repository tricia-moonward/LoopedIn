import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ArrowDropDown from '@assets/icons/arrow-drop-down.svg';
import CheckDark from '@assets/icons/check-dark.svg';
import CheckWhite from '@assets/icons/check-white.svg';
import CloseIcon from '@assets/icons/close.svg';
import Dash from '@assets/icons/dash.svg';
import LinkIcon from '@assets/icons/link.svg';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { addConnection } from '@/state/connections';
import { CONNECTION_TYPES, resolveRequest, type ConnectionType, type InviteRequest } from '@/state/invites';
import { useFirstName } from '@/state/profile';
import { colors, fonts } from '@/theme';

type ConnectSheetProps = {
  request: InviteRequest | null;
  onClose: () => void;
};

// Figma: Home / "accept invite / overlay" (92:2887) then "connected / overlay" (92:3015).
export function ConnectSheet({ request, onClose }: ConnectSheetProps) {
  const myName = useFirstName() || 'You';
  const [step, setStep] = useState<'accept' | 'connected'>('accept');
  const [type, setType] = useState<ConnectionType | null>(null);
  const [picking, setPicking] = useState(false);

  // Start fresh each time a request is opened.
  useEffect(() => {
    if (!request) return;
    setStep('accept');
    setType(null);
    setPicking(false);
  }, [request]);

  if (!request) return <BottomSheet visible={false} onClose={onClose}>{null}</BottomSheet>;

  const theirName = request.name.split(' ')[0];
  const chosen = CONNECTION_TYPES.find((option) => option.key === type);

  const finish = () => {
    if (step === 'connected') addConnection(request.id, request.name, type ?? 'friend');
    resolveRequest(request.id);
    onClose();
  };

  return (
    <BottomSheet visible onClose={step === 'connected' ? finish : onClose}>
      {step === 'accept' ? (
        <>
          <Heading
            title={`Connect with ${theirName}?`}
            body={`Accept or reject ${theirName}’s connection invite here.`}
          />
          <Pair
            me={<Avatar name={myName} size={64} tone="light" />}
            icon={<LinkIcon width={20} height={20} />}
            them={<Avatar name={theirName} size={64} tone="dark" />}
          />

          <View style={styles.field}>
            <View style={styles.fieldDetails}>
              <Text style={styles.fieldLabel}>How do you know {theirName}?</Text>
              <Text style={styles.fieldHint}>This shapes the questions and insights you two get about your connection.</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              aria-expanded={picking}
              onPress={() => setPicking((open) => !open)}
              style={[styles.select, picking && styles.selectOpen]}
            >
              <Text style={[styles.selectText, chosen && styles.selectChosen]}>
                {chosen ? chosen.name : 'Select one'}
              </Text>
              <ArrowDropDown width={16} height={16} />
            </Pressable>
            {picking && (
              <View style={styles.options} accessibilityRole="radiogroup">
                {CONNECTION_TYPES.map((option) => (
                  <Pressable
                    key={option.key}
                    accessibilityRole="radio"
                    aria-checked={option.key === type}
                    onPress={() => {
                      setType(option.key);
                      setPicking(false);
                    }}
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                  >
                    <Text style={[styles.selectText, styles.selectChosen]}>{option.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <Button
              label="Accept"
              icon={<CheckWhite width={18} height={18} />}
              onPress={() => setStep('connected')}
              style={styles.action}
            />
            <Button
              label="Decline"
              variant="soft"
              icon={<CloseIcon width={18} height={18} />}
              onPress={finish}
              style={styles.action}
            />
          </View>
        </>
      ) : (
        <>
          <Heading
            title="You’re connected"
            body={`You and ${theirName} are now connected. Use LoopedIn together to get insights on your relationship.`}
          />
          <Pair
            me={<Avatar name={myName} size={64} tone="outlined" />}
            icon={<CheckDark width={20} height={20} />}
            them={<Avatar name={theirName} size={64} tone="lime" />}
          />
          {chosen && (
            <Badge
              label={`${chosen.emoji}  ${chosen.name.toUpperCase()}`}
              background={chosen.background}
              color={chosen.color}
            />
          )}
          <Button label="Finish" variant="soft" onPress={finish} />
        </>
      )}
    </BottomSheet>
  );
}

function Heading({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

// Your avatar — dashed line, icon, dashed line — their avatar (Figma 92:2960).
function Pair({ me, icon, them }: { me: ReactNode; icon: ReactNode; them: ReactNode }) {
  return (
    <View style={styles.pair}>
      {me}
      <View style={styles.link}>
        <Dash width={9} height={1} />
        {icon}
        <Dash width={9} height={1} />
      </View>
      {them}
    </View>
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
  pair: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  field: { alignSelf: 'stretch', gap: 8 },
  fieldDetails: { gap: 2 },
  fieldLabel: { fontFamily: fonts.sansBold, fontSize: 14, letterSpacing: -0.42, color: colors.charcoal100 },
  // Figma uses Overused Grotesk here; Mulish keeps the app to its loaded fonts.
  fieldHint: { fontFamily: fonts.sansRegular, fontSize: 14, color: colors.charcoal60 },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.black100,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  selectOpen: { borderColor: colors.black1000 },
  selectText: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black600 },
  selectChosen: { color: colors.black1000 },
  options: { borderWidth: 1, borderColor: colors.black100, borderRadius: 4, backgroundColor: colors.white },
  option: { padding: 12 },
  optionPressed: { backgroundColor: colors.black100 },
  actions: { alignSelf: 'stretch', flexDirection: 'row', gap: 8 },
  action: { flex: 1, alignSelf: 'auto' },
});
