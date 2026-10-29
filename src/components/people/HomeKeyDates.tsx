import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { KeyDateCard } from '@/components/people/KeyDateCard';
import { daysUntil, useConnections } from '@/state/connections';
import { colors, useDesignScale } from '@/theme';

// Figma: Home (68:1401) "Frame 173" — countdowns for key dates toggled onto the home
// page, soonest first, one per page with square page dots underneath.
export function HomeKeyDates() {
  const connections = useConnections();
  const { width } = useDesignScale();
  // Same width as the cards below (screen width less a 16pt gutter each side). Worked out
  // from the screen rather than measured, so every page is full width from the first frame.
  const pageWidth = width - 32;
  const [page, setPage] = useState(0);

  const items = useMemo(
    () =>
      connections
        .flatMap((connection) =>
          connection.keyDates.filter((keyDate) => keyDate.showOnHome).map((keyDate) => ({ connection, keyDate })),
        )
        .sort((a, b) => daysUntil(a.keyDate.date) - daysUntil(b.keyDate.date)),
    [connections],
  );

  if (items.length === 0) return null;

  return (
    <View style={[styles.container, { width: pageWidth }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          setPage(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
        }}
      >
        {items.map(({ connection, keyDate }) => (
          <Pressable
            key={keyDate.id}
            accessibilityRole="button"
            accessibilityHint={`Opens ${connection.name}`}
            onPress={() => router.push(`/connection/${connection.id}`)}
            style={{ width: pageWidth }}
          >
            <KeyDateCard keyDate={keyDate} personName={connection.name} />
          </Pressable>
        ))}
      </ScrollView>

      {/* One square per key date; the dark one is the date in view. */}
      <View style={styles.dots}>
        {items.map(({ keyDate }, index) => (
          <View key={keyDate.id} style={[styles.dot, index === page && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  dots: { flexDirection: 'row', alignSelf: 'center', gap: 4 },
  dot: { width: 8, height: 8, backgroundColor: colors.black100 },
  dotActive: { backgroundColor: colors.black600 },
});
