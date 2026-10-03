import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { whenLabel } from "../catalog";
import { WorkEntry } from "../types";
import { C, MONO, font } from "./theme";

/** Vertical timeline; the newest entry gets a filled dot. */
export default function WorkTimeline({ history }: { history: WorkEntry[] }) {
  return (
    <View style={styles.list}>
      {history.map((w, i) => (
        <View key={`${w.role}-${i}`} style={styles.row}>
          <View style={styles.rail}>
            <View style={styles.ring}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: i === 0 ? C.violet : C.white },
                ]}
              />
            </View>
            <View
              style={[
                styles.line,
                {
                  backgroundColor:
                    i === history.length - 1
                      ? "transparent"
                      : "rgba(125,59,255,0.2)",
                },
              ]}
            />
          </View>
          <View style={styles.body}>
            <Text style={styles.role}>{w.role}</Text>
            <Text style={styles.org}>{w.org}</Text>
            <Text style={styles.when}>{whenLabel(w)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 10 },
  row: { flexDirection: "row", gap: 12 },
  rail: { width: 14, alignItems: "center" },
  ring: {
    marginTop: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1.5,
    borderColor: C.violetTop,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  line: { flex: 1, width: 1.5, marginVertical: 3 },
  body: { flex: 1, minWidth: 0, paddingBottom: 14 },
  role: font("500", 13, C.ink, 17),
  org: { marginTop: 2, ...font("400", 11.5, C.body, 15) },
  when: { marginTop: 3, ...font("400", 10.5, C.muted), fontFamily: MONO },
});
