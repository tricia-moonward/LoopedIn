import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { useDesignScale } from '@/theme';

// Dithered, purple-tinted sky (a shader effect in Figma, exported flat as it renders).
const sky = require('@assets/images/check-in-sky.png');
const paper = require('@assets/images/paper-texture.png');
const tornPaper = require('@assets/images/torn-paper.png');

type CheckInBackgroundProps = {
  // How far the page has moved up where the status bar is shorter than Figma's 59.
  lift: number;
  // Height of the paper texture, which runs the length of the page.
  paperHeight: number;
};

// Shared backdrop of the check-in screens (Figma 173:2247, 169:2191): the sky under the
// heading, paper texture, and a torn paper edge where the sky ends.
export function CheckInBackground({ lift, paperHeight }: CheckInBackgroundProps) {
  const { scale } = useDesignScale();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={sky}
        contentFit="cover"
        style={{ position: 'absolute', left: 0, top: -lift, width: 393 * scale, height: 482 * scale }}
      />
      <Image
        source={paper}
        contentFit="cover"
        style={[
          styles.paper,
          { left: -291 * scale, top: -30 * scale - lift, width: 1043 * scale, height: paperHeight * scale },
        ]}
      />
      {/* Torn edge, rotated 82° as in Figma. */}
      <View
        style={[
          styles.centred,
          { left: -63.29 * scale, top: 316.26 * scale - lift, width: 553.741 * scale, height: 358.589 * scale },
        ]}
      >
        <Image
          source={tornPaper}
          contentFit="cover"
          style={{ width: 292.387 * scale, height: 519.613 * scale, transform: [{ rotate: '82.39deg' }] }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: { position: 'absolute', opacity: 0.4, mixBlendMode: 'multiply' },
  centred: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
