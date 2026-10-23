import { useAnswers } from '@/components/profileQuiz/answers';

export type Profile = {
  // "About You" summary headline and description.
  title: string;
  body: string;
  // One paragraph for the "What we've learnt about you" card on Home.
  home: string;
};

// Keyed off the first question (how you feel loved). Only the "kind words" copy is
// from the design; the rest is placeholder.
const PROFILES: Profile[] = [
  {
    title: 'You feel closest when things are said out loud.',
    body: 'Kind words, honest conversations and being properly heard matter more to you than grand gestures. When something’s off, you’d rather talk it through now than let it sit.',
    home: 'You feel closest when things are said out loud. Kind words and honest conversations matter more to you than grand gestures, and when something’s off, you’d rather talk it through straight away.',
  },
  {
    title: 'You feel closest when love shows up in what you do.',
    body: 'Small, thoughtful actions speak louder to you than big declarations. Being looked after in practical ways is how you know you matter.',
    home: 'You feel closest when love shows up in what people do. Small, thoughtful actions speak louder to you than big declarations.',
  },
];

const DEFAULT_PROFILE: Profile = {
  title: 'Here’s what we know so far.',
  body: 'We’ll keep learning as you use LoopedIn. You can update any of these at any time.',
  home: 'Answer a few more questions and we’ll start to build a picture of what matters to you.',
};

export function useProfile(): Profile {
  const answers = useAnswers();
  return PROFILES[answers[0] ?? -1] ?? DEFAULT_PROFILE;
}
