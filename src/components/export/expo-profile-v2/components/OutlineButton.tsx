import React, { useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { C, font } from "./theme";

type Props = {
  label: string;
  onPress?: () => void;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export default function OutlineButton({
  label,
  onPress,
  height = 44,
  style,
}: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      style={[
        styles.btn,
        { height, borderRadius: height / 2 },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: C.outline,
  },
  pressed: { backgroundColor: "rgba(125,59,255,0.06)" },
  label: font("500", 13, C.violet),
});
