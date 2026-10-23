import { colors } from '@/theme';

export type Trait =
  | 'Feeling Loved'
  | 'Conflict Style'
  | 'Repair Style'
  | 'Support Style'
  | 'Communication Style'
  | 'Appreciation Style'
  | 'Social Energy'
  | 'Values';

const RED = { background: colors.accentRed, text: colors.white };
const LIME = { background: colors.accentLime, text: colors.black1000 };
const PURPLE = { background: colors.accentPurple, text: colors.white };
const BLUE = { background: colors.accentBlue, text: colors.black1000 };

// Tag colours on the "About You" summary (Figma 53:4521).
export const TRAIT_COLORS: Record<Trait, { background: string; text: string }> = {
  'Feeling Loved': RED,
  'Conflict Style': LIME,
  'Repair Style': LIME,
  'Support Style': PURPLE,
  'Communication Style': BLUE,
  'Appreciation Style': RED,
  'Social Energy': BLUE,
  Values: RED,
};

export type QuizOption = {
  label: string;
  // How the answer reads on the summary, when it differs from the option text.
  summary?: string;
};

export type QuizQuestion = {
  question: string;
  options: QuizOption[];
  // Row on the summary screen.
  summaryLabel: string;
  trait: Trait;
};

// Figma: Onboarding / "profile / q1" … "profile / q8" (53:3767 … 53:4303), in order.
export const QUESTIONS: QuizQuestion[] = [
  {
    question: 'After a long week, which would mean more?',
    options: [
      { label: 'Hearing someone say how proud they are of me', summary: 'Kind words, said out loud' },
      { label: 'Someone quietly taking a job off my plate', summary: 'A helping hand' },
    ],
    summaryLabel: 'How you feel loved',
    trait: 'Feeling Loved',
  },
  {
    question: 'When someone close to me and I disagree, I tend to...',
    options: [
      { label: 'Want to talk it out straight away', summary: 'Talk it out straight away' },
      { label: 'Need space first' },
      { label: 'Go quiet' },
      { label: 'Get heated, then calm down after some time' },
    ],
    summaryLabel: 'When things get tense',
    trait: 'Conflict Style',
  },
  {
    question: 'After a disagreement, what helps me feel okay again?',
    options: [
      { label: 'A sincere apology' },
      { label: 'A hug' },
      { label: 'Time alone' },
      { label: 'Doing something normal together' },
    ],
    summaryLabel: 'What helps you reset',
    trait: 'Repair Style',
  },
  {
    question: 'On a rough day, I want the people close to me to...',
    options: [
      { label: 'Listen without fixing', summary: 'Listen, don’t fix' },
      { label: 'Help me solve my problems', summary: 'Help me solve it' },
      { label: 'Distract me' },
      { label: 'Give me space' },
    ],
    summaryLabel: 'On a rough day',
    trait: 'Support Style',
  },
  {
    question: 'I prefer to have big conversations...',
    options: [{ label: 'In person' }, { label: 'Over text first' }, { label: 'On a walk' }, { label: 'With a heads-up' }],
    summaryLabel: 'Big conversations',
    trait: 'Communication Style',
  },
  {
    question: 'I feel appreciated when...',
    options: [
      { label: 'I’m thanked in front of others', summary: 'Out loud, in front of others' },
      { label: 'I’m thanked one-on-one', summary: 'Quietly, one-on-one' },
      { label: 'I’m surprised with a gift or a plan', summary: 'With a surprise' },
    ],
    summaryLabel: 'Feeling appreciated',
    trait: 'Appreciation Style',
  },
  {
    question: 'My ideal free evening is spent...',
    options: [
      { label: 'Out with people' },
      { label: 'Staying cosy at home' },
      { label: 'Doing something active' },
      { label: 'A bit of everything' },
    ],
    summaryLabel: 'How you recharge',
    trait: 'Social Energy',
  },
  {
    question: 'I value this most in my relationships',
    options: [{ label: 'Trust' }, { label: 'Fun' }, { label: 'Growth' }, { label: 'Stability' }],
    summaryLabel: 'What matters most',
    trait: 'Values',
  },
];
