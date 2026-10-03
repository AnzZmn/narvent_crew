import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import ScreenBackground from "./ScreenBackground";
import { EASE, SLIDE_MS } from "./theme";

type Props = { open: boolean; onBack: () => void; children: React.ReactNode };

/**
 * Full-screen page that slides in from the right over the profile (iOS push curve).
 * Children mount on open and unmount after the slide-out. Handles Android back.
 */
export default function SlidePage({ open, onBack, children }: Props) {
  const { width } = useWindowDimensions();
  const x = useRef(new Animated.Value(width)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
    else if (mounted)
      Animated.timing(x, {
        toValue: width,
        duration: SLIDE_MS,
        easing: EASE,
        useNativeDriver: true,
      }).start(({ finished }) => finished && setMounted(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    if (open && mounted)
      Animated.timing(x, {
        toValue: 0,
        duration: SLIDE_MS,
        easing: EASE,
        useNativeDriver: true,
      }).start();
  }, [open, mounted, x]);
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [open, onBack]);

  if (!mounted) return null;
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.page,
        { transform: [{ translateX: x }] },
      ]}
    >
      <ScreenBackground />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  page: {
    zIndex: 10,
    shadowColor: "#3C288C",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: -20, height: 0 },
    elevation: 16,
  },
});
