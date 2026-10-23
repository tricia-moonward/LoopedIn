import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

import EmailIcon from '@assets/icons/email.svg';
import LogoMark from '@assets/icons/logo-mark.svg';
import { Button } from '@/components/Button';
import { PageIndicator } from '@/components/onboarding/PageIndicator';
import { slides, type OnboardingSlide } from '@/components/onboarding/slides';
import { useSlideIntro } from '@/components/onboarding/useSlideIntro';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { PaperBackground } from '@/components/PaperBackground';
import { colors, fonts, useDesignScale } from '@/theme';

const AUTO_ADVANCE_MS = 4000;

// Figma: Onboarding / "onboarding / 1–3" — a swipeable, auto-advancing carousel sharing one set of actions.
export default function OnboardingScreen() {
  const { width } = useDesignScale();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(0);
  // Bumped whenever a user swipe settles, so the auto-advance timer restarts from then.
  const [swipeCount, setSwipeCount] = useState(0);
  const autoScrolling = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => {
      const next = (index + 1) % slides.length;
      autoScrolling.current = true;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [index, swipeCount, reduceMotion, width]);

  // Track the page from the scroll offset rather than drag/momentum events, which
  // react-native-web fires differently (it reports programmatic scrolls as drags).
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    const userSwipe = !autoScrolling.current;
    // During a user swipe, switch at the halfway point so the next intro plays as it lands.
    if (userSwipe && page !== index) setIndex(page);
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      autoScrolling.current = false;
      if (userSwipe) setSwipeCount((n) => n + 1);
    }, 150);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {slides.map((slide, i) => (
          <Slide
            key={slide.key}
            slide={slide}
            index={i}
            active={i === index}
            reduceMotion={reduceMotion}
            width={width}
          />
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label="Continue with email"
          icon={<EmailIcon width={18} height={18} />}
          onPress={() => router.push('/sign-up')}
        />
      </View>
    </View>
  );
}

type SlideProps = {
  slide: OnboardingSlide;
  index: number;
  active: boolean;
  reduceMotion: boolean;
  width: number;
};

function Slide({ slide, index, active, reduceMotion, width }: SlideProps) {
  const { scale } = useDesignScale();
  const intro = useSlideIntro(active, reduceMotion);
  const artStyle = {
    opacity: intro.art,
    transform: [{ translateY: intro.artY }, { scale: intro.artScale }],
  };

  return (
    <View style={[styles.slide, { width }]}>
      <PaperBackground tint={slide.accent} />
      <Animated.View style={[StyleSheet.absoluteFill, artStyle]} pointerEvents="none">
        {slide.back}
      </Animated.View>
      <View style={[styles.logo, { top: 47 * scale }]}>
        <LogoMark width={32} height={32} accessibilityLabel="LoopedIn" />
      </View>
      <View style={styles.headlineArea} pointerEvents="none">
        <View style={styles.headlineBlock}>
          <Animated.Text
            style={[styles.headline, { opacity: intro.copy, transform: [{ translateY: intro.copyY }] }]}
          >
            {slide.headline}
            {slide.endsWithBrand && (
              <>
                {' '}
                <Text style={{ color: slide.highlight ?? slide.accent }}>LoopedIn.</Text>
              </>
            )}
          </Animated.Text>
          <PageIndicator count={slides.length} active={index} activeWidth={intro.bar} />
        </View>
      </View>
      {slide.front && (
        <Animated.View style={[StyleSheet.absoluteFill, artStyle]} pointerEvents="none">
          {slide.front}
        </Animated.View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  slide: { flex: 1, overflow: 'hidden' },
  logo: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  headlineArea: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    // Headline block sits 20pt below the vertical centre.
    paddingTop: 40,
  },
  headlineBlock: { width: 361, maxWidth: '92%', alignItems: 'center', gap: 32 },
  headline: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    color: colors.black1000,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  actions: {
    position: 'absolute',
    bottom: 39,
    alignSelf: 'center',
    width: 356,
    maxWidth: '91%',
    alignItems: 'center',
  },
});
