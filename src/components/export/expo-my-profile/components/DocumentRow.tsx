import { Pressable, StyleSheet, Text } from "react-native";
import { P, useGlass } from "./theme";
import { useState } from "react";

export default function DocumentRow({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  const glass = useGlass();
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => {
        setPressed(true);
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.row,
        glass ? styles.glass : styles.flat,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 40,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 14,
    display: "flex",
    flex: 1,
    borderColor: "rgba(0,0,0,0.72)",
  },
  glass: {
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderColor: "rgba(255,255,255,0.72)",
  },
  flat: {
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderColor: P.inputBorder,
  },
  pressed: { backgroundColor: P.inputBg },
  text: { fontSize: 11.5, color: P.violet },
});
