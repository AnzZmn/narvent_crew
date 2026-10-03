import {useEffect, useState} from 'react';
import {AccessibilityInfo, Easing} from 'react-native';
import type {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';

/**
 * Tab change animation for Worker Home ⇄ My Profile.
 *
 * Fade-through: the outgoing screen drifts toward its own tab and fades out first, then
 * the incoming one settles in from the opposite side. They never overlap translucently. Only opacity/transform animate, on the native
 * driver, so the tab-bar pill spring stays smooth.
 *
 * progress: -1 = left of the focused tab, 0 = focused, 1 = right of it.
 * With Home first and Profile second, direction always matches tab order.
 */

export type TabAnimMode = 'slide' | 'fade' | 'none';

type TransitionOptions = Pick<
  BottomTabNavigationOptions,
  'animation' | 'transitionSpec' | 'sceneStyleInterpolator'
>;

export const TAB_EASING = Easing.bezier(0.22, 0.8, 0.26, 1);

export function makeTabTransition(
  mode: TabAnimMode = 'slide',
  {duration = 320, drift = 36, scale = 0.985}: {duration?: number; drift?: number; scale?: number} = {},
): TransitionOptions {
  if (mode === 'none') return {animation: 'none'};

  // Both modes fade *through* the background: outgoing is gone by 40%, incoming starts after.
  const opacity = (p: any) =>
    p.interpolate({inputRange: [-1, -0.6, 0, 0.6, 1], outputRange: [0, 0, 1, 0, 0], extrapolate: 'clamp'});

  if (mode === 'fade') {
    return {
      animation: 'fade',
      transitionSpec: {animation: 'timing', config: {duration: Math.round(duration * 0.7), easing: TAB_EASING}},
      sceneStyleInterpolator: ({current}) => ({sceneStyle: {opacity: opacity(current.progress)}}),
    };
  }

  return {
    animation: 'shift',
    transitionSpec: {animation: 'timing', config: {duration, easing: TAB_EASING}},
    // Fade-through: the outgoing scene is fully gone by 40% of the transition and the
    // incoming one only appears after it, so the two never overlap half-transparent
    // (overlapping BlurView / glass cards otherwise flash as empty "skeleton" frames).
    sceneStyleInterpolator: ({current}) => ({
      sceneStyle: {
        opacity: opacity(current.progress),
        transform: [
          {translateX: current.progress.interpolate({inputRange: [-1, 0, 1], outputRange: [-drift, 0, drift]})},
          {scale: current.progress.interpolate({inputRange: [-1, 0, 1], outputRange: [scale, 1, scale]})},
        ],
      },
    }),
  };
}

/** Slide by default; falls back to a short fade when the OS Reduce Motion setting is on. */
export function useTabTransition(
  mode: TabAnimMode = 'slide',
  opts?: Parameters<typeof makeTabTransition>[1],
): TransitionOptions {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);
  return makeTabTransition(reduceMotion && mode === 'slide' ? 'fade' : mode, opts);
}
