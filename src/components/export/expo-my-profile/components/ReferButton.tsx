import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { P, useGlass } from "./theme";

/** 38px white pill on the Refer & Earn panel. */
export default function ReferButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.btn, styles.glass, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 38,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  glass: { backgroundColor: "rgba(255,255,255,0.88)" },
  flat: { backgroundColor: "#FFFFFF" },
  pressed: { backgroundColor: P.tint },
  text: { fontSize: 13, fontWeight: "500", color: P.violet },
});
