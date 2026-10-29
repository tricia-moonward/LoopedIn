import { StyleSheet, Text, View } from 'react-native';

import Lock from '@assets/icons/lock.svg';
import { colors, fonts } from '@/theme';

// Figma "Privacy Caption" under the private note field.
export function PrivacyCaption({ centred }: { centred?: boolean }) {
  return (
    <View style={[styles.caption, centred && styles.centred]}>
      <Lock width={12} height={12} />
      <Text style={styles.text}>Only you see this. Your note is never shared.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  // The Private Note screen centres it with a little more room by the lock.
  centred: { alignSelf: 'center', gap: 6 },
  text: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36, color: colors.black600 },
});
