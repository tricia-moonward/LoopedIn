import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import ArrowForward from '@assets/icons/arrow-forward.svg';
import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { InfoList } from '@/components/InfoList';
import { useAnswers } from '@/components/profileQuiz/answers';
import { useProfile } from '@/components/profileQuiz/profiles';
import { QUESTIONS, TRAIT_COLORS, type Trait } from '@/components/profileQuiz/questions';
import { colors, fonts } from '@/theme';

// Figma: Onboarding / "rs status" summary (53:4387)
export default function ProfileSummaryScreen() {
  const answers = useAnswers();
  const profile = useProfile();

  // Skipped questions are left off the list.
  const rows = QUESTIONS.flatMap((question, i) => {
    const answer = answers[i];
    if (answer == null) return [];
    const option = question.options[answer];
    return [
      {
        label: question.summaryLabel,
        value: option.summary ?? option.label,
        trailing: <TraitTag trait={question.trait} />,
      },
    ];
  });

  return (
    <AuthScreen
      showBack
      heading={
        <>
          <Text style={styles.eyebrow}>About you</Text>
          <Text style={styles.title}>{profile.title}</Text>
          <Text style={styles.body}>{profile.body}</Text>
        </>
      }
    >
      {rows.length > 0 && <InfoList rows={rows} />}

      <Button
        label="Continue"
        trailingIcon={<ArrowForward width={16} height={16} />}
        onPress={() => router.push('/notifications')}
      />
    </AuthScreen>
  );
}

function TraitTag({ trait }: { trait: Trait }) {
  const { background, text } = TRAIT_COLORS[trait];
  return (
    <View style={[styles.tag, { backgroundColor: background }]}>
      <Text style={[styles.tagText, { color: text }]}>{trait}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    letterSpacing: -0.42,
    color: colors.black400,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.72,
    color: colors.black1000,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  body: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: -0.48,
    color: colors.black800,
    textAlign: 'center',
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.black1000,
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: -0.36 },
});
