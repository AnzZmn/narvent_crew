import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { C, font, useGlass } from "./theme";

/** Tinted help note under a form (₹1 test transfer, UPI limits). */
export default function InfoNote({ children }: { children: React.ReactNode }) {
  const glass = useGlass();
  return (
    <View style={[styles.box, glass ? styles.glass : styles.flat]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 12,
    marginHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  glass: { backgroundColor: C.glassSoft, borderColor: C.glassEdge },
  flat: { backgroundColor: C.flatSoft, borderColor: C.flatSoft },
  text: font("400", 11.5, C.chipText, 17),
});
