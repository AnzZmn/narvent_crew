import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import IconTile from "./IconTile";
import { PATHS } from "./icons";
import { C, font } from "./theme";
import { DocumentItem } from "../types";

const CHIP = {
  verified: { label: "Verified", bg: C.chipBg, fg: C.chipText },
  review: { label: "Under review", bg: "#FFF1D6", fg: "#9A6200" },
  required: { label: "Required", bg: "#FFE6E8", fg: "#C9343E" },
  optional: { label: "Optional", bg: "rgba(14,14,20,0.06)", fg: C.idle },
};

type Props = { doc: DocumentItem; first?: boolean; onAction: () => void };

/** Document row: icon, name + status chip, number or hint, Upload / Replace. */
export default function DocumentRow({ doc, first, onAction }: Props) {
  const empty = doc.status === "none";
  const chip =
    CHIP[empty ? (doc.required ? "required" : "optional") : doc.status];
  const sub = empty
    ? doc.hint
    : `${doc.number ?? ""}${doc.status === "review" ? " · checking within 24 h" : ""}`;
  return (
    <View style={[styles.row, !first && styles.border]}>
      <IconTile d={PATHS[doc.icon]} size={36} />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{doc.name}</Text>
          <View style={[styles.chip, { backgroundColor: chip.bg }]}>
            <Text style={[styles.chipText, { color: chip.fg }]}>
              {chip.label}
            </Text>
          </View>
        </View>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Pressable
        onPress={onAction}
        accessibilityRole="button"
        accessibilityLabel={`${empty ? "Upload" : "Replace"} ${doc.name}`}
        style={({ pressed }) => [
          styles.act,
          empty ? styles.actPrimary : styles.actOutline,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.actText, { color: empty ? C.white : C.violet }]}>
          {empty ? "Upload" : "Replace"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: 12 },
  border: { borderTopWidth: 1, borderTopColor: C.hair },
  body: { flex: 1, minWidth: 0, paddingVertical: 10 },
  nameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  name: font("500", 13, C.ink, 16),
  chip: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 9 },
  chipText: font("500", 9.5),
  sub: { marginTop: 3, ...font("400", 11, C.muted, 15) },
  act: {
    height: 30,
    paddingHorizontal: 13,
    borderRadius: 15,
    borderWidth: 1.5,
    justifyContent: "center",
  },
  actPrimary: { backgroundColor: C.violet, borderColor: C.violet },
  actOutline: { backgroundColor: "transparent", borderColor: C.outline },
  actText: font("500", 11.5),
  pressed: { opacity: 0.75 },
});
