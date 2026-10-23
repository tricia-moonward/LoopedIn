import { Image, type ImageSource } from 'expo-image';

import { useDesignScale } from '@/theme';

type ArtworkProps = {
  source: ImageSource | number;
  // Frame in design points (393-wide artboard).
  x: number;
  y: number;
  width: number;
  height: number;
};

// A decorative image layer positioned in design coordinates and scaled to screen width.
// The Figma dither/bloom effects are baked into the exported PNGs, so images render as-is.
export function Artwork({ source, x, y, width, height }: ArtworkProps) {
  const { scale } = useDesignScale();
  return (
    <Image
      source={source}
      contentFit="contain"
      style={{ position: 'absolute', left: x * scale, top: y * scale, width: width * scale, height: height * scale }}
    />
  );
}
