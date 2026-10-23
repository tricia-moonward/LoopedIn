import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { setFirstName as saveFirstName } from '@/state/profile';
import { colors, fonts } from '@/theme';

// Figma: Onboarding / "name" (49:2660)
export default function NameScreen() {
  const [firstName, setFirstName] = useState('');

  return (
    <AuthScreen title="What should we call you?" showBack>
      <View style={styles.group}>
        <View style={styles.field}>
          <Text style={styles.label}>First name</Text>
          <TextField
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Your first name"
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            returnKeyType="done"
            autoFocus
            accessibilityLabel="First name"
          />
        </View>
        <Text style={styles.hint}>This is how we’ll greet you in the app.</Text>
      </View>

      <Button
        label="Continue"
        onPress={() => {
          saveFirstName(firstName);
          router.push({ pathname: '/about-you', params: { firstName: firstName.trim() } });
        }}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 16 },
  field: { gap: 8 },
  label: { fontFamily: fonts.sansBold, fontSize: 14, letterSpacing: -0.42, color: colors.charcoal100 },
  hint: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
});
