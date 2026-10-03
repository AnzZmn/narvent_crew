import {useEffect, useMemo, useState} from 'react';
import {AccessibilityInfo, Easing, StyleSheet, View, useWindowDimensions} from 'react-native';
import type {ReactNode} from 'react';
import type {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';

/**
 * Carousel tab switch: the incoming tab slides in from its side while the outgoing tab
 * slides out the opposite side, both moving together. Tab order decides direction:
 * Home (left) → Profile (right) means Profile enters from the right and Home exits left,
 * and the reverse on the way back.
 *
 * progress: -1 = left of the focused tab, 0 = focused, 1 = right of it.
 * Runs on the native driver (transform only), so the JS thread stays free.
 */
export const CAROUSEL_DURATION = 380;
const EASING = Easing.bezier(0.32, 0.72, 0, 1);

type TransitionOptions = Pick<
  BottomTabNavigationOptions,
  'animation' | 'transitionSpec' | 'sceneStyleInterpolator'
>;

/** Build the options for a given screen width. Prefer the hook below inside components. */
export function carouselTabTransition(width: number, duration = CAROUSEL_DURATION): TransitionOptions {
  return {
    animation: 'shift',
    transitionSpec: {animation: 'timing', config: {duration, easing: EASING}},
    sceneStyleInterpolator: ({current}) => ({
      sceneStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [-width, 0, width],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    }),
  };
}

/** Short cross-fade used when the user has Reduce Motion turned on. */
export const carouselReducedMotion: TransitionOptions = {
  animation: 'fade',
  transitionSpec: {animation: 'timing', config: {duration: 180, easing: Easing.out(Easing.quad)}},
};

/**
 * Hook for (tabs)/_layout.tsx. Tracks window width (rotation, split view) and Reduce Motion.
 *   const transition = useCarouselTabTransition();
 *   <Tabs screenOptions={{ ...transition, lazy: false }} />
 */
export function useCarouselTabTransition(duration = CAROUSEL_DURATION): TransitionOptions {
  const {width} = useWindowDimensions();
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);

  return useMemo(
    () => (reduce ? carouselReducedMotion : carouselTabTransition(width, duration)),
    [reduce, width, duration],
  );
}

/**
 * Optional: wrap each tab screen's content so the sliding scene paints an opaque
 * background edge-to-edge (prevents a see-through seam between the two tabs mid-slide).
 */
export function CarouselScene({children, background = '#F4F4F2'}: {children: ReactNode; background?: string}) {
  return <View style={[styles.scene, {backgroundColor: background}]}>{children}</View>;
}

const styles = StyleSheet.create({
  scene: {flex: 1, overflow: 'hidden'},
});
