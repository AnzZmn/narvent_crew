import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { PencilIcon } from "./ProfileIcons";
import { P } from "./theme";

/** Small violet "Edit ✎" chip. */
export default function EditButton({
  onPress,
  label = "Edit",
}: {
  onPress?: () => void;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`${label} payment details`}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
      <PencilIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    marginTop: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: P.violet,
  },
  pressed: { backgroundColor: P.violetPressed },
  text: { fontSize: 11, fontWeight: "500", color: "#FFFFFF" },
});
