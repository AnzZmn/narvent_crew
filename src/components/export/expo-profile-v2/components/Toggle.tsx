import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { C } from "./theme";

type Props = {
  value: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export default function Toggle({
  value,
  onChange,
  disabled,
  accessibilityLabel,
}: Props) {
  const a = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(a, {
      toValue: value ? 1 : 0,
      speed: 18,
      bounciness: 8,
      useNativeDriver: false,
    }).start();
  }, [value, a]);
  const bg = a.interpolate({
    inputRange: [0, 1],
    outputRange: [C.toggleOff, C.violet],
  });
  const x = a.interpolate({ inputRange: [0, 1], outputRange: [0, 18] });
  return (
    <Pressable
      onPress={() => onChange?.(!value)}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled: !!disabled }}
    >
      <Animated.View
        style={[styles.track, { backgroundColor: bg }, disabled && styles.off]}
      >
        <Animated.View
          style={[styles.knob, { transform: [{ translateX: x }] }]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 44, height: 26, borderRadius: 13, padding: 3 },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.white,
    elevation: 2,
    shadowColor: "#1E1450",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  off: { opacity: 0.55 },
});
