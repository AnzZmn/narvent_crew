import {Easing} from 'react-native';
import type {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';

/**
 * Home ⇄ Profile switch. Both scenes stay mounted (lazy: false); only opacity/transform
 * animate, on the native driver, so the JS thread is free for the tab-bar pill spring.
 * progress: -1 = left of focused, 0 = focused, 1 = right. Home is left, Profile right.
 */
export const TAB_DURATION = 320;
const DRIFT = 36;

export const tabTransition: Pick<
  BottomTabNavigationOptions,
  'animation' | 'transitionSpec' | 'sceneStyleInterpolator'
> = {
  animation: 'shift',
  transitionSpec: {
    animation: 'timing',
    config: {duration: TAB_DURATION, easing: Easing.bezier(0.22, 0.8, 0.26, 1)},
  },
  sceneStyleInterpolator: ({current}) => ({
    sceneStyle: {
      opacity: current.progress.interpolate({
        inputRange: [-1, -0.6, 0, 0.6, 1],
        outputRange: [0, 0, 1, 0, 0],
        extrapolate: 'clamp',
      }),
      transform: [
        {translateX: current.progress.interpolate({inputRange: [-1, 0, 1], outputRange: [-DRIFT, 0, DRIFT]})},
        {scale: current.progress.interpolate({inputRange: [-1, 0, 1], outputRange: [0.985, 1, 0.985]})},
      ],
    },
  }),
};

/** Fallback when the user has Reduce Motion on. */
export const tabFade: typeof tabTransition = {
  animation: 'fade',
  transitionSpec: {animation: 'timing', config: {duration: 180, easing: Easing.out(Easing.quad)}},
};
