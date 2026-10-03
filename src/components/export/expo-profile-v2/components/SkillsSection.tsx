import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SkillsEmpty from "./SkillsEmpty";
import SkillsSummary from "./SkillsSummary";
import SoftPill from "./SoftPill";
import { Icon, PATHS } from "./icons";
import { C, font } from "./theme";
import { SkillsData } from "../types";

type Props = { skills: SkillsData | null; onEdit: () => void };

/** "Skills & experience" label + Edit, then the summary or the empty state. */
export default function SkillsSection({ skills, onEdit }: Props) {
  return (
    <View>
      <View style={styles.head}>
        <SoftPill height={26} style={styles.label}>
          <Text style={styles.labelText}>Skills & experience</Text>
        </SoftPill>
        {skills ? (
          <View style={styles.right}>
            <Text style={styles.count}>{skills.skills.length} skills</Text>
            <SoftPill
              onPress={onEdit}
              accessibilityLabel="Edit skills and experience"
            >
              <Icon d={PATHS.pencilSm} size={11} strokeWidth={2.2} />
              <Text style={styles.labelText}>Edit</Text>
            </SoftPill>
          </View>
        ) : null}
      </View>
      {skills ? (
        <SkillsSummary skills={skills} />
      ) : (
        <SkillsEmpty onAdd={onEdit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    marginTop: 22,
    marginHorizontal: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  label: { paddingHorizontal: 14 },
  labelText: font("500", 11, C.violet),
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  count: font("400", 11, C.muted),
});
