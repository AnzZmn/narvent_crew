import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Panel from "./Panel";
import Avatar from "./Avatar";
import CompletionBar from "./CompletionBar";
import { P } from "./theme";

type Props = {
  name: string;
  nuId: string;
  phone: string;
  completion: number;
  photoUri?: string;
  onEditPhoto?: () => void;
};

/** Photo left, name / Nu.Id / phone / completion right-aligned. Photo is 29% of the card, max 96. */
export default function IdCard({
  name,
  nuId,
  phone,
  completion,
  photoUri,
  onEditPhoto,
}: Props) {
  const { width } = useWindowDimensions();
  const inner = width - 28 - 28; // card margin + padding
  const avatar = Math.min(96, Math.round(inner * 0.29));
  return (
    <Panel kind="id" style={styles.card}>
      <View style={styles.row}>
        <Avatar size={avatar} uri={photoUri} onEdit={onEditPhoto} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={[styles.meta, styles.metaFirst]}>Nu.Id: {nuId}</Text>
          <Text style={styles.meta}>Ph.no: {phone}</Text>
          <CompletionBar percent={completion} />
        </View>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 14, marginTop: 10, padding: 14 },
  row: { flexDirection: "row", columnGap: 12, alignItems: "flex-start" },
  info: { flex: 1, minWidth: 0, alignItems: "flex-end" },
  name: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
    color: P.violet,
    letterSpacing: -0.15,
    textAlign: "right",
  },
  meta: { marginTop: 2, fontSize: 10, lineHeight: 13.5, color: P.label },
  metaFirst: { marginTop: 6 },
});
