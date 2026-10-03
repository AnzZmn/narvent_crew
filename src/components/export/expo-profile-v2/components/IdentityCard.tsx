import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "./Card";
import PhotoRing from "./PhotoRing";
import PrimaryButton from "./PrimaryButton";
import SoftPill from "./SoftPill";
import { Icon, PATHS } from "./icons";
import { C, MONO, font } from "./theme";

export type Stat = { value: string; label: string };

type Props = {
  name: string;
  initials: string;
  photoUri?: string;
  nuId: string;
  verified: boolean;
  workDone: number;
  stats: Stat[];
  onCopyId: () => void;
  onEditPhoto?: () => void;
  onShowQr: () => void;
};

/** Photo + ring, name, Nu.Id (tap to copy), Verified, 3 stats, "Show QR to get rated". */
export default function IdentityCard({
  name,
  initials,
  photoUri,
  nuId,
  verified,
  workDone,
  stats,
  onCopyId,
  onEditPhoto,
  onShowQr,
}: Props) {
  return (
    <Card radius={18} style={styles.card}>
      <PhotoRing
        progress={workDone}
        initials={initials}
        photoUri={photoUri}
        onEditPhoto={onEditPhoto}
      />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.chips}>
        <SoftPill
          height={26}
          onPress={onCopyId}
          accessibilityLabel={`Copy Nu.Id ${nuId}`}
          style={styles.idPill}
        >
          <Text style={styles.id}>Nu.Id {nuId}</Text>
          <Icon d={PATHS.copy} size={11} strokeWidth={2} />
        </SoftPill>
        {verified ? (
          <View style={styles.verified}>
            <Icon
              d={PATHS.check}
              size={11}
              color={C.chipText}
              strokeWidth={2.4}
            />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.stats}>
        {stats.map((s, i) => (
          <View key={s.label} style={[styles.stat, i > 0 && styles.divider]}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <PrimaryButton
        label="Show QR to get rated"
        height={46}
        onPress={onShowQr}
        icon={<Icon d={PATHS.qr} size={17} color={C.white} strokeWidth={1.8} />}
        style={styles.qr}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginHorizontal: 14,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  name: {
    marginTop: 12,
    textAlign: "center",
    letterSpacing: -0.27,
    ...font("700", 18, C.ink, 22),
  },
  chips: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  idPill: { paddingHorizontal: 10, gap: 6 },
  id: { ...font("500", 11, C.chipText), fontFamily: MONO },
  verified: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: C.chipBg,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  verifiedText: font("500", 11, C.chipText),
  stats: {
    marginTop: 14,
    alignSelf: "stretch",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: C.hair,
    paddingTop: 14,
  },
  stat: { flex: 1, alignItems: "center" },
  divider: { borderLeftWidth: 1, borderLeftColor: C.hair },
  statValue: font("700", 16),
  statLabel: { marginTop: 4, ...font("400", 10.5, C.muted) },
  qr: { marginTop: 16, alignSelf: "stretch" },
});
