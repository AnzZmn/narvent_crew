import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { C, useGlass } from "./theme";

/** Bot bubble on the left (glass / white), user bubble on the right (solid violet). */
export default function ChatBubble({
  from,
  text,
}: {
  from: "bot" | "me";
  text: string;
}) {
  const glass = useGlass();
  const mine = from === "me";
  return (
    <View
      style={[
        styles.bubble,
        mine
          ? styles.me
          : [styles.bot, glass ? styles.botGlass : styles.botFlat],
      ]}
      accessibilityLabel={`${mine ? "You" : "Assistant"}: ${text}`}
    >
      <Text style={[styles.text, mine && styles.textMe]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "78%",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  bot: { alignSelf: "flex-start", borderBottomLeftRadius: 3, borderWidth: 1 },
  botGlass: {
    backgroundColor: "rgba(255,255,255,0.56)",
    borderColor: "rgba(255,255,255,0.7)",
  },
  botFlat: { backgroundColor: "#FFFFFF", borderColor: C.line },
  me: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 3,
    backgroundColor: C.me,
    elevation: 2,
    shadowColor: C.me,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  text: { fontSize: 13.5, lineHeight: 18, color: C.ink },
  textMe: { color: "#FFFFFF" },
});
