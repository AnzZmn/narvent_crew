import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon, PATHS } from "./icons";
import { C, font } from "./theme";

type Props = { label: string; onRemove?: () => void };

/** Lavender skill tag. With onRemove it gets an × button. */
export default function SkillTag({ label, onRemove }: Props) {
  return (
    <View style={[styles.tag, onRemove ? styles.withX : styles.plain]}>
      <Text style={styles.label}>{label}</Text>
      {onRemove ? (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          style={styles.x}
        >
          <Icon d={PATHS.close} size={10} color={C.tagText} strokeWidth={2.4} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 15,
    backgroundColor: C.chipBg,
    paddingLeft: 12,
  },
  plain: { height: 28, paddingRight: 12 },
  withX: { height: 30, paddingRight: 5 },
  label: font("500", 11.5, C.tagText),
  x: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(125,59,255,0.16)",
  },
});
