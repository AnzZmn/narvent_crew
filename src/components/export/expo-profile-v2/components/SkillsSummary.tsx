import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "./Card";
import IconTile from "./IconTile";
import SkillTag from "./SkillTag";
import WorkTimeline from "./WorkTimeline";
import { PATHS } from "./icons";
import { C, font } from "./theme";
import { yearsLabel } from "../catalog";
import { SkillsData } from "../types";

/** Read-only skills card under the tabs. */
export default function SkillsSummary({ skills }: { skills: SkillsData }) {
  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <IconTile d={PATHS.bolt} size={40} iconSize={20} radius={12} />
        <View style={styles.grow}>
          <Text style={styles.label}>Primary trade</Text>
          <Text style={styles.trade}>{skills.trade || "—"}</Text>
        </View>
        <View style={styles.years}>
          <Text style={styles.yearsValue}>{yearsLabel(skills.years)}</Text>
          <Text style={styles.label}>experience</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Skills</Text>
        <View style={styles.tags}>
          {skills.skills.map((s) => (
            <SkillTag key={s} label={s} />
          ))}
        </View>
      </View>
      {skills.history.length ? (
        <View style={styles.section}>
          <Text style={styles.label}>Work history</Text>
          <WorkTimeline history={skills.history} />
        </View>
      ) : null}
      <View style={[styles.section, styles.pair]}>
        <View style={styles.grow}>
          <Text style={styles.label}>Languages</Text>
          <Text style={styles.value}>{skills.languages.join(", ") || "—"}</Text>
        </View>
        <View style={styles.grow}>
          <Text style={styles.label}>Own tools</Text>
          <Text style={styles.value}>{skills.tools}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 14, paddingVertical: 14, paddingHorizontal: 16 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  grow: { flex: 1, minWidth: 0 },
  label: font("400", 10.5, C.muted),
  trade: { marginTop: 3, ...font("700", 14, C.ink, 18) },
  years: { alignItems: "flex-end" },
  yearsValue: { marginBottom: 3, ...font("700", 16, C.violet) },
  section: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.hair,
  },
  tags: { marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pair: { flexDirection: "row", gap: 14 },
  value: { marginTop: 4, ...font("500", 13, C.ink, 17) },
});
