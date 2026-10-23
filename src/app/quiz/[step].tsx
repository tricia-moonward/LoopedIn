import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { setAnswer, useAnswers } from '@/components/profileQuiz/answers';
import { QUESTIONS } from '@/components/profileQuiz/questions';
import { SelectionCard } from '@/components/SelectionCard';

// Long enough to see the selected state before moving on.
const ADVANCE_DELAY_MS = 250;

// Figma: Onboarding / "rs status" question screens (53:3767 … 53:4303).
// One route for all eight questions: /quiz/1 … /quiz/8. Tapping an answer moves on.
export default function QuizQuestionScreen() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const index = Math.min(Math.max(Number(step) - 1 || 0, 0), QUESTIONS.length - 1);
  const question = QUESTIONS[index];
  const selected = useAnswers()[index];
  const advancing = useRef(false);

  const goNext = () => {
    const next = index + 2;
    router.push(next > QUESTIONS.length ? '/profile-summary' : `/quiz/${next}`);
  };

  const choose = (optionIndex: number) => {
    if (advancing.current) return;
    advancing.current = true;
    setAnswer(index, optionIndex);
    setTimeout(() => {
      goNext();
      advancing.current = false;
    }, ADVANCE_DELAY_MS);
  };

  return (
    <AuthScreen
      eyebrow={`Question ${index + 1} of ${QUESTIONS.length}`}
      title={question.question}
      showBack
      onSkip={() => {
        setAnswer(index, null);
        goNext();
      }}
    >
      <View style={styles.options} accessibilityRole="radiogroup">
        {question.options.map((option, i) => (
          <SelectionCard
            key={option.label}
            kind="tile"
            title={option.label}
            selected={selected === i}
            onPress={() => choose(i)}
          />
        ))}
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  options: { gap: 16 },
});
