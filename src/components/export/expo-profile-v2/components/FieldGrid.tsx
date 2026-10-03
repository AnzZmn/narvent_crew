import React from "react";
import { StyleSheet, View } from "react-native";
import Card from "./Card";
import FieldCell, { FieldRow } from "./FieldCell";

type Props = {
  rows: FieldRow[];
  editing: boolean;
  onChange: (key: string, value: string) => void;
  onToggle: (key: string) => void;
};

/** Two-column grid of FieldCells inside a card. Full-width rows span both columns. */
export default function FieldGrid({
  rows,
  editing,
  onChange,
  onToggle,
}: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.grid}>
        {rows.map((r, i) => {
          const rest = rows.slice(i);
          const last = r.half
            ? rest.length <= 2 && rest.every((x) => x.half)
            : i === rows.length - 1;
          return (
            <FieldCell
              key={r.key}
              row={r}
              editing={editing}
              last={last}
              onChange={onChange}
              onToggle={onToggle}
            />
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginHorizontal: 14,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", columnGap: 14 },
});
