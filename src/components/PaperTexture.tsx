import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

const paper = require('@assets/images/paper-texture.webp');

// Figma "Background / Paper Texture", stretched over the whole of its parent: put it inside a
// ScrollView's content to cover the full page, however long. Its 40% opacity is baked into the
// image, and it's multiplied so it darkens the header art underneath rather than washing it out.
export function PaperTexture() {
  return (
    <Image
      source={paper}
      contentFit="cover"
      contentPosition="top"
      pointerEvents="none"
      style={styles.texture}
    />
  );
}

const styles = StyleSheet.create({
  texture: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, mixBlendMode: 'multiply' },
});
