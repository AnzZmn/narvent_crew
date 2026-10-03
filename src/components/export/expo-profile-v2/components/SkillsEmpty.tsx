import React from "react";
import { StyleSheet, Text } from "react-native";
import Card from "./Card";
import IconTile from "./IconTile";
import PrimaryButton from "./PrimaryButton";
import { PATHS } from "./icons";
import { C, font } from "./theme";

export default function SkillsEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <Card style={styles.card}>
      <IconTile d={PATHS.briefcase} size={44} iconSize={22} radius={13} />
      <Text style={styles.title}>Add your skills</Text>
      <Text style={styles.sub}>
        Workers with skills and past work listed get matched to jobs faster.
      </Text>
      <PrimaryButton
        label="Add skills & experience"
        height={42}
        fontSize={13}
        onPress={onAdd}
        style={styles.btn}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  title: { marginTop: 12, ...font("700", 14) },
  sub: { marginTop: 5, textAlign: "center", ...font("400", 11.5, C.muted, 17) },
  btn: { marginTop: 16, paddingHorizontal: 22 },
});
