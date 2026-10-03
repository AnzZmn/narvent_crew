import React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toggle from "./Toggle";
import { Icon, PATHS } from "./icons";
import { C, font, useGlass } from "./theme";

export type FieldRow = {
  key: string;
  label: string;
  value: string;
  /** half-width (two per line) */
  half?: boolean;
  /** small badge after the value, e.g. "Verified" */
  chip?: string;
  /** never editable; shows a lock in edit mode */
  locked?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

type Props = {
  row: FieldRow;
  editing: boolean;
  last: boolean;
  onChange: (key: string, value: string) => void;
  onToggle: (key: string) => void;
};

/** One label/value cell. Text when reading, input when editing, lock when locked. */
export default function FieldCell({
  row,
  editing,
  last,
  onChange,
  onToggle,
}: Props) {
  const glass = useGlass();
  const input = editing && !row.locked && !row.toggle;
  return (
    <View
      style={[
        styles.cell,
        row.half ? styles.half : styles.full,
        !last && styles.border,
      ]}
    >
      <Text style={styles.label}>{row.label}</Text>
      {row.toggle ? (
        <View style={styles.toggleRow}>
          <Text style={styles.value}>{row.value}</Text>
          <Toggle
            value={!!row.toggleValue}
            disabled={!editing}
            onChange={() => onToggle(row.key)}
            accessibilityLabel={row.label}
          />
        </View>
      ) : input ? (
        <TextInput
          value={row.value}
          onChangeText={(v) => onChange(row.key, v)}
          keyboardType={row.keyboardType}
          autoCapitalize={
            row.keyboardType === "email-address" ? "none" : "sentences"
          }
          accessibilityLabel={row.label}
          placeholderTextColor={C.faint}
          style={[styles.input, glass ? styles.inputGlass : styles.inputFlat]}
        />
      ) : (
        <View style={styles.valueRow}>
          <Text style={[styles.value, styles.grow]}>{row.value || "—"}</Text>
          {row.chip ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{row.chip}</Text>
            </View>
          ) : null}
          {editing && row.locked ? (
            <Icon d={PATHS.lock} size={14} color={C.faint} strokeWidth={1.6} />
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { paddingVertical: 11, minWidth: 0 },
  full: { flexBasis: "100%" },
  half: { flexBasis: "40%", flexGrow: 1 },
  border: { borderBottomWidth: 1, borderBottomColor: C.hair },
  label: font("400", 10.5, C.muted),
  valueRow: {
    marginTop: 4,
    minHeight: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  grow: { flex: 1, minWidth: 0 },
  value: font("500", 13.5, C.ink, 18),
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: C.chipBg,
  },
  chipText: font("500", 10, C.chipText),
  toggleRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  input: {
    marginTop: 5,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 0,
    ...font("500", 13),
  },
  inputGlass: { backgroundColor: C.glassInput, borderColor: C.glassEdge },
  inputFlat: { backgroundColor: C.white, borderColor: C.flatInput },
});
