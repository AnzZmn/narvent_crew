import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import GradientFill from "./GradientFill";
import { Icon, PATHS } from "./icons";
import { C, MONO, font } from "./theme";

type Props = {
  label: string;
  uri?: string;
  fileName: string;
  onPress: () => void;
};

/** Front/back photo slot. Dashed when empty, violet with a tick (or the photo) when filled. */
export default function PhotoSlot({ label, uri, fileName, onPress }: Props) {
  const done = !!uri;
  const real = done && !uri!.startsWith("mock://");
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        done
          ? `${label} added. Tap to retake`
          : `Add ${label.toLowerCase()} photo`
      }
      style={[styles.slot, done ? styles.done : styles.empty]}
    >
      {done ? (
        <>
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.clip]}
          >
            {real ? (
              <Image source={{ uri }} style={StyleSheet.absoluteFill} />
            ) : (
              <GradientFill
                colors={[C.violetTop, C.violet]}
                stops={[0, 1]}
                from={[0, 0]}
                to={[1, 1]}
              />
            )}
            {real ? (
              <View style={[StyleSheet.absoluteFill, styles.scrim]} />
            ) : null}
          </View>
          <View style={styles.tick}>
            <Icon d={PATHS.check} size={14} strokeWidth={2.4} />
          </View>
          <Text style={styles.file} numberOfLines={1}>
            {fileName}
          </Text>
        </>
      ) : (
        <>
          <Icon d={PATHS.camera} size={22} />
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    aspectRatio: 1.55,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.dashed,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  empty: { borderStyle: "dashed", backgroundColor: "rgba(125,105,255,0.06)" },
  done: { borderStyle: "solid" },
  clip: { borderRadius: 10.5, overflow: "hidden" },
  scrim: { backgroundColor: "rgba(60,30,140,0.35)" },
  tick: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  file: {
    paddingHorizontal: 8,
    ...font("500", 10.5, C.white),
    fontFamily: MONO,
  },
  label: font("500", 11, C.violet),
});
