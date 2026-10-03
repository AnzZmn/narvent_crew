import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Card from "./Card";
import IconTile from "./IconTile";
import { Icon, PATHS } from "./icons";
import { C, MONO, font } from "./theme";
import { whenLabel } from "../catalog";
import { WorkEntry } from "../types";

/** Editable work-history entry with a delete button. */
export default function WorkCard({
  entry,
  onRemove,
}: {
  entry: WorkEntry;
  onRemove: () => void;
}) {
  return (
    <Card style={styles.card}>
      <IconTile d={PATHS.briefcase} iconSize={17} />
      <View style={styles.body}>
        <Text style={styles.role}>{entry.role}</Text>
        <Text style={styles.org}>{entry.org || "—"}</Text>
        <Text style={styles.when}>{whenLabel(entry)}</Text>
      </View>
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${entry.role}`}
        style={styles.del}
      >
        <Icon d={PATHS.trash} size={15} color={C.danger} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 8,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  body: { flex: 1, minWidth: 0 },
  role: font("500", 13, C.ink, 17),
  org: { marginTop: 2, ...font("400", 11.5, C.body, 15) },
  when: { marginTop: 3, ...font("400", 10.5, C.muted), fontFamily: MONO },
  del: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
