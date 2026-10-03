import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { C, MONO, font, useGlass } from "./theme";

export type FieldMessage = { text: string; tone: "ok" | "bad" | "muted" };

type Props = TextInputProps & {
  label?: string;
  hint?: string;
  message?: FieldMessage | null;
  mono?: boolean;
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const TONE = { ok: C.ok, bad: C.bad, muted: C.muted };

/** Labelled input. A message (validation) replaces the hint while it's shown. */
export default function TextField({
  label,
  hint,
  message,
  mono,
  height = 42,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...input
}: Props) {
  const glass = useGlass();
  const [focus, setFocus] = useState(false);
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={C.faint}
        accessibilityLabel={label}
        {...input}
        onFocus={(e) => {
          setFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          { height },
          glass ? styles.glass : styles.flat,
          mono && styles.mono,
          focus && styles.focus,
          input.editable === false && styles.off,
          style,
        ]}
      />
      {message ? (
        <Text style={[styles.msg, { color: TONE[message.tone] }]}>
          {message.text}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, ...font("400", 10.5, C.muted) },
  input: {
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 0,
    ...font("500", 13),
  },
  glass: { backgroundColor: C.glassInput, borderColor: C.glassEdge },
  flat: { backgroundColor: C.white, borderColor: C.flatInput },
  mono: { fontFamily: MONO, letterSpacing: 0.5 },
  focus: { borderColor: "rgba(125,59,255,0.5)" },
  off: { opacity: 0.4 },
  hint: { marginTop: 5, ...font("400", 10.5, C.muted) },
  msg: { marginTop: 6, ...font("400", 11, C.muted, 15) },
});
