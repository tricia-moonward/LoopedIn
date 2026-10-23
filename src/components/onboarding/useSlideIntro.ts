import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// GSAP drives a plain object and pushes each frame into Animated.Values, which
// works the same on iOS, Android and web (GSAP can't target native views directly).
const HIDDEN = { art: 0, artY: 24, artScale: 0.94, copy: 0, copyY: 16, bar: 2 };
const SHOWN = { art: 1, artY: 0, artScale: 1, copy: 1, copyY: 0, bar: 40 };

const KEYS = Object.keys(HIDDEN) as (keyof typeof HIDDEN)[];

// Keep intros in step with the auto-advance clock even when frames drop (e.g. JS
// thread busy on launch); by default GSAP stretches time after a long frame.
gsap.ticker.lagSmoothing(0);

export type SlideIntro = Record<keyof typeof HIDDEN, Animated.Value>;

export function useSlideIntro(active: boolean, reduceMotion: boolean): SlideIntro {
  const values = useRef(
    Object.fromEntries(Object.entries(HIDDEN).map(([k, v]) => [k, new Animated.Value(v)])) as SlideIntro,
  ).current;

  useEffect(() => {
    if (!active) return;

    const state = { ...HIDDEN };
    const sync = () => {
      // Iterate our own keys: GSAP adds internal fields (e.g. _gsap) to the tweened object.
      for (const key of KEYS) values[key].setValue(state[key]);
    };

    // Start from hidden each time the slide becomes active, so it replays.
    sync();
    const tl = gsap.timeline({ onUpdate: sync });
    tl.to(state, { art: SHOWN.art, artY: SHOWN.artY, artScale: SHOWN.artScale, duration: 1.1, ease: 'power3.out' })
      .to(state, { copy: SHOWN.copy, copyY: SHOWN.copyY, duration: 0.8, ease: 'power2.out' }, 0.25)
      .to(state, { bar: SHOWN.bar, duration: 0.6, ease: 'power2.inOut' }, 0.45);

    if (reduceMotion) tl.progress(1);

    return () => {
      tl.kill();
    };
  }, [active, reduceMotion, values]);

  return values;
}
