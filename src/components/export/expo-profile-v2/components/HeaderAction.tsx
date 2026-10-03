import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { C, font } from "./theme";

type Props = { label: string; onPress?: () => void; disabled?: boolean };

/** Text button on the right of a page header ("Save"). */
export default function HeaderAction({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={styles.btn}
    >
      <Text style={[styles.label, disabled && styles.disabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 36, justifyContent: "center" },
  label: font("600", 13, C.violet),
  disabled: { opacity: 0.45 },
});
