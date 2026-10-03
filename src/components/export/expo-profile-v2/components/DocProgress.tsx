import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "./Card";
import { C, font } from "./theme";
import { DocumentItem } from "../types";

const SEG = { verified: C.violet, review: C.amber, none: C.track };

/** "3 of 6 verified" with one segment per document. */
export default function DocProgress({
  documents,
}: {
  documents: DocumentItem[];
}) {
  const verified = documents.filter((d) => d.status === "verified").length;
  const left = documents.filter(
    (d) => d.required && d.status === "none",
  ).length;
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>
          {verified} of {documents.length} verified
        </Text>
        <Text style={styles.left}>
          {left ? `${left} required left` : "All required done"}
        </Text>
      </View>
      <View style={styles.segs}>
        {documents.map((d) => (
          <View
            key={d.id}
            style={[styles.seg, { backgroundColor: SEG[d.status] }]}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    marginHorizontal: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: font("700", 13.5),
  left: font("500", 11, C.muted),
  segs: { marginTop: 10, flexDirection: "row", gap: 4 },
  seg: { flex: 1, height: 6, borderRadius: 3 },
});
