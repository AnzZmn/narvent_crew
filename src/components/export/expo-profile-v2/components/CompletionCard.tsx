import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Card from "./Card";
import GradientFill from "./GradientFill";
import IconTile from "./IconTile";
import SoftPill from "./SoftPill";
import { Icon, MISSING_ICONS, PATHS } from "./icons";
import { C, EASE, font } from "./theme";
import { MissingItem } from "../types";

type Props = {
  total: number;
  missing: MissingItem[];
  onAdd: (id: string) => void;
};

/** Profile completion bar. Tap to list what's missing; each row has an Add button. */
export default function CompletionCard({ total, missing, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const has = missing.length > 0;
  const pct = Math.round(((total - missing.length) / total) * 100);

  const fill = useRef(new Animated.Value(pct)).current;
  const rot = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fill, {
      toValue: pct,
      duration: 500,
      easing: EASE,
      useNativeDriver: false,
    }).start();
  }, [pct, fill]);
  useEffect(() => {
    if (!has) setOpen(false);
  }, [has]);
  useEffect(() => {
    Animated.timing(rot, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, rot]);

  const width = fill.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });
  const rotate = rot.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Card radius={16} style={styles.card}>
      <Pressable
        onPress={() => has && setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Profile completion ${pct} percent`}
        style={styles.head}
      >
        <View style={styles.headText}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Profile completion</Text>
            <Text style={styles.pct}>{pct}%</Text>
          </View>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width }]}>
              <GradientFill
                colors={[C.violetTop, C.violet]}
                stops={[0, 1]}
                from={[0, 0.5]}
                to={[1, 0.5]}
              />
            </Animated.View>
          </View>
          <Text style={styles.sub}>
            {has
              ? `${missing.length} of ${total} details missing · tap to finish`
              : "All details added. Your profile is complete."}
          </Text>
        </View>
        {has ? (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon
              d={PATHS.chevronDown}
              size={16}
              color={C.faint}
              strokeWidth={2}
            />
          </Animated.View>
        ) : null}
      </Pressable>
      {open ? (
        <View style={styles.list}>
          {missing.map((m, i) => (
            <View key={m.id} style={[styles.row, i > 0 && styles.rowBorder]}>
              <IconTile
                d={MISSING_ICONS[m.id] ?? PATHS.doc}
                size={30}
                iconSize={16}
                radius={9}
              />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{m.label}</Text>
                <Text style={styles.rowSub}>{m.sub}</Text>
              </View>
              <SoftPill
                onPress={() => onAdd(m.id)}
                accessibilityLabel={`Add ${m.label}`}
              >
                <Text style={styles.add}>Add</Text>
              </SoftPill>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginHorizontal: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 12 },
  headText: { flex: 1, minWidth: 0 },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 8,
  },
  title: font("700", 13.5),
  pct: font("700", 14, C.violet),
  track: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.track,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4, overflow: "hidden" },
  sub: { marginTop: 7, ...font("400", 11, C.muted, 15) },
  list: {
    marginTop: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: C.hair,
  },
  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: C.hair },
  rowText: { flex: 1, minWidth: 0 },
  rowLabel: font("500", 12.5),
  rowSub: { marginTop: 2, ...font("400", 10.5, C.muted) },
  add: font("500", 11, C.violet),
});
