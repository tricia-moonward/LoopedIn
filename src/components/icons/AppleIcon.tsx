import { View } from 'react-native';

import AppleBg from '@assets/icons/apple-bg.svg';
import AppleGlyph from '@assets/icons/apple-glyph.svg';

// Figma "apple" icon (49:1405): dark circle with the Apple glyph, 24×24.
// Layers sit at the same insets as the design (circle 6.25%, glyph 21.88%/28.13%).
export function AppleIcon() {
  return (
    <View style={{ width: 24, height: 24 }}>
      <View style={{ position: 'absolute', left: 1.5, top: 1.5 }}>
        <AppleBg width={21} height={21} />
      </View>
      <View style={{ position: 'absolute', left: 6.75, top: 5.25 }}>
        <AppleGlyph width={10.5} height={12} />
      </View>
    </View>
  );
}
