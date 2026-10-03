import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import GradientFill from "./GradientFill";
import { P, useGlass } from "./theme";

/**
 * id      – profile ID card (lavender tint on Android)
 * qr      – white card with shadow on Android
 * section – Payment Details / Other Document (lavender tint on Android)
 */
export type PanelKind = "id" | "qr" | "section";

const GLASS: Record<PanelKind, { colors: string[]; blur: number }> = {
  id: {
    colors: ["rgba(255,255,255,0.58)", "rgba(243,237,255,0.34)"],
    blur: 60,
  },
  qr: {
    colors: ["rgba(255,255,255,0.62)", "rgba(255,255,255,0.38)"],
    blur: 55,
  },
  section: {
    colors: ["rgba(255,255,255,0.5)", "rgba(243,237,255,0.3)"],
    blur: 55,
  },
};

type Props = {
  kind: PanelKind;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export default function Panel({ kind, style, children }: Props) {
  const glass = useGlass();
  if (glass) {
    const g = GLASS[kind];
    return (
      <View
        style={[
          styles.glass,
          kind === "section" ? styles.glassSection : styles.glassShadow,
          style,
        ]}
      >
        <BlurView
          intensity={g.blur}
          tint="light"
          style={styles.blur}
          pointerEvents="none"
        >
          <GradientFill colors={g.colors} stops={[0, 1]} />
        </BlurView>
        <View pointerEvents="none" style={styles.highlight} />
        {children}
      </View>
    );
  }
  return <View style={[styles.flat, FLAT[kind], style]}>{children}</View>;
}

const FLAT = StyleSheet.create({
  id: { backgroundColor: P.tint, borderWidth: 1, borderColor: P.tintBorder },
  qr: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDEBF7",
    elevation: 3,
    shadowColor: "#3C288C",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  section: { backgroundColor: P.tint },
});

const styles = StyleSheet.create({
  glass: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
  },
  glassShadow: {
    shadowColor: "#3C288C",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 16 },
  },
  glassSection: { borderColor: "rgba(255,255,255,0.68)" },
  blur: { ...StyleSheet.absoluteFill, borderRadius: 13, overflow: "hidden" },
  highlight: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  flat: { borderRadius: 12 },
});
