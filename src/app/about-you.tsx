import { router, useLocalSearchParams } from 'expo-router';

import { Artwork } from '@/components/Artwork';
import { IntroScreen } from '@/components/IntroScreen';
import { colors } from '@/theme';

// Exported from Figma with the dither (and bloom on the lily) baked in.
const mirror = require('@assets/images/mirror.png');
const lily = require('@assets/images/lily.png');

// Figma: Onboarding / "onboarding / 4" (53:3659)
export default function AboutYouScreen() {
  const { firstName } = useLocalSearchParams<{ firstName?: string }>();

  return (
    <IntroScreen
      tint={colors.accentRed}
      lead={firstName ? `Hi ${firstName},` : 'Hi there,'}
      leadColor={colors.accentRed}
      title="Tell us a little bit more about you."
      body="We’ll create a unique experience just for you. These are optional fields and you can change them at any time."
      artwork={
        <>
          {/* Rotated mirror's bounding box (image already rotated 25.37°). */}
          <Artwork source={mirror} x={-19} y={32} width={194.578} height={240.662} />
          <Artwork source={lily} x={134} y={520} width={459} height={424} />
        </>
      }
      onContinue={() => router.push('/goals')}
    />
  );
}
