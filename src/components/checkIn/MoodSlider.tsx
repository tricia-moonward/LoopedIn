import { useState } from 'react';
import { StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';

import { MOODS } from '@/state/checkIn';
import { colors, fonts } from '@/theme';

type MoodSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

const KNOB = 30;
// Centre of the first and last stop from each end of the 361-wide track.
const STOP_INSET = 17.5;
const LAST = MOODS.length - 1;

// "How are you feeling today?" slider (Figma 173:2255): five stops on a 20% white
// track; tap or drag to move the knob to the nearest one.
export function MoodSlider({ value, onChange }: MoodSliderProps) {
  const [width, setWidth] = useState(0);
  const step = (width - STOP_INSET * 2) / LAST;
  const stopX = (index: number) => STOP_INSET + index * step;

  const pick = (event: GestureResponderEvent) => {
    if (!width) return;
    const index = Math.round((event.nativeEvent.locationX - STOP_INSET) / step);
    const next = Math.min(LAST, Math.max(0, index));
    if (next !== value) onChange(next);
  };

  return (
    <View style={styles.group}>
      <Text style={styles.mood}>{MOODS[value].label}</Text>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="How are you feeling today?"
        accessibilityValue={{ text: MOODS[value].label }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === 'increment') onChange(Math.min(LAST, value + 1));
          if (nativeEvent.actionName === 'decrement') onChange(Math.max(0, value - 1));
        }}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        // Keep the drag when it strays vertically, rather than handing it to the ScrollView.
        onResponderTerminationRequest={() => false}
        onResponderGrant={pick}
        onResponderMove={pick}
        style={styles.track}
      >
        {width > 0 && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {MOODS.map((mood, index) => (
              <View key={mood.label} style={[styles.stop, { left: stopX(index) - 3 }]} />
            ))}
            <View style={[styles.knob, { left: stopX(value) - KNOB / 2 }]} />
          </View>
        )}
      </View>
      <View style={styles.ends}>
        <Text style={styles.end}>VERY UNPLEASANT</Text>
        <Text style={styles.end}>VERY PLEASANT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { alignSelf: 'stretch', alignItems: 'center', gap: 24 },
  mood: {
    fontFamily: fonts.sansBold,
    fontSize: 24,
    lineHeight: 24,
    color: colors.white,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  track: {
    alignSelf: 'stretch',
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    cursor: 'pointer',
  },
  stop: {
    position: 'absolute',
    top: 13,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  knob: {
    position: 'absolute',
    top: 1,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.white,
    boxShadow: 'inset 0px 0px 7px -1px rgba(0,0,0,0.25)',
  },
  ends: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between' },
  end: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: -0.36, color: colors.white, opacity: 0.8 },
});
