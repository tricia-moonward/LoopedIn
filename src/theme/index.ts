import { useWindowDimensions } from 'react-native';

// Tokens from the Looped In Figma file.
export const colors = {
  black1000: '#252525',
  black800: 'rgba(37,37,37,0.8)',
  black600: 'rgba(37,37,37,0.6)',
  black400: 'rgba(37,37,37,0.4)',
  black200: 'rgba(37,37,37,0.2)',
  black100: 'rgba(37,37,37,0.1)',
  charcoal100: '#282828',
  charcoal60: 'rgba(40,40,40,0.6)',
  // Track of the Switch in its off state.
  toggleOff: '#F2F2F2',
  white: '#FFFFFF',
  splashBackground: '#202020',
  accentRed: '#FF4824',
  // 10% red behind a text field in its error state.
  errorFill: 'rgba(255,72,36,0.1)',
  accentBlue: '#78CBFF',
  // Darker blue for the "LoopedIn." highlight text, which needs more contrast than the gradient tint.
  accentBlueText: '#16A4FD',
  accentPurple: '#8309D6',
  accentLime: '#D1ED40',
  // Darker lime for text on light backgrounds ("Let's build your profile").
  accentLimeText: '#98B115',
};

export const fonts = {
  serif: 'PTSerif_400Regular',
  sansRegular: 'Mulish_400Regular',
  sansMedium: 'Mulish_500Medium',
  sansSemiBold: 'Mulish_600SemiBold',
  sansBold: 'Mulish_700Bold',
  sansExtraBold: 'Mulish_800ExtraBold',
};

// Frames are drawn at 393 × 852 (iPhone 15/16). Decorative artwork is placed in
// design points and scaled by screen width so it keeps its composition.
export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

export function useDesignScale() {
  const { width, height } = useWindowDimensions();
  return { scale: width / DESIGN_WIDTH, width, height };
}
