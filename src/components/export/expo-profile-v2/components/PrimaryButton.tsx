import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import GradientFill from "./GradientFill";
import { C, font, useGlass } from "./theme";

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  fontSize?: number;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Glass: violet gradient pill with an inner top highlight. Flat: solid violet. */
export default function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  height = 48,
  fontSize = 14,
  icon,
  style,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const glass = useGlass();
  const r = height / 2;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={[
        styles.btn,
        { height, borderRadius: r },
        glass ? styles.glass : styles.flat,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {glass && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: r, overflow: "hidden" },
          ]}
        >
          <GradientFill colors={[C.violetTop, C.violet]} stops={[0, 1]} />
          <View style={[styles.shine, { left: r, right: r }]} />
        </View>
      )}
      {loading ? <ActivityIndicator size="small" color={C.white} /> : icon}
      <Text style={[styles.label, { fontSize }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
    backgroundColor: C.violet,
  },
  glass: {
    shadowColor: C.violet,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
  },
  flat: {
    elevation: 3,
    shadowColor: C.violet,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  shine: {
    position: "absolute",
    top: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  label: font("500", 14, C.white),
});
