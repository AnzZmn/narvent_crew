import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Surface from "./Surface";
import { MenuIcon } from "./icons";
import { C, GAP } from "./theme";
import Avatar from "../../expo-my-profile/components/Avatar";

type Props = { name: string; onMenu?: () => void };

export default function HeaderPill({ name, onMenu }: Props) {
  const { width } = useWindowDimensions();
  const inner = width - 22 - 6; // card margin + padding
  const avatar = Math.min(34, Math.round(inner * 0.29));
  return (
    <Pressable
      onPress={onMenu}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel="Menu"
    >
      <Surface radius={26} style={styles.pill}>
        <View style={[styles.avtr, { maxWidth: inner / 2 }]}>
          <Avatar size={avatar} />
          <Text
            style={styles.greeting}
            numberOfLines={1}
          >{`Hey, ${name}`}</Text>
        </View>
        <View style={styles.menu}>
          <MenuIcon />
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    marginHorizontal: GAP,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 6,
  },
  greeting: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: C.ink,
    letterSpacing: -0.14,
  },
  menu: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avtr: {
    flexDirection: "row",
    alignItems: "center",
    gap: GAP,
  },
});
