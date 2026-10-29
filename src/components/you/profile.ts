import { colors } from '@/theme';

export type ProfileRow = {
  label: string;
  value: string;
  background: string;
  color: string;
};

export type ProfileSection = {
  title: string;
  rows: ProfileRow[];
  // Shown when the card is open, one paragraph per entry.
  about: string[];
};

// Badges cycle purple, red, lime down each card, as in the design.
const BADGES = [
  { background: colors.accentPurple, color: colors.white },
  { background: colors.accentRed, color: colors.white },
  { background: colors.accentLime, color: colors.black1000 },
];

const rows = (pairs: [string, string][]): ProfileRow[] =>
  pairs.map(([label, value], index) => ({ label, value, ...BADGES[index % BADGES.length] }));

// Prototype data from the Figma You tab (187:5059). Only the first card's "about" copy is
// designed; the other two are placeholder.
export const PROFILE_SECTIONS: ProfileSection[] = [
  {
    title: 'HOW YOU FEEL LOVED',
    rows: rows([
      ['LOVE LANGUAGES', 'WORDS OF AFFIRMATION'],
      ['ATTACHMENT', 'SECURE, REASSURANCE-SEEKING'],
      ['HOW YOU BID', 'OUT LOUD'],
    ]),
    about: [
      'You run on words. You say what you need, and you feel loved when people say it back. Specific beats grand.',
      'Silence unsettles you more than conflict does. You’re secure overall, but you wobble when you don’t know where you stand.',
      'Watch for: giving love the way you want it, and missing the quiet ways other people show care.',
      'For the people close to you: say it, even when it feels obvious.',
    ],
  },
  {
    title: 'HOW YOU COMMUNICATE',
    rows: rows([
      ['COMMUNICATION', 'DIRECT, IN-PERSON'],
      ['SOCIAL ENERGY', 'HIGH EXTRAVERSION'],
    ]),
    about: [
      'You’d rather say it face to face than over text, and you say it plainly. People usually know where they stand with you.',
      'Time with people fills you up. A quiet week can leave you flat.',
      'Watch for: filling the silence before the quieter people around you have had their say.',
    ],
  },
  {
    title: 'HOW YOU FIGHT',
    rows: rows([
      ['CONFLICT APPROACH', 'COLLABORATING'],
      ['CONFLICT PATTERN', 'PURSUE'],
      ['REPAIR', 'A SINCERE APOLOGY'],
    ]),
    about: [
      'You want to sort things out together, and you want to do it now. Leaving it unresolved is harder for you than the argument.',
      'Watch for: pushing for an answer when the other person needs a little time first.',
      'What helps you move on: a sincere apology that names what went wrong.',
    ],
  },
];

// "Your patterns", from the last 30 days of check-ins. Prototype data from the design.
export const PATTERNS = {
  emotions: [
    { label: 'Pleasant', count: 14, background: colors.accentLime, color: colors.black1000 },
    { label: 'Neutral', count: 10, background: colors.accentBlue, color: colors.black1000 },
    { label: 'Unpleasant', count: 5, background: colors.accentRed, color: colors.white },
  ],
  trend: 'Mostly pleasant at weekends, lower on workdays.',
  mostLogged: ['BIG DAY AT WORK', 'HANGING OUT', 'CELEBRATING'],
  insights: [
    {
      direction: 'down' as const,
      title: 'Big days at work are marked as unpleasant',
      body: 'You’ve marked your last 4 big work days together with an unpleasant feeling over the last 30 days.',
    },
    {
      direction: 'up' as const,
      title: 'Time out with friends are marked as pleasant',
      body: 'Your last 3 times out with friends were marked with a pleasant feeling over the last 30 days.',
    },
  ],
};
