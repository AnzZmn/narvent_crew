import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import ArchBackground from "./ArchBackground";
import ReferButton from "./ReferButton";
import { LinkIcon, ShareIcon } from "./ProfileIcons";
import { P } from "./theme";

const MARK = require("../assets/narvent-mark.png");
const DEFAULT_QR = require("../assets/qr-yellow.png");

type Props = {
  qr?: ImageSourcePropType;
  onShare?: () => void;
  onCopy?: () => void;
  onKnowMore?: () => void;
  /** extra space under the buttons so the floating tab bar doesn't cover them */
  bottomInset?: number;
};

/** Full-bleed arched violet panel: mark, heading, referral QR (42%, max 150) + three actions. */
export default function ReferEarn({
  qr = DEFAULT_QR,
  onShare,
  onCopy,
  onKnowMore,
  bottomInset = 0,
}: Props) {
  const { width } = useWindowDimensions();
  const qrSize = Math.min(150, Math.round((width - 44) * 0.42));
  return (
    <View style={[styles.wrap, { paddingBottom: 26 + bottomInset }]}>
      <ArchBackground />
      <View style={styles.markRow}>
        <Image
          source={MARK}
          style={styles.mark}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} accessibilityRole="header">
          {"Refer & Earn"}
        </Text>
        <Text style={styles.sub}>
          Refer Narvent App to your friend and earn points
        </Text>
        <View style={styles.row}>
          <Image
            source={qr}
            style={{ width: qrSize, height: qrSize }}
            resizeMode="contain"
            accessibilityLabel="Referral QR code"
          />
          <View style={styles.actions}>
            <ReferButton
              label="Share link"
              icon={<ShareIcon color={P.violet} />}
              onPress={onShare}
            />
            <ReferButton
              label="Copy link"
              icon={<LinkIcon color={P.violet} />}
              onPress={onCopy}
            />
            <ReferButton label="Know More" onPress={onKnowMore} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 26 },
  markRow: { paddingTop: 26, paddingHorizontal: 22, alignItems: "center" },
  mark: { width: 22, height: 39 },
  body: { paddingTop: 16, paddingHorizontal: 22 },
  title: {
    fontSize: 26,
    lineHeight: 29,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  sub: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(255,255,255,0.88)",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    columnGap: 14,
    marginTop: 18,
  },
  actions: { flex: 1, minWidth: 0, rowGap: 9 },
});
