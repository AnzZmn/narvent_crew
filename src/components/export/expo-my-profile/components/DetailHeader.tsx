import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BackArrow } from "./icons";
import { C } from "./theme";

/** Back arrow + centred title (44 / 1fr / 44 grid in the mockup). */
export default function DetailHeader({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  side: { width: 44, height: 44, justifyContent: "center" },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "700",
    color: C.ink,
    letterSpacing: -0.16,
  },
});
