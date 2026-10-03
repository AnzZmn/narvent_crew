import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Settings, { SettingsProps } from "./Settings";
import { SLIDE_MS } from "./theme";

export type SettingsCarouselProps = {
  /** true → Settings slides in from the left, Home slides out to the right */
  open: boolean;
  onClose: () => void;
  /** the Home screen (e.g. <WorkerHomeFlow …/>) */
  children: React.ReactNode;
  settings?: Omit<SettingsProps, "onBack" | "active">;
  duration?: number;
  /** fires after the slide settles */
  onTransitionEnd?: (open: boolean) => void;
};

/**
 * Two panes on one track, moved together with the native driver:
 *   closed: [Settings −W] [Home 0]
 *   open:   [Settings 0]  [Home +W]
 * Settings mounts on first open and stays mounted, so later opens are instant.
 */
export default function SettingsCarousel({
  open,
  onClose,
  children,
  settings,
  duration = SLIDE_MS,
  onTransitionEnd,
}: SettingsCarouselProps) {
  const { width } = useWindowDimensions();
  const p = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
    const anim = Animated.timing(p, {
      toValue: open ? 1 : 0,
      duration,
      easing: Easing.bezier(0.22, 0.8, 0.26, 1),
      useNativeDriver: true,
    });
    anim.start(({ finished }) => finished && onTransitionEnd?.(open));
    return () => anim.stop();
  }, [open, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  const homeX = p.interpolate({ inputRange: [0, 1], outputRange: [0, width] });
  const setX = p.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] });

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX: homeX }] },
        ]}
        pointerEvents={open ? "none" : "auto"}
        importantForAccessibility={open ? "no-hide-descendants" : "auto"}
        accessibilityElementsHidden={open}
      >
        {children}
      </Animated.View>
      {mounted && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.settings,
            { transform: [{ translateX: setX }] },
          ]}
          pointerEvents={open ? "auto" : "none"}
          importantForAccessibility={open ? "auto" : "no-hide-descendants"}
          accessibilityElementsHidden={!open}
          accessibilityViewIsModal={open}
        >
          <Settings {...settings} onBack={onClose} active={open} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
  settings: { zIndex: 6 },
});
