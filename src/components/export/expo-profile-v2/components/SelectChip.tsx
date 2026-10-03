import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { C, font } from "./theme";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
};

/** Outlined chip that fills violet when selected (trade, languages, account type). */
export default function SelectChip({ label, selected, onPress, multi }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={multi ? "checkbox" : "radio"}
      accessibilityState={multi ? { checked: selected } : { selected }}
      style={[styles.chip, selected ? styles.on : styles.off]}
    >
      <Text style={[styles.label, { color: selected ? C.white : C.tagText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1.5,
    justifyContent: "center",
  },
  on: { backgroundColor: C.violet, borderColor: C.violet },
  off: { backgroundColor: "transparent", borderColor: C.outline },
  label: font("500", 12),
});
