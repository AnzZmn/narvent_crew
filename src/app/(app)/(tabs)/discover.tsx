// Copy to: app/(tabs)/discover.tsx
import { Booking, DiscoverFlow, Job } from "@/components/export/expo-discover";
import { useTabOverlay } from "@/components/export/expo-tabs/TabOverlay";
import React, { useCallback, useEffect, useState } from "react";

/**
 * Not wrapped in <SwipeTabs>: horizontal drags belong to the map and the
 * card carousel here. Use the tab bar to leave this tab.
 */
export default function DiscoverTab() {
  const setOverlay = useTabOverlay();

  return (
    <DiscoverFlow
      areaLabel="near you"
      hideTabBar // the layout draws the shared bar
      onOverlayChange={setOverlay} // hides it while the job sheet is open
    />
  );
}
