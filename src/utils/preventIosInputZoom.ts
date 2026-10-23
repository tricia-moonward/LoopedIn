import { Platform } from 'react-native';

// iOS Safari zooms the page when focusing a text field with a font size under
// 16px (our inputs are 14px per the design). Adding maximum-scale=1 to the
// viewport stops that auto-zoom; iOS still lets people pinch-zoom regardless.
// Only applied on iOS, because on Android it would block pinch-zoom entirely.
// Native builds never auto-zoom, so this is web-only.
export function preventIosInputZoom() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
  if (!isIos) return;

  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta || meta.content.includes('maximum-scale')) return;
  meta.content = `${meta.content}, maximum-scale=1`;
}
