import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { ChatIcon } from "./icons";
import { useGlass } from "./theme";

type Props = { bottom: number; onPress?: () => void };

/** Floating chat button, pinned bottom-right beside the tab bar. */
export default function ChatFab({ bottom, onPress }: Props) {
  const glass = useGlass();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Chat"
      style={({ pressed }) => [
        styles.wrap,
        { bottom },
        pressed && styles.pressed,
      ]}
    >
      {glass ? (
        <BlurView
          intensity={60}
          tint="light"
          style={[styles.circle, styles.glass]}
        >
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.glassFill]}
          />
          <ChatIcon />
        </BlurView>
      ) : (
        <View style={[styles.circle, styles.flat]}>
          <ChatIcon />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: 16,
    zIndex: 6,
    backgroundColor: "#000000",
  },
  pressed: { transform: [{ translateY: -2 }] },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  glass: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
  },
  glassFill: { backgroundColor: "rgba(255,255,255,0.6)" },
  flat: {
    backgroundColor: "#FFFFFF",
    elevation: 6,
    shadowColor: "#3C288C",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
});
