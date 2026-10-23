import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { CodeInput } from '@/components/CodeInput';
import { colors, fonts } from '@/theme';

// Figma: Onboarding / "code" (49:1424)
export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');

  // Prototype: any code is accepted.
  const onContinue = () => router.push('/name');

  return (
    <AuthScreen title="Confirm your email" subtitle={`We sent you a code to ${email || 'your email'}`} showBack>
      <CodeInput value={code} onChange={setCode} />

      <View style={styles.actions}>
        <Button label="Continue" onPress={onContinue} />
        <View style={styles.resendRow}>
          <Text style={styles.resend}>Didn’t receive a code? </Text>
          {/* TODO: resend the code once there's a backend. */}
          <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setCode('')}>
            <Text style={[styles.resend, styles.resendLink]}>Resend</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  actions: { gap: 16 },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resend: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
  resendLink: { fontFamily: fonts.sansBold, textDecorationLine: 'underline' },
});
