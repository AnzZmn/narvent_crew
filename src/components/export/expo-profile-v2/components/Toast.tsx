import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, font } from "./theme";

/** Dark pill under the header. Pass null to fade it out. */
export default function Toast({ message }: { message: string | null }) {
  const insets = useSafeAreaInsets();
  const a = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState(message);
  useEffect(() => {
    if (message) setText(message);
    Animated.timing(a, {
      toValue: message ? 1 : 0,
      duration: message ? 200 : 250,
      useNativeDriver: true,
    }).start();
  }, [message, a]);
  return (
    <View pointerEvents="none" style={[styles.wrap, { top: insets.top + 50 }]}>
      <Animated.View
        style={[styles.pill, { opacity: a }]}
        accessibilityLiveRegion="polite"
      >
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 30,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: C.ink,
  },
  text: font("500", 11.5, C.white),
});
