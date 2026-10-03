import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "./Card";
import OutlineButton from "./OutlineButton";
import PrimaryButton from "./PrimaryButton";
import TextField from "./TextField";
import Toggle from "./Toggle";
import { font } from "./theme";
import { WorkEntry } from "../types";

type Props = { onCancel: () => void; onAdd: (entry: WorkEntry) => void };

const year = (v: string) => v.replace(/\D/g, "").slice(0, 4);

/** Inline "New work experience" form. */
export default function WorkForm({ onCancel, onAdd }: Props) {
  const [w, setW] = useState<WorkEntry>({
    role: "",
    org: "",
    from: "",
    to: "",
    current: false,
  });
  const set = (p: Partial<WorkEntry>) => setW((x) => ({ ...x, ...p }));
  const ok = w.role.trim().length > 0;
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>New work experience</Text>
      <TextField
        label="Role"
        value={w.role}
        onChangeText={(role) => set({ role })}
        placeholder="e.g. Site electrician"
        height={40}
      />
      <TextField
        label="Company or client"
        value={w.org}
        onChangeText={(org) => set({ org })}
        placeholder="e.g. Malabar Builders, Kochi"
        height={40}
      />
      <View style={styles.pair}>
        <TextField
          containerStyle={styles.grow}
          label="From"
          value={w.from}
          onChangeText={(v) => set({ from: year(v) })}
          placeholder="Year"
          keyboardType="number-pad"
          height={40}
        />
        <TextField
          containerStyle={styles.grow}
          label="To"
          value={w.current ? "" : w.to}
          onChangeText={(v) => set({ to: year(v) })}
          placeholder={w.current ? "Present" : "Year"}
          keyboardType="number-pad"
          editable={!w.current}
          height={40}
        />
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>I currently work here</Text>
        <Toggle
          value={!!w.current}
          onChange={(current) => set({ current })}
          accessibilityLabel="I currently work here"
        />
      </View>
      <View style={styles.pair}>
        <OutlineButton
          label="Cancel"
          height={42}
          onPress={onCancel}
          style={styles.grow}
        />
        <PrimaryButton
          label="Add"
          height={42}
          fontSize={13}
          disabled={!ok}
          onPress={() =>
            onAdd({
              ...w,
              role: w.role.trim(),
              org: w.org.trim(),
              to: w.current ? undefined : w.to,
            })
          }
          style={styles.grow}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 14, padding: 14, gap: 10 },
  title: font("700", 13),
  pair: { flexDirection: "row", gap: 10 },
  grow: { flex: 1, minWidth: 0 },
  toggleRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabel: font("500", 12.5),
});
