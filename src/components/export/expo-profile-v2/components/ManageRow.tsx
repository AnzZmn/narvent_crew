import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import IconTile from "./IconTile";
import { Icon, PATHS } from "./icons";
import { C, font } from "./theme";

type Props = {
  icon: string;
  label: string;
  sub: string;
  badge?: number;
  first?: boolean;
  onPress: () => void;
};

/** Row on the ID & Bank tab that opens Bank details / Documents. */
export default function ManageRow({
  icon,
  label,
  sub,
  badge,
  first,
  onPress,
}: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${sub}`}
      style={[styles.row, !first && styles.border, pressed && styles.pressed]}
    >
      <IconTile d={icon} />
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Icon d={PATHS.chevronRight} size={14} color={C.faint} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  border: { borderTopWidth: 1, borderTopColor: C.hair },
  pressed: { opacity: 0.7 },
  text: { flex: 1, minWidth: 0 },
  label: font("500", 13.5),
  sub: { marginTop: 2, ...font("400", 11, C.muted, 14) },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: C.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: font("700", 10.5, C.white),
});
