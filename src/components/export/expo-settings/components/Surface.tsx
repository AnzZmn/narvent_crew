import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import GradientFill from "./GradientFill";
import { C, useGlass } from "../theme";

type Props = {
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** Glass panel on iOS (blur + white wash + top highlight); white card with hairline + soft shadow on Android. */
export default function Surface({ radius = 14, style, children }: Props) {
  const glass = useGlass();
  if (!glass)
    return (
      <View style={[styles.flat, { borderRadius: radius }, style]}>
        {children}
      </View>
    );
  return (
    <View style={[styles.glass, { borderRadius: radius }, style]}>
      <BlurView
        intensity={55}
        tint="light"
        style={[styles.fill, { borderRadius: radius - 1 }]}
        pointerEvents="none"
      >
        <GradientFill
          colors={["rgba(255,255,255,0.6)", "rgba(255,255,255,0.36)"]}
          stops={[0, 1]}
        />
      </BlurView>
      <View pointerEvents="none" style={styles.highlight} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#3C288C",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 16 },
  },
  fill: { ...StyleSheet.absoluteFill, overflow: "hidden" },
  highlight: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  flat: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: C.line,
    elevation: 2,
    shadowColor: "#3C288C",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
});
