// Replaces: SwipeTabs.tsx (project root). Only ORDER changed.
import React, { useMemo } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { useTabOverlayOpen } from "../../expo-tabs/TabOverlay";

/**
 * Tab order, left → right. Discover sits in the middle, so a swipe from Home
 * or Profile lands on it. Discover itself is NOT wrapped in <SwipeTabs>
 * (the map needs horizontal drags), so you leave it with the tab bar.
 */
const ORDER = ["index", "discover", "profile"] as const;
type TabName = (typeof ORDER)[number];

const DISTANCE = 60;
const VELOCITY = 500;

export function SwipeTabs({
  tab,
  children,
}: {
  tab: TabName;
  children: React.ReactNode;
}) {
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
        .onEnd((e) => {
          "worklet";
          const left = e.translationX < -DISTANCE || e.velocityX < -VELOCITY;
          const right = e.translationX > DISTANCE || e.velocityX > VELOCITY;
          if (left && next) runOnJS(go)(next);
          else if (right && prev) runOnJS(go)(prev);
        }),
    [overlayOpen, prev, next],
  );

  return (
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1 }} collapsable={false}>
        {children}
      </View>
    </GestureDetector>
  );
}
