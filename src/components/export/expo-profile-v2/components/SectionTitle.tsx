import React from "react";
import { StyleSheet, Text } from "react-native";
import { font } from "./theme";

export default function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Text style={styles.title} accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    marginHorizontal: 18,
    marginBottom: 8,
    ...font("700", 13.5),
  },
});
