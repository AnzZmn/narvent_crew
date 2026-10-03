import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import GradientFill from "./GradientFill";
import { Icon, PATHS } from "./icons";
import { C, font } from "./theme";

type Props = {
  progress: number;
  initials: string;
  photoUri?: string;
  size?: number;
  onEditPhoto?: () => void;
};

const STROKE = 4;

/** Profile photo with the work-completion ring. progress is 0–1. */
export default function PhotoRing({
  progress,
  initials,
  photoUri,
  size = 96,
  onEditPhoto,
}: Props) {
  const p = Math.max(0, Math.min(1, progress));
  const c = size / 2;
  const r = c - STROKE / 2;
  const circ = 2 * Math.PI * r;
  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityLabel={`Work completion ${Math.round(p * 100)} percent`}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={c}
          cy={c}
          r={r}
          stroke={C.track}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={c}
          cy={c}
          r={r}
          stroke={C.violet}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${circ * p} ${circ}`}
          transform={`rotate(-90 ${c} ${c})`}
        />
      </Svg>
      <View style={[styles.photo, { borderRadius: c }]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} />
        ) : (
          <>
            <GradientFill colors={[C.violetTop, C.violet]} stops={[0, 1]} />
            <Text style={styles.initials}>{initials}</Text>
          </>
        )}
      </View>
      {onEditPhoto ? (
        <Pressable
          onPress={onEditPhoto}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Change photo"
          style={styles.badge}
        >
          <Icon d={PATHS.camera} size={13} color={C.white} strokeWidth={2} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  photo: {
    position: "absolute",
    top: STROKE,
    left: STROKE,
    right: STROKE,
    bottom: STROKE,
    borderWidth: 3,
    borderColor: C.white,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { letterSpacing: 0.3, ...font("700", 26, C.white) },
  badge: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.violet,
    borderWidth: 2.5,
    borderColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
