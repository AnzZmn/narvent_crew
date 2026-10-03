// Copy to: app/(tabs)/_layout.tsx  (replaces the two-tab layout)
import React, { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCarouselTabTransition } from "@/components/export/expo-tab-carousel/CarouselTabTransition";
import {
  TabOverlayContext,
  TabOverlayOpenContext,
} from "@/components/export/expo-tabs/TabOverlay";
import { Tab, TabBar } from "@/components/export/expo-discover";

/** route name ⇄ tab id */
const ROUTE: Record<Tab, string> = {
  home: "index",
  discover: "discover",
  profile: "profile",
};
const TAB: Record<string, Tab> = {
  index: "home",
  discover: "discover",
  profile: "profile",
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [overlay, setOverlay] = useState(false);
  const bottom = Math.max(insets.bottom, 10) + 14; // DiscoverFlow uses the same default

  const transition = useCarouselTabTransition();

  return (
    <TabOverlayContext.Provider value={setOverlay}>
      <TabOverlayOpenContext.Provider value={overlay}>
        <Tabs
          backBehavior="history"
          screenOptions={{
            headerShown: false,
            lazy: false,
            ...transition,
          }}
          tabBar={({ state, navigation }) =>
            overlay ? null : (
              <TabBar
                active={TAB[state.routes[state.index].name] ?? "home"}
                bottom={bottom}
                onChange={(t) => {
                  const name = ROUTE[t];
                  if (state.routes[state.index].name !== name)
                    navigation.navigate(name);
                }}
              />
            )
          }
        >
          {/* order = bar order: Home · Discover · Profile */}
          <Tabs.Screen name="index" />
          <Tabs.Screen name="discover" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </TabOverlayOpenContext.Provider>
    </TabOverlayContext.Provider>
  );
}
