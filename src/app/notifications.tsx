import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Platform } from 'react-native';

import { Artwork } from '@/components/Artwork';
import { IntroScreen } from '@/components/IntroScreen';
import { colors } from '@/theme';

// Exported from Figma with the dither baked in; used at two sizes.
const orchid = require('@assets/images/orchid.png');

// Shows the system "Allow notifications?" prompt. Whatever the answer, onboarding
// carries on; if they've already answered before, iOS doesn't ask again.
async function askForNotifications() {
  if (Platform.OS === 'web') {
    // Browsers that support it show their own prompt (iOS Safari only does for home-screen web apps).
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    return;
  }
  await Notifications.requestPermissionsAsync();
}

// Figma: Onboarding / "notification" (54:4619)
export default function NotificationsScreen() {
  const asking = useRef(false);

  const onTurnOn = async () => {
    if (asking.current) return;
    asking.current = true;
    try {
      await askForNotifications();
    } catch {
      // Not being able to ask shouldn't block onboarding.
    }
    router.replace('/all-set');
  };

  return (
    <IntroScreen
      tint={colors.accentBlue}
      lead="Enable notifications"
      leadColor={colors.accentBlue}
      title="Want a gentle nudge?"
      body="We’ll tell you when today’s question is ready, and when someone you’ve added joins or answers."
      artwork={
        <>
          <Artwork source={orchid} x={-75} y={561} width={374} height={350} />
          <Artwork source={orchid} x={232.5} y={80} width={217} height={203} />
        </>
      }
      buttonLabel="Turn on notifications"
      showArrow={false}
      onContinue={onTurnOn}
    />
  );
}
