import React from "react";
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
  onPress: () => void;
  height?: number;
  radius?: number;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
};

/** Dashed "+ add" chip: skill suggestions, "+ Add work experience". */
export default function DashedChip({
  label,
  onPress,
  height = 30,
  radius,
  fontSize = 11.5,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Add ${label}`}
      style={({ pressed }) => [
        styles.chip,
        { height, borderRadius: radius ?? height / 2 },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, { fontSize }]}>+ {label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: C.dashed,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { backgroundColor: "rgba(125,59,255,0.06)" },
  label: font("500", 11.5, C.violet),
});
