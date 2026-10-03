import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TabOverlayContext,
  TabOverlayOpenContext,
} from "@/components/export/expo-tabs/TabOverlay";

import { TabBar } from "@/components/export/expo-my-profile";
import { useCarouselTabTransition } from "@/components/export/expo-tab-carousel/CarouselTabTransition";

/**
 * One TabBar for both tabs. Tab screens stay mounted, so switching doesn't rebuild the
 * page, and the highlight spring runs to completion.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [overlay, setOverlay] = useState(false);
  const bottom = Math.max(insets.bottom, 10) + 14;
  const transition = useCarouselTabTransition();

  return (
    <TabOverlayContext.Provider value={setOverlay}>
      <TabOverlayOpenContext.Provider value={overlay}>
        <Tabs
          backBehavior="history"
          screenOptions={{
            headerShown: false,
            lazy: false, // mount Profile up front so the first switch is instant
            ...transition,
          }}
          tabBar={({ state, navigation }) =>
            overlay ? null : (
              <TabBar
                active={
                  state.routes[state.index].name === "profile"
                    ? "profile"
                    : "home"
                }
                bottom={bottom}
                onChange={(t) => {
                  const name = t === "profile" ? "profile" : "index";
                  if (state.routes[state.index].name !== name)
                    navigation.navigate(name);
                }}
              />
            )
          }
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </TabOverlayOpenContext.Provider>
    </TabOverlayContext.Provider>
  );
}
