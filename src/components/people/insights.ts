import type { ImageSource } from 'expo-image';

export type ConnectionTab = 'overview' | 'love' | 'communication' | 'conflict';

export const CONNECTION_TABS: { key: ConnectionTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'love', label: 'Love' },
  { key: 'communication', label: 'Communication' },
  { key: 'conflict', label: 'Conflict' },
];

export type Comparison = {
  title: string;
  // Framework the result comes from, shown top right ("Love Languages").
  category: string;
  you: string;
  them: string;
  // Shown when the card is expanded (Figma "Cards" State=expanded, 118:1803).
  together: string;
};

type TabContent = {
  heading: string;
  artwork: { source: ImageSource | number; width: number; height: number; rotate?: string };
  cards: Comparison[];
};

// Figma: view connection / people — Love (112:4004), Communication (125:1353), Conflict (125:1620).
// Only the first "Together" line is designed; the others are placeholder copy.
export const TAB_CONTENT: Record<Exclude<ConnectionTab, 'overview'>, TabContent> = {
  love: {
    heading: 'How You Love Each Other',
    artwork: { source: require('@assets/images/statue-embrace.png'), width: 135, height: 171 },
    cards: [
      {
        title: 'HOW YOU FEEL LOVED',
        category: 'Love Languages',
        you: 'WORDS OF AFFIRMATION',
        them: 'PHYSICAL TOUCH',
        together: 'You’re both affectionate in different ways. Pair your words with a hug.',
      },
      {
        title: 'ATTACHMENT STYLE',
        category: 'Attachment Theory',
        you: 'SECURE, REASSURANCE-SEEKING',
        them: 'SECURE, INDEPENDENCE-LEARNING',
        together: 'You both feel safe with each other. Say when you need a check-in, and give them room when they need it.',
      },
      {
        title: 'EVERYDAY CONNECTION',
        category: 'Gottman Research',
        you: 'YOU BID OUT LOUD',
        them: 'THEY BID QUIETLY',
        together: 'Their bids for attention are easy to miss. Watch for the small moments they reach for you.',
      },
    ],
  },
  communication: {
    heading: 'How You Communicate',
    artwork: { source: require('@assets/images/bulb.png'), width: 100.319, height: 137.368, rotate: '-2.37deg' },
    cards: [
      {
        title: 'COMMUNICATION STYLE',
        category: 'DISC',
        you: 'INFLUENCE',
        them: 'STEADINESS',
        together: 'You bring the spark, they bring the calm. Slow down when it matters and let them catch up.',
      },
      {
        title: 'SOCIAL ARCHITYPE',
        category: 'Social Styles',
        you: 'EXPRESSIVE',
        them: 'AMIABLE',
        together: 'You both care about how the other feels. Ask what they think before you fill the silence.',
      },
      {
        title: 'PERSONALITY',
        category: 'Big Five',
        you: 'HIGH EXTRAVERSION',
        them: 'LOW EXTRAVERSION',
        together: 'Big nights out recharge you and drain them. Balance them with quieter plans.',
      },
    ],
  },
  conflict: {
    heading: 'How You Fight',
    artwork: { source: require('@assets/images/mouth.png'), width: 129, height: 129 },
    cards: [
      {
        title: 'CONFLICT APPROACH',
        category: 'Conflict Modes',
        you: 'COLLABORATING',
        them: 'ACCOMMODATING',
        together: 'They may give in to keep the peace. Check they’ve actually had their say.',
      },
      {
        title: 'CONFLICT PATTERN',
        category: 'Pursue-Withdraw',
        you: 'PURSUE',
        them: 'WITHDRAW',
        together: 'The more you push, the more they pull back. Agree on a time to come back to it.',
      },
    ],
  },
};
