import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Surface from "./Surface";
import IconTile from "./IconTile";
import GradientFill from "./GradientFill";
import { Chevron } from "./icons";
import { C, GAP, MONO, useGlass } from "../theme";
import type { Block } from "../types";

type Props = {
  block: Block;
  /** position among consecutive rows → grouped radius 12/4/12 like the payments list */
  rowIndex?: number;
  rowCount?: number;
  values: Record<string, string>;
  onChange: (key: string, v: string) => void;
  onButton: () => void;
  logo?: { mark: any; wordmark: any };
};

export default function BlockView({
  block: b,
  rowIndex = 0,
  rowCount = 1,
  values,
  onChange,
  onButton,
  logo,
}: Props) {
  const glass = useGlass();
  const [buttonPressed, setButtonPressed] = useState(false);
  switch (b.type) {
    case "hero":
      return (
        <Surface style={styles.hero}>
          <View style={styles.markTile}>
            {logo?.mark ? (
              <Image
                source={logo.mark}
                style={styles.mark}
                resizeMode="contain"
              />
            ) : null}
          </View>
          {logo?.wordmark ? (
            <Image
              source={logo.wordmark}
              style={styles.wordmark}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.wordText}>Narvent</Text>
          )}
          <Text style={styles.tagline}>{b.tagline}</Text>
        </Surface>
      );
    case "meta":
      return <Text style={styles.meta}>{b.text}</Text>;
    case "text":
      return (
        <View style={styles.textBlock}>
          <Text style={styles.heading} accessibilityRole="header">
            {b.heading}
          </Text>
          <Text style={styles.body}>{b.body}</Text>
        </View>
      );
    case "row": {
      const first = rowIndex === 0,
        last = rowIndex === rowCount - 1;
      const r = rowCount === 1 ? 12 : undefined;
      const radius = {
        borderTopLeftRadius: r ?? (first ? 12 : 4),
        borderTopRightRadius: r ?? (first ? 12 : 4),
        borderBottomLeftRadius: r ?? (last ? 12 : 4),
        borderBottomRightRadius: r ?? (last ? 12 : 4),
      };
      const verified = b.status === "Verified";
      const inner = (
        <>
          <IconTile name={b.icon} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{b.title}</Text>
            <Text style={styles.rowValue}>{b.value}</Text>
          </View>
          {b.status ? (
            <View
              style={[
                styles.chip,
                { backgroundColor: verified ? C.chipBg : C.pendingBg },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: verified ? C.chipText : C.pendingText },
                ]}
              >
                {b.status}
              </Text>
            </View>
          ) : b.onPress ? (
            <Chevron />
          ) : null}
        </>
      );
      return (
        <Surface
          radius={12}
          style={[styles.rowCard, radius, { marginTop: first ? 16 : 3 }]}
        >
          {b.onPress ? (
            <Pressable
              onPress={b.onPress}
              onPressIn={() => setButtonPressed(true)}
              onPressOut={() => setButtonPressed(false)}
              style={[styles.rowInner, buttonPressed && { opacity: 0.6 }]}
              accessibilityRole="button"
              accessibilityLabel={`${b.title}, ${b.value}`}
            >
              {inner}
            </Pressable>
          ) : (
            <View style={styles.rowInner}>{inner}</View>
          )}
        </Surface>
      );
    }
    case "field":
      return (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>{b.label}</Text>
          <TextInput
            value={values[b.key] ?? b.value}
            onChangeText={(t) => onChange(b.key, t)}
            keyboardType={b.keyboardType}
            autoCapitalize={b.autoCapitalize ?? "sentences"}
            autoCorrect={false}
            accessibilityLabel={b.label}
            placeholderTextColor={C.faint}
            style={[styles.input, glass ? styles.inputGlass : styles.inputFlat]}
          />
        </View>
      );
    case "note":
      return (
        <View style={[styles.note, glass ? styles.noteGlass : styles.noteFlat]}>
          <Text style={styles.noteText}>{b.text}</Text>
        </View>
      );
    case "button":
      return (
        <Pressable
          onPress={onButton}
          onPressIn={() => setButtonPressed(true)}
          onPressOut={() => setButtonPressed(false)}
          style={[
            styles.btn,
            !glass && styles.btnFlat,
            buttonPressed && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
        >
          {glass && (
            <GradientFill
              colors={[C.violetSoft, C.violet]}
              stops={[0, 1]}
              radius={24}
            />
          )}
          <Text style={styles.btnText}>{b.label}</Text>
        </Pressable>
      );
  }
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: GAP,
    marginTop: 14,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: "center",
    gap: 14,
  },
  markTile: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: C.purple,
    shadowColor: "#5A44E0",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  mark: { width: 34, height: 34 },
  wordmark: { width: 108, height: 22, tintColor: "#2A2838" },
  wordText: {
    fontSize: 20,
    fontWeight: "700",
    color: C.ink,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    textAlign: "center",
  },
  meta: {
    marginHorizontal: 20,
    marginTop: 14,
    fontSize: 11,
    fontFamily: MONO,
    color: C.muted,
  },
  textBlock: { marginHorizontal: 20, marginTop: 18 },
  heading: { fontSize: 14, lineHeight: 18, fontWeight: "700", color: C.ink },
  body: { marginTop: 6, fontSize: 12.5, lineHeight: 20, color: C.body },
  rowCard: { marginHorizontal: GAP },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 13, lineHeight: 16, fontWeight: "500", color: C.ink },
  rowValue: { marginTop: 2, fontSize: 11.5, lineHeight: 15, color: C.violet },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  chipText: { fontSize: 10.5, fontWeight: "500" },
  field: { marginHorizontal: GAP, marginTop: 12 },
  fieldLabel: { fontSize: 11, color: C.ink, marginBottom: 5 },
  input: {
    height: 42,
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    color: C.ink,
  },
  inputGlass: {
    borderColor: "rgba(255,255,255,0.72)",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  inputFlat: { borderColor: C.inputBorder, backgroundColor: "#FFFFFF" },
  note: {
    marginHorizontal: GAP,
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  noteGlass: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
  },
  noteFlat: { backgroundColor: C.tint },
  noteText: { fontSize: 11.5, lineHeight: 17, color: C.chipText },
  btn: {
    marginHorizontal: GAP,
    marginTop: 22,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: C.violet,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  btnFlat: { backgroundColor: C.violet, elevation: 4 },
  btnText: { fontSize: 14, fontWeight: "500", color: "#FFFFFF" },
});
