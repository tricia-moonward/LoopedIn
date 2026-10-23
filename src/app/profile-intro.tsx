import { router } from 'expo-router';

import { Artwork } from '@/components/Artwork';
import { IntroScreen } from '@/components/IntroScreen';
import { colors } from '@/theme';

// Exported from Figma with the dither and 30% opacity baked in.
const statue = require('@assets/images/statue-lime.png');

// Figma: Onboarding / "onboarding / 5" (53:3728)
export default function ProfileIntroScreen() {
  return (
    <IntroScreen
      tint={colors.accentLime}
      lead="Let’s build your profile"
      leadColor={colors.accentLimeText}
      title="The more we know, the better we can help"
      body="We’ll ask you a few questions to start building your profile. There are no right answers, just go with your gut. Your answers are private, and you choose what others see."
      artwork={<Artwork source={statue} x={81} y={94} width={468} height={786} />}
      onContinue={() => router.push('/quiz/1')}
    />
  );
}
