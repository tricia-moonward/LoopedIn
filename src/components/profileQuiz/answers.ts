import { useSyncExternalStore } from 'react';

// Answers to the profile questions, kept in memory for this session so the
// summary screen can play them back. Index = question number - 1; null = skipped.
let answers: (number | null)[] = [];
const listeners = new Set<() => void>();

export function setAnswer(questionIndex: number, optionIndex: number | null) {
  answers = [...answers];
  answers[questionIndex] = optionIndex;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAnswers() {
  return useSyncExternalStore(subscribe, () => answers);
}
