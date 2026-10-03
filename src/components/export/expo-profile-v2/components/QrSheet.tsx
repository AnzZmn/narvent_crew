import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text } from "react-native";
import BottomSheet from "./BottomSheet";
import OutlineButton from "./OutlineButton";
import { C, MONO, font } from "./theme";

const PLACEHOLDER = require("../assets/qr-purple.png");

type Props = {
  open: boolean;
  onClose: () => void;
  nuId: string;
  qr?: ImageSourcePropType;
};

/** Rating QR, moved off the main screen into a sheet. */
export default function QrSheet({ open, onClose, nuId, qr }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <Text style={styles.title}>Scan to rate</Text>
      <Text style={styles.sub}>
        Ask the client to scan this after the job is done.
      </Text>
      <Image
        source={qr ?? PLACEHOLDER}
        style={styles.qr}
        resizeMode="contain"
        accessibilityLabel="Rating QR code"
      />
      <Text style={styles.id}>{nuId}</Text>
      <OutlineButton
        label="Close"
        height={46}
        onPress={onClose}
        style={styles.close}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 14, textAlign: "center", ...font("700", 16) },
  sub: { marginTop: 4, textAlign: "center", ...font("400", 11.5, C.muted, 17) },
  qr: {
    marginTop: 16,
    alignSelf: "center",
    width: "58%",
    maxWidth: 210,
    aspectRatio: 1,
  },
  id: {
    marginTop: 12,
    textAlign: "center",
    ...font("500", 11, C.chipText),
    fontFamily: MONO,
  },
  close: { marginTop: 16, alignSelf: "stretch" },
});
