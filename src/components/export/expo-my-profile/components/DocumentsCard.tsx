import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Panel from "./Panel";
import DocumentRow from "./DocumentRow";
import { P } from "./theme";
import type { ProfileDocument } from "../types";
import { warmUpAsync } from "expo-web-browser";

type Props = {
  documents: ProfileDocument[];
  onUpload?: (doc: ProfileDocument) => void;
};

/** "Other Document" card with one upload row per document. */
export default function DocumentsCard({ documents, onUpload }: Props) {
  return (
    <Panel kind="section" style={styles.card}>
      <Text style={styles.title} accessibilityRole="header">
        Other Document
      </Text>
      <View style={styles.stack}>
        {documents.map((d) => (
          <DocumentRow
            key={d.id}
            label={d.label}
            onPress={() => onUpload?.(d)}
          />
        ))}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginTop: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    display: "flex",
  },
  title: { fontSize: 12, fontWeight: "500", color: P.violet },
  stack: {
    marginTop: 12,
    rowGap: 10,
    display: "flex",
    justifyContent: "center",
  },
});
