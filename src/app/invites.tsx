import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import ArrowBack from '@assets/icons/arrow-back.svg';
import { Avatar } from '@/components/Avatar';
import { FadeIn } from '@/components/FadeIn';
import { ConnectSheet } from '@/components/sheets/ConnectSheet';
import { StatueBackground } from '@/components/StatueBackground';
import { useInviteRequests, type InviteRequest } from '@/state/invites';
import { colors, fonts } from '@/theme';

// Figma: Home / "invites" (90:2587)
export default function InvitesScreen() {
  const requests = useInviteRequests();
  const [viewing, setViewing] = useState<InviteRequest | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <StatueBackground />

      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} hitSlop={12}>
          <ArrowBack width={24} height={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Invite requests</Text>
        {/* Balances the back arrow so the title stays centred. */}
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.rule} />

      <ScrollView contentContainerStyle={styles.list}>
        <FadeIn style={styles.rows}>
          {requests.length === 0 ? (
            <Text style={styles.empty}>No invite requests right now.</Text>
          ) : (
            requests.map((request) => (
              <View key={request.id} style={styles.row}>
                <View style={styles.person}>
                  <Avatar name={request.name} size={32} tone="dark" />
                  <View style={styles.personText}>
                    <Text style={styles.name}>{request.name}</Text>
                    <Text style={styles.email}>{request.email}</Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`View ${request.name}’s invite`}
                  onPress={() => setViewing(request)}
                  style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
                >
                  <Text style={styles.pillText}>View</Text>
                </Pressable>
              </View>
            ))
          )}
        </FadeIn>
      </ScrollView>

      <ConnectSheet request={viewing} onClose={() => setViewing(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    marginTop: 64,
    marginHorizontal: 16,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: -0.48,
    color: colors.black1000,
    textTransform: 'capitalize',
  },
  headerSpacer: { width: 24 },
  rule: { marginTop: 16, height: 1, backgroundColor: colors.black100 },
  list: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32 },
  rows: { gap: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  person: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  personText: { flex: 1, gap: 8 },
  name: { fontFamily: fonts.serif, fontSize: 16, lineHeight: 16, letterSpacing: -0.48, color: colors.black1000 },
  email: { fontFamily: fonts.sansRegular, fontSize: 14, letterSpacing: -0.42, color: colors.black800 },
  pill: { padding: 8, backgroundColor: colors.black100 },
  pressed: { opacity: 0.7 },
  pillText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: colors.black800,
    textTransform: 'uppercase',
  },
  empty: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.black600, textAlign: 'center' },
});
