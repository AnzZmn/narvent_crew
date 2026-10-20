import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import GradientFill from "./GradientFill";
import { C, MONO, font, useGlass } from "./theme";

type Props = {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
};

/** Filter chip floating over the map. Active = violet; idle = frosted (glass) or white (flat). */
export default function TradeChip({ label, count, active, onPress }: Props) {
  const glass = useGlass();
  const fg = active ? C.white : C.body;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        styles.glass,
        active ? styles.flatOn : styles.flatOff,
      ]}
    >
      {glass && !active && (
        <>
          <BlurView
            intensity={40}
            tint="light"
            style={[StyleSheet.absoluteFill, styles.clip]}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.clip,
              { backgroundColor: C.glassFill },
            ]}
          />
        </>
      )}
      {glass && active && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: 27, overflow: "hidden" },
          ]}
        >
          <GradientFill colors={[C.violetTop, C.violet]} stops={[0, 1]} />
          <View style={[styles.shine, { left: 27, right: 27 }]} />
        </View>
      )}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
      <Text style={[styles.count, { color: fg }]}>{count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingHorizontal: 13,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    shadowColor: "#3C288C",
    shadowOpacity: 0.18,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 6 },
  },
  clip: { borderRadius: 17, overflow: "hidden" },
  glass: { borderWidth: 1, borderColor: C.glassEdge },
  flatOn: { backgroundColor: C.violet, elevation: 3 },
  flatOff: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.flatLine,
    elevation: 2,
  },
  label: font("500", 12),
  count: { fontSize: 10.5, fontFamily: MONO, opacity: 0.7 },
  shine: {
    position: "absolute",
    top: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
