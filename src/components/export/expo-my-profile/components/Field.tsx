import React from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SelectChevron } from "./ProfileIcons";
import { C, P, useGlass } from "./theme";

type Props = {
  label: string;
  value: string;
  /** makes the box a TextInput */
  onChangeText?: (v: string) => void;
  /** renders a dropdown chevron and makes the box pressable */
  onSelect?: () => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

/** Label + 40px box. Read-only text by default; editable or select when a handler is passed. */
export default function Field({
  label,
  value,
  onChangeText,
  onSelect,
  keyboardType,
  autoCapitalize,
}: Props) {
  const glass = useGlass();
  const box = [styles.box, glass ? styles.glass : styles.flat];
  let content: React.ReactNode;
  if (onChangeText) {
    content = (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
        placeholderTextColor={C.faint}
        style={[box, styles.input]}
      />
    );
  } else if (onSelect) {
    content = (
      <Pressable
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${value}`}
        style={[box, styles.select]}
      >
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <SelectChevron />
      </Pressable>
    );
  } else {
    content = (
      <View style={box} accessible accessibilityLabel={`${label}, ${value}`}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minWidth: 0 },
  label: { fontSize: 11, color: C.ink, marginBottom: 5 },
  box: {
    height: 40,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  glass: {
    borderRadius: 9,
    borderColor: "rgba(255,255,255,0.72)",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  flat: {
    borderRadius: 8,
    borderColor: P.inputBorder,
    backgroundColor: P.inputBg,
  },
  input: { fontSize: 12, color: P.value, paddingVertical: 0 },
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 8,
  },
  value: { flexShrink: 1, fontSize: 12, color: P.value },
});
