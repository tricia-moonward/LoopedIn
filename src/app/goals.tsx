import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AddIcon from '@assets/icons/add.svg';
import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { AddOwnCard, SelectionCard } from '@/components/SelectionCard';
import { TextField } from '@/components/TextField';

// Shown two per row; an odd one out at the end takes the full width.
const GOALS = [
  'Feel more connected day to day',
  'Communicate better',
  'Handle disagreements better',
  'Understand the people close to me',
  'Show up better for others',
  'Understand myself better',
  'Grow as a person',
  'Get through a tough patch',
];
const MAX_PICKS = 3;

// Figma: Onboarding / "goals" (53:3382)
export default function GoalsScreen() {
  const [picked, setPicked] = useState<string[]>([]);
  const [writingOwn, setWritingOwn] = useState(false);
  const [ownGoal, setOwnGoal] = useState('');

  // A written goal counts towards the limit of 3 once it has text.
  const total = picked.length + (ownGoal.trim() ? 1 : 0);

  const toggle = (goal: string) =>
    setPicked((current) =>
      current.includes(goal)
        ? current.filter((g) => g !== goal)
        : total < MAX_PICKS
          ? [...current, goal]
          : current,
    );

  const rows = Array.from({ length: Math.ceil(GOALS.length / 2) }, (_, i) => GOALS.slice(i * 2, i * 2 + 2));

  return (
    <AuthScreen
      title="What do you hope LoopedIn helps with?"
      subtitle="Pick up to 3. We’ll shape your questions and tips around them."
      showBack
      compact
      onSkip={() => router.push('/profile-intro')}
    >
      <View style={styles.choices}>
        <View style={styles.grid}>
          {rows.map((row) => (
            <View key={row[0]} style={styles.row}>
              {row.map((goal) => (
                <SelectionCard
                  key={goal}
                  kind="tile"
                  title={goal}
                  selected={picked.includes(goal)}
                  onPress={() => toggle(goal)}
                  style={[styles.tile, row.length === 1 && styles.wideTile]}
                />
              ))}
            </View>
          ))}
        </View>
        {writingOwn ? (
          <TextField
            value={ownGoal}
            onChangeText={setOwnGoal}
            placeholder="Something else"
            autoFocus
            maxLength={80}
            returnKeyType="done"
            onBlur={() => !ownGoal.trim() && setWritingOwn(false)}
            editable={!!ownGoal.trim() || total < MAX_PICKS}
            accessibilityLabel="Write your own goal"
          />
        ) : (
          <AddOwnCard label="Something else (Write your own)" onPress={() => setWritingOwn(true)}>
            <AddIcon width={16} height={16} />
          </AddOwnCard>
        )}
      </View>

      <Button label="Continue" onPress={() => router.push('/profile-intro')} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  choices: { gap: 12 },
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, height: 84 },
  wideTile: { height: 52 },
});
