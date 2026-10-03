import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "./icons";
import { C } from "./theme";

type Props = { d: string; size?: number; iconSize?: number; radius?: number };

/** Violet-tinted square holding a stroke icon. */
export default function IconTile({
  d,
  size = 34,
  iconSize = 18,
  radius = 10,
}: Props) {
  return (
    <View
      style={[styles.tile, { width: size, height: size, borderRadius: radius }]}
    >
      <Icon d={d} size={iconSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.tile,
  },
});
