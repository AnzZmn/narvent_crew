import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import GradientFill from "./GradientFill";
import { C, useGlass } from "./theme";

type Props = {
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Glass (iOS): blur + white 60→36% wash, bright top edge, deep violet shadow.
 * Flat (Android): white card with a hairline border.
 */
export default function Card({ radius = 14, style, children }: Props) {
  const glass = useGlass();
  if (!glass)
    return (
      <View style={[styles.flat, { borderRadius: radius }, style]}>
        {children}
      </View>
    );
  return (
    <View style={[styles.glass, { borderRadius: radius }, style]}>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius - 1, overflow: "hidden" },
        ]}
      >
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        <GradientFill
          colors={["rgba(255,255,255,0.6)", "rgba(255,255,255,0.36)"]}
          stops={[0, 1]}
        />
      </View>
      <View
        pointerEvents="none"
        style={[styles.highlight, { left: radius, right: radius }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#3C288C",
    shadowOpacity: 0.2,
    shadowRadius: 23,
    shadowOffset: { width: 0, height: 20 },
  },
  highlight: {
    position: "absolute",
    top: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  flat: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.flatLine,
    elevation: 2,
    shadowColor: "#3C288C",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 14 },
  },
});
