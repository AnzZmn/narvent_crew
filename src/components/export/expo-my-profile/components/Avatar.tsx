import React from "react";
import { Image, Pressable, StyleSheet, View, Text } from "react-native";
import { PencilIcon } from "./ProfileIcons";
import { P } from "./theme";
import { C } from "../../expo-settings/theme";
import GradientFill from "../../expo-settings/components/GradientFill";

type Props = { size: number; uri?: string; onEdit?: () => void };

/** Ringed photo circle with the violet edit badge at bottom-right. */
export default function Avatar({ size, uri, onEdit }: Props) {
  const badge = Math.round(size * 0.28);
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.ring, { borderRadius: size / 2 }]}>
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
          />
        ) : (
          <>
            <GradientFill
              colors={[C.violetSoft, C.violet]}
              stops={[0, 1]}
              radius={size}
            />
            <Text style={[styles.initials, { fontSize: size / 3 }]}>AZ</Text>
          </>
        )}
      </View>
      {onEdit && (
        <Pressable
          onPress={onEdit}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          style={[
            styles.badge,
            {
              width: badge,
              height: badge,
              borderRadius: badge / 2,
              right: -size * 0.04,
              bottom: size * 0.06,
            },
          ]}
        >
          <PencilIcon size={badge * 0.5} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1.5,
    borderColor: P.violetSoft,
    backgroundColor: "#F8F4FF",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    backgroundColor: P.violet,
    borderWidth: 2,
    borderColor: P.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { fontWeight: "700", color: "#FFFFFF" },

  avatar: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.violet,
  },
});
