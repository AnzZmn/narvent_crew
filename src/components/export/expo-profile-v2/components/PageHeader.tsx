import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackArrow } from "./icons";
import { C, font, useGlass } from "./theme";

/** Header height below the safe-area inset. Pad scroll content by insets.top + HEADER_H. */
export const HEADER_H = 58;

type Props = { title: string; onBack?: () => void; right?: React.ReactNode };

/**
 * Sticky header. Sits over the ScrollView (absolute), so on iOS content blurs as it scrolls
 * beneath. On Android it's a solid #F6F5FC bar.
 */
export default function PageHeader({ title, onBack, right }: Props) {
  const insets = useSafeAreaInsets();
  const glass = useGlass();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      {glass ? (
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill}>
          <View style={[StyleSheet.absoluteFill, styles.glassWash]} />
        </BlurView>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.flat]} />
      )}
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={styles.back}
            >
              <BackArrow />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
        <View style={[styles.side, styles.right]}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  glassWash: { backgroundColor: "rgba(240,234,255,0.35)" },
  flat: { backgroundColor: C.flatBg },
  row: { height: 44, flexDirection: "row", alignItems: "center" },
  side: { width: 64, height: 44, justifyContent: "center" },
  right: { alignItems: "flex-end" },
  back: { height: 44, justifyContent: "center" },
  title: {
    flex: 1,
    textAlign: "center",
    letterSpacing: -0.16,
    ...font("700", 16),
  },
});
