import type { ReactNode } from 'react';

import { Artwork } from '@/components/Artwork';
import { colors } from '@/theme';

export type OnboardingSlide = {
  key: string;
  headline: string;
  // Whether the headline ends with a coloured "LoopedIn.".
  endsWithBrand: boolean;
  // Background gradient tint, and the "LoopedIn." highlight colour unless `highlight` is set.
  accent: string;
  highlight?: string;
  // Artwork behind the headline, and artwork layered above it.
  back: ReactNode;
  front?: ReactNode;
};

// Exported from Figma with the dither + bloom effects (and rotation/opacity) baked in.
const lily = require('@assets/images/lily.png');
const hands = require('@assets/images/hands.png');
const chain = require('@assets/images/chain.png');
const flower = require('@assets/images/flower.png');

export const slides: OnboardingSlide[] = [
  // Figma: "onboarding / 1" (48:155)
  {
    key: 'connected',
    headline: 'Understand how you and the people you love really work together.',
    endsWithBrand: false,
    accent: colors.accentRed,
    back: (
      <>
        <Artwork source={lily} x={-138} y={77} width={307} height={284} />
        <Artwork source={lily} x={117} y={470} width={552} height={511} />
      </>
    ),
  },
  // Figma: "onboarding / 2" (48:172) — exported at full-screen size.
  {
    key: 'two-minutes',
    headline: '2 minutes a day is all it takes when you use',
    endsWithBrand: true,
    accent: colors.accentBlue,
    highlight: colors.accentBlueText,
    back: <Artwork source={hands} x={0} y={0} width={393} height={827} />,
  },
  // Figma: "onboarding / 3" (48:188)
  {
    key: 'little-things',
    headline: 'Notice the little things together with',
    endsWithBrand: true,
    accent: colors.accentPurple,
    back: (
      <>
        {/* Rotated chain's bounding box, centred where the unrotated frame was. */}
        <Artwork source={chain} x={-82.1} y={277} width={182.5} height={216.5} />
        <Artwork source={flower} x={159} y={524} width={186} height={187} />
      </>
    ),
    front: <Artwork source={flower} x={211} y={25} width={288} height={290} />,
  },
];
