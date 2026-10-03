import React, {useMemo} from 'react';
import {View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {useNavigation} from 'expo-router';
import {useTabOverlayOpen} from './TabOverlay';

/** Tab order, left → right. Swipe left goes to the next tab, swipe right to the previous one. */
const ORDER = ['index', 'profile'] as const;
type TabName = (typeof ORDER)[number];

const DISTANCE = 60; // px of horizontal travel to count as a swipe
const VELOCITY = 500; // or a quick flick

/**
 * Wrap a tab screen's content. Only claims clearly horizontal drags
 * (activeOffsetX / failOffsetY), so vertical scrolling is unaffected.
 * Disabled while a detail / Settings screen is open over the tab.
 */
export function SwipeTabs({tab, children}: {tab: TabName; children: React.ReactNode}) {
  const navigation = useNavigation<any>();
  const overlayOpen = useTabOverlayOpen();
  const i = ORDER.indexOf(tab);
  const prev = ORDER[i - 1];
  const next = ORDER[i + 1];

  const go = (name: TabName) => navigation.navigate(name);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!overlayOpen)
        .activeOffsetX([-20, 20])
        .failOffsetY([-14, 14])
        .onEnd(e => {
          'worklet';
          const left = e.translationX < -DISTANCE || e.velocityX < -VELOCITY;
          const right = e.translationX > DISTANCE || e.velocityX > VELOCITY;
          if (left && next) runOnJS(go)(next);
          else if (right && prev) runOnJS(go)(prev);
        }),
    [overlayOpen, prev, next],
  );

  return (
    <GestureDetector gesture={pan}>
      <View style={{flex: 1}} collapsable={false}>
        {children}
      </View>
    </GestureDetector>
  );
}
