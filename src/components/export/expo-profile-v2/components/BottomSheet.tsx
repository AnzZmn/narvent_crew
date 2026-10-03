import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, EASE, SLIDE_MS, useGlass } from "./theme";

type Props = { open: boolean; onClose: () => void; children: React.ReactNode };

/**
 * Inset bottom sheet with a dimmed backdrop. Tap outside or Android back to close.
 * Stays mounted until the close animation finishes.
 */
export default function BottomSheet({ open, onClose, children }: Props) {
  const insets = useSafeAreaInsets();
  const glass = useGlass();
  const a = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
    else if (mounted)
      Animated.timing(a, {
        toValue: 0,
        duration: 300,
        easing: EASE,
        useNativeDriver: true,
      }).start(({ finished }) => finished && setMounted(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    if (open && mounted)
      Animated.timing(a, {
        toValue: 1,
        duration: SLIDE_MS,
        easing: EASE,
        useNativeDriver: true,
      }).start();
  }, [open, mounted, a]);
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [open, onClose]);

  if (!mounted) return null;
  const translateY = a.interpolate({
    inputRange: [0, 1],
    outputRange: [800, 0],
  });

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.layer]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: a }]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close"
        />
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kav}
        pointerEvents="box-none"
      >
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { marginBottom: 8 + insets.bottom, transform: [{ translateY }] },
            glass ? styles.glass : styles.flat,
          ]}
        >
          {glass ? (
            <View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, styles.clip]}
            >
              <BlurView
                intensity={80}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
              <View style={[StyleSheet.absoluteFill, styles.wash]} />
            </View>
          ) : null}
          <View style={styles.grabber} />
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { zIndex: 20 },
  backdrop: { backgroundColor: "rgba(14,14,20,0.32)" },
  kav: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 8 },
  sheet: {
    maxHeight: "88%",
    borderRadius: 26,
    borderWidth: 1,
    paddingTop: 10,
    shadowColor: "#3C288C",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -10 },
    elevation: 12,
  },
  glass: { borderColor: "rgba(255,255,255,0.8)" },
  flat: { backgroundColor: C.white, borderColor: C.flatLine },
  clip: { borderRadius: 25, overflow: "hidden" },
  wash: { backgroundColor: "rgba(255,255,255,0.84)" },
  grabber: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(14,14,20,0.15)",
  },
  content: { paddingHorizontal: 16, paddingBottom: 16 },
});
