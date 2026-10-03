import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { P, useGlass } from "./theme";

/** 26px rounded label bar: "Current Address", "Permanent Address". */
export default function SectionPill({ title }: { title: string }) {
  const glass = useGlass();
  return (
    <View style={[styles.pill, glass ? styles.glass : styles.flat]}>
      <Text style={styles.text} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    marginTop: 16,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  glass: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
  },
  flat: { backgroundColor: P.track },
  text: { fontSize: 11, fontWeight: "500", color: P.violet },
});
