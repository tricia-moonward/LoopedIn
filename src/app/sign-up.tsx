import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Divider from '@assets/icons/divider.svg';
import GoogleIcon from '@assets/icons/google.svg';
import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { AppleIcon } from '@/components/icons/AppleIcon';
import { TextField } from '@/components/TextField';
import { colors, fonts } from '@/theme';

// Something@something.something — enough to catch typos before sending a code.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Figma: Onboarding / "sign up" (49:527)
export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  // Only flag the email once they've tried to continue with it.
  const [showError, setShowError] = useState(false);
  const emailInvalid = !EMAIL_PATTERN.test(email.trim());

  const onContinue = () => {
    if (emailInvalid) {
      setShowError(true);
      return;
    }
    router.push({ pathname: '/verify-email', params: { email: email.trim() } });
  };

  return (
    <AuthScreen
      title="Login or sign up"
      subtitle="Sign in or create an account using your email"
      footer={
        <Text style={styles.legal}>
          By continuing, you are agreeing to the <Text style={styles.legalLink}>Terms & Conditions</Text> and{' '}
          <Text style={styles.legalLink}>Privacy Policy</Text> of LoopedIn.
        </Text>
      }
    >
      <View style={styles.emailGroup}>
        <View style={styles.field}>
          <Text style={styles.label} nativeID="email-label">
            Email
          </Text>
          <TextField
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setShowError(false);
            }}
            error={showError}
            onSubmitEditing={onContinue}
            placeholder="you@email.com.au"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            accessibilityLabelledBy="email-label"
          />
        </View>
        {showError ? (
          <Text style={[styles.hint, styles.errorHint]} accessibilityLiveRegion="polite">
            {email.trim() ? 'That email doesn’t look right. Check it and try again.' : 'Enter your email to continue.'}
          </Text>
        ) : (
          <Text style={styles.hint}>We’ll send you a verification code</Text>
        )}
      </View>

      <Button label="Continue" onPress={onContinue} />

      <View style={styles.orRow}>
        <View style={styles.flex}>
          <Divider width="100%" height={1} />
        </View>
        <Text style={styles.orText}>OR</Text>
        <View style={styles.flex}>
          <Divider width="100%" height={1} />
        </View>
      </View>

      <View style={styles.social}>
        <Button variant="outline" label="Continue with Apple" icon={<AppleIcon />} />
        <Button variant="outline" label="Continue with Google" icon={<GoogleIcon width={24} height={24} />} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  emailGroup: { gap: 14 },
  field: { gap: 8 },
  label: { fontFamily: fonts.sansBold, fontSize: 14, letterSpacing: -0.42, color: colors.charcoal100 },
  hint: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36, color: colors.black600 },
  errorHint: { color: colors.accentRed },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  orText: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36, color: colors.black600 },
  social: { gap: 8 },
  legal: {
    width: '100%',
    maxWidth: 361,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black800,
    textAlign: 'center',
  },
  legalLink: {
    fontFamily: fonts.sansSemiBold,
    color: colors.black1000,
    textDecorationLine: 'underline',
  },
});
