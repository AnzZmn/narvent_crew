import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import IconTile from "./IconTile";
import Toggle from "./Toggle";
import { Chevron, IconName } from "./icons";
import { C } from "../theme";

type Props = {
  icon: IconName;
  label: string;
  sub?: string;
  first?: boolean;
  /** pass a boolean to render a switch instead of a chevron */
  toggle?: boolean;
  onPress?: () => void;
};

export default function SettingsRow({
  icon,
  label,
  sub,
  first,
  toggle,
  onPress,
}: Props) {
  const isToggle = typeof toggle === "boolean";
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => {
        setPressed(true);
      }}
      style={[styles.row, !first && styles.divider, pressed && styles.pressed]}
      accessibilityRole={isToggle ? "switch" : "button"}
      accessibilityState={isToggle ? { checked: toggle } : undefined}
      accessibilityLabel={label}
    >
      <IconTile name={icon} />
      <View style={styles.text}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {!!sub && (
          <Text style={styles.sub} numberOfLines={1}>
            {sub}
          </Text>
        )}
      </View>
      {isToggle ? <Toggle on={toggle} /> : <Chevron />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12 },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(14,14,20,0.12)",
  },
  pressed: { opacity: 0.6 },
  text: { flex: 1, minWidth: 0 },
  label: { fontSize: 13.5, lineHeight: 17, fontWeight: "500", color: C.ink },
  sub: { marginTop: 2, fontSize: 11, lineHeight: 14, color: C.muted },
});
