import React from "react";
import { StyleSheet, View } from "react-native";
import GradientFill from "./GradientFill";
import { BG, C, useGlass } from "./theme";

/** Glass: the Worker Home lavender gradient. Flat: #F6F5FC. */
export default function ScreenBackground() {
  const glass = useGlass();
  if (!glass)
    return (
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.flat]}
      />
    );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <GradientFill
        colors={BG.colors}
        stops={BG.stops}
        from={[0.59, 0]}
        to={[0.41, 1]}
      />
    </View>
  );
}

const styles = StyleSheet.create({ flat: { backgroundColor: C.flatBg } });
