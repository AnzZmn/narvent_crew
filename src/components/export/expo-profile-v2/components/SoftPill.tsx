import React, { useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { C, useGlass } from "./theme";

type Props = {
  height?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** Small pill: frosted white on iOS, lavender on Android. Used for Edit, Add, Nu.Id, section labels. */
export default function SoftPill({
  height = 28,
  onPress,
  accessibilityLabel,
  style,
  children,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const glass = useGlass();
  const base: StyleProp<ViewStyle> = [
    styles.pill,
    { height, borderRadius: height / 2 },
    glass ? styles.glass : styles.flat,
    style,
  ];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[base, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  glass: { backgroundColor: C.glassSoft, borderColor: C.glassEdge },
  flat: { backgroundColor: C.flatSoft, borderColor: C.flatSoft },
  pressed: { opacity: 0.7 },
});
