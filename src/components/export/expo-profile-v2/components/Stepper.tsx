import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "./Card";
import SoftPill from "./SoftPill";
import { Icon, PATHS } from "./icons";
import { C, font } from "./theme";

type Props = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
};

/** − value + for years of experience. */
export default function Stepper({ value, onChange, min = 0, max = 50 }: Props) {
  return (
    <Card style={styles.card}>
      <SoftPill
        height={40}
        style={styles.btn}
        accessibilityLabel="Fewer years"
        onPress={() => onChange(Math.max(min, value - 1))}
      >
        <Icon d={PATHS.minus} size={16} strokeWidth={2.2} />
      </SoftPill>
      <View style={styles.mid} accessible accessibilityLabel={`${value} years`}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{value === 1 ? "year" : "years"}</Text>
      </View>
      <SoftPill
        height={40}
        style={styles.btn}
        accessibilityLabel="More years"
        onPress={() => onChange(Math.min(max, value + 1))}
      >
        <Icon d={PATHS.plus} size={16} strokeWidth={2.2} />
      </SoftPill>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: { width: 40, paddingHorizontal: 0 },
  mid: { alignItems: "center" },
  value: font("700", 22, C.ink, 24),
  unit: { marginTop: 4, ...font("400", 10.5, C.muted) },
});
