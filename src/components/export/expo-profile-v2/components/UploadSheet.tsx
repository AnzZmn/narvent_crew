import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet from "./BottomSheet";
import OutlineButton from "./OutlineButton";
import PhotoSlot from "./PhotoSlot";
import PrimaryButton from "./PrimaryButton";
import TextField from "./TextField";
import { C, font } from "./theme";
import { DocumentItem, DocumentUpload } from "../types";
import { PhotoSide } from "../services/profileServices";

type Props = {
  doc: DocumentItem | null;
  onClose: () => void;
  onSubmit: (u: DocumentUpload) => Promise<void> | void;
  pickPhoto: (docId: string, side: PhotoSide) => Promise<string | null>;
};

/** DD-MM-YYYY as you type */
const dateMask = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join("-");
};

/** Upload / replace a document: number, expiry (if any), front and back photos. */
export default function UploadSheet({
  doc,
  onClose,
  onSubmit,
  pickPhoto,
}: Props) {
  // keep the last doc on screen while the sheet animates closed
  const [shown, setShown] = useState<DocumentItem | null>(doc);
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [front, setFront] = useState<string>();
  const [back, setBack] = useState<string>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!doc) return;
    setShown(doc);
    setNum(doc.status === "none" ? "" : (doc.number ?? ""));
    setExp(doc.expiry ?? "");
    setFront(undefined);
    setBack(undefined);
    setBusy(false);
  }, [doc]);

  const d = doc ?? shown;
  if (!d)
    return (
      <BottomSheet open={false} onClose={onClose}>
        {null}
      </BottomSheet>
    );

  const ok =
    num.trim().length >= 4 &&
    !!front &&
    (!d.hasBack || !!back) &&
    (!d.hasExpiry || exp.length === 10);
  const pick = async (side: PhotoSide) => {
    const uri = await pickPhoto(d.id, side);
    if (uri) (side === "front" ? setFront : setBack)(uri);
  };
  const submit = async () => {
    if (!ok || busy) return;
    setBusy(true);
    try {
      await onSubmit({
        id: d.id,
        number: num.trim(),
        expiry: d.hasExpiry ? exp : undefined,
        frontUri: front!,
        backUri: d.hasBack ? back : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet open={!!doc} onClose={onClose}>
      <Text style={styles.title}>
        {d.status === "none" ? "Upload" : "Replace"} {d.name}
      </Text>
      <Text style={styles.hint}>{d.hint}</Text>
      <TextField
        containerStyle={styles.gap14}
        label={d.numberLabel}
        value={num}
        onChangeText={setNum}
        placeholder={d.numberPlaceholder}
        autoCapitalize="characters"
        mono
      />
      {d.hasExpiry ? (
        <TextField
          containerStyle={styles.gap12}
          label="Valid till"
          value={exp}
          onChangeText={(v) => setExp(dateMask(v))}
          placeholder="DD-MM-YYYY"
          keyboardType="number-pad"
        />
      ) : null}
      <View style={styles.gap12}>
        <Text style={styles.label}>Photos</Text>
        <View style={styles.slots}>
          <PhotoSlot
            label="Front side"
            uri={front}
            fileName={`front_${d.id}.jpg`}
            onPress={() => pick("front")}
          />
          {d.hasBack ? (
            <PhotoSlot
              label="Back side"
              uri={back}
              fileName={`back_${d.id}.jpg`}
              onPress={() => pick("back")}
            />
          ) : null}
        </View>
        <Text style={styles.note}>
          Tap a side to take a photo or pick from gallery.
        </Text>
      </View>
      <View style={styles.actions}>
        <OutlineButton label="Cancel" onPress={onClose} style={styles.grow} />
        <PrimaryButton
          label="Submit"
          height={44}
          fontSize={13}
          disabled={!ok}
          loading={busy}
          onPress={submit}
          style={styles.grow}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 14, ...font("700", 16) },
  hint: { marginTop: 4, ...font("400", 11.5, C.muted, 17) },
  gap14: { marginTop: 14 },
  gap12: { marginTop: 12 },
  label: { marginBottom: 6, ...font("400", 10.5, C.muted) },
  slots: { flexDirection: "row", gap: 8 },
  note: { marginTop: 6, ...font("400", 10.5, C.muted) },
  actions: { marginTop: 16, flexDirection: "row", gap: 8 },
  grow: { flex: 1 },
});
