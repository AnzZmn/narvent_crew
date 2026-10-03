import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Card from "../components/Card";
import HeaderAction from "../components/HeaderAction";
import InfoNote from "../components/InfoNote";
import PageHeader, { HEADER_H } from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SectionTitle from "../components/SectionTitle";
import Segmented from "../components/Segmented";
import SelectChip from "../components/SelectChip";
import TextField, { FieldMessage } from "../components/TextField";
import { C, font } from "../components/theme";
import { IFSC_RE, ProfileServices, UPI_RE } from "../services/profileServices";
import { AccountType, BankDetails, PayoutMode } from "../types";

export type BankPageProps = {
  bank: BankDetails;
  onBack: () => void;
  onSave: (b: BankDetails) => Promise<void> | void;
  services: Pick<ProfileServices, "lookupIfsc" | "verifyUpi">;
};

type Ifsc = {
  state: "idle" | "loading" | "found" | "notfound" | "error";
  bank?: string;
  branch?: string;
};
type Upi = {
  state: "idle" | "loading" | "ok" | "bad";
  name?: string;
  reason?: string;
};

const MODES: { label: string; value: PayoutMode }[] = [
  { label: "Bank account", value: "bank" },
  { label: "UPI", value: "upi" },
];
const TYPES: AccountType[] = ["Savings", "Current"];
const digits = (v: string) => v.replace(/\D/g, "").slice(0, 18);

/** Bank account (holder, number ×2, IFSC lookup, type) or UPI ID with Verify. */
export default function BankPage({
  bank,
  onBack,
  onSave,
  services,
}: BankPageProps) {
  const insets = useSafeAreaInsets();
  const [bd, setBd] = useState<BankDetails>(bank);
  const [acc2, setAcc2] = useState(bank.accountNumber);
  const [ifsc, setIfsc] = useState<Ifsc>(
    bank.bankName
      ? { state: "found", bank: bank.bankName, branch: bank.branch }
      : { state: "idle" },
  );
  const [upi, setUpi] = useState<Upi>(
    bank.upiVerified ? { state: "ok", name: bank.upiName } : { state: "idle" },
  );
  const [saving, setSaving] = useState(false);
  const set = (p: Partial<BankDetails>) => setBd((b) => ({ ...b, ...p }));

  const ifscValid = IFSC_RE.test(bd.ifsc);

  // Debounced IFSC lookup whenever a well-formed code is entered.
  useEffect(() => {
    if (!ifscValid) {
      setIfsc({ state: "idle" });
      return;
    }
    if (bd.ifsc === bank.ifsc && bank.bankName) {
      setIfsc({ state: "found", bank: bank.bankName, branch: bank.branch });
      return;
    }
    let live = true;
    setIfsc({ state: "loading" });
    const t = setTimeout(() => {
      services
        .lookupIfsc(bd.ifsc)
        .then(
          (r) =>
            live &&
            setIfsc(
              r
                ? { state: "found", bank: r.bank, branch: r.branch }
                : { state: "notfound" },
            ),
        )
        .catch(() => live && setIfsc({ state: "error" }));
    }, 350);
    return () => {
      live = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bd.ifsc, ifscValid]);

  const accOk = bd.accountNumber.length >= 9 && bd.accountNumber === acc2;
  const accMsg: FieldMessage | null = !acc2
    ? null
    : accOk
      ? { tone: "ok", text: "✓ Account numbers match" }
      : acc2.length < bd.accountNumber.length
        ? { tone: "muted", text: "Keep typing…" }
        : { tone: "bad", text: "Account numbers don’t match" };

  const ifscMsg: FieldMessage | null = !bd.ifsc
    ? null
    : bd.ifsc.length < 11
      ? { tone: "muted", text: "11 characters, e.g. SBIN0070123" }
      : !ifscValid
        ? { tone: "bad", text: "That IFSC doesn’t look right" }
        : ifsc.state === "loading"
          ? { tone: "muted", text: "Looking up branch…" }
          : ifsc.state === "found"
            ? { tone: "ok", text: `✓ ${ifsc.bank} · ${ifsc.branch}` }
            : ifsc.state === "notfound"
              ? { tone: "bad", text: "No bank branch found for this IFSC" }
              : ifsc.state === "error"
                ? {
                    tone: "bad",
                    text: "Couldn’t check the IFSC. Check your connection.",
                  }
                : null;

  const upiMsg: FieldMessage | null =
    upi.state === "ok"
      ? { tone: "ok", text: `✓ Verified${upi.name ? " · " + upi.name : ""}` }
      : upi.state === "bad"
        ? { tone: "bad", text: upi.reason ?? "Couldn’t verify this UPI ID" }
        : upi.state === "loading"
          ? { tone: "muted", text: "Verifying…" }
          : null;

  const valid =
    bd.mode === "bank"
      ? !!bd.holder.trim() && accOk && ifsc.state === "found"
      : upi.state === "ok";

  const verify = async () => {
    if (!UPI_RE.test(bd.upi))
      return setUpi({ state: "bad", reason: "Enter a UPI ID like name@bank" });
    setUpi({ state: "loading" });
    try {
      const r = await services.verifyUpi(bd.upi);
      setUpi(
        r.ok
          ? { state: "ok", name: r.name }
          : { state: "bad", reason: r.reason },
      );
    } catch {
      setUpi({ state: "bad", reason: "Couldn’t reach the bank. Try again." });
    }
  };

  const save = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      await onSave({
        ...bd,
        holder: bd.holder.trim(),
        bankName: ifsc.state === "found" ? ifsc.bank : bd.bankName,
        branch: ifsc.state === "found" ? ifsc.branch : bd.branch,
        upiVerified: upi.state === "ok",
        upiName: upi.state === "ok" ? upi.name : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + HEADER_H,
          paddingBottom: insets.bottom + 40,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle>Get paid to</SectionTitle>
        <Segmented
          options={MODES.map((m) => m.label)}
          index={MODES.findIndex((m) => m.value === bd.mode)}
          onChange={(i) => set({ mode: MODES[i].value })}
          height={42}
          fontSize={12}
          style={styles.mx}
        />

        {bd.mode === "bank" ? (
          <>
            <Card style={styles.form}>
              <TextField
                label="Account holder name"
                value={bd.holder}
                onChangeText={(holder) => set({ holder })}
                placeholder="As printed on your passbook"
                hint="Must match the name on your Aadhaar."
                autoCapitalize="words"
              />
              <TextField
                label="Account number"
                value={bd.accountNumber}
                onChangeText={(v) => set({ accountNumber: digits(v) })}
                placeholder="e.g. 3021 4567 4821"
                keyboardType="number-pad"
                mono
                secureTextEntry={false}
              />
              <TextField
                label="Confirm account number"
                value={acc2}
                onChangeText={(v) => setAcc2(digits(v))}
                placeholder="Re-enter account number"
                keyboardType="number-pad"
                mono
                message={accMsg}
                contextMenuHidden
              />
              <TextField
                label="IFSC code"
                value={bd.ifsc}
                onChangeText={(v) =>
                  set({
                    ifsc: v
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 11),
                  })
                }
                placeholder="e.g. SBIN0070123"
                autoCapitalize="characters"
                autoCorrect={false}
                mono
                message={ifscMsg}
              />
              <View>
                <Text style={styles.label}>Account type</Text>
                <View style={styles.chips}>
                  {TYPES.map((t) => (
                    <SelectChip
                      key={t}
                      label={t}
                      selected={t === bd.accountType}
                      onPress={() => set({ accountType: t })}
                    />
                  ))}
                </View>
              </View>
            </Card>
            <InfoNote>
              We’ll send ₹1 to this account to confirm it. Payouts switch over
              once it arrives, usually within a few minutes.
            </InfoNote>
          </>
        ) : (
          <>
            <Card style={styles.form}>
              <View>
                <Text style={styles.label}>UPI ID</Text>
                <View style={styles.upiRow}>
                  <TextField
                    containerStyle={styles.grow}
                    value={bd.upi}
                    onChangeText={(v) => {
                      set({ upi: v.trim(), upiVerified: false });
                      setUpi({ state: "idle" });
                    }}
                    placeholder="name@bank"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    accessibilityLabel="UPI ID"
                  />
                  <PrimaryButton
                    label="Verify"
                    height={42}
                    fontSize={12.5}
                    loading={upi.state === "loading"}
                    onPress={verify}
                  />
                </View>
                {upiMsg ? (
                  <Text
                    style={[
                      styles.msg,
                      {
                        color:
                          upiMsg.tone === "ok"
                            ? C.ok
                            : upiMsg.tone === "bad"
                              ? C.bad
                              : C.muted,
                      },
                    ]}
                  >
                    {upiMsg.text}
                  </Text>
                ) : null}
              </View>
            </Card>
            <InfoNote>
              UPI payouts arrive instantly. Keep a bank account on file as a
              backup for amounts above ₹1,00,000.
            </InfoNote>
          </>
        )}

        <PrimaryButton
          label="Save bank details"
          disabled={!valid}
          loading={saving}
          onPress={save}
          style={styles.save}
        />
      </ScrollView>
      <PageHeader
        title="Bank details"
        onBack={onBack}
        right={
          <HeaderAction
            label="Save"
            disabled={!valid || saving}
            onPress={save}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mx: { marginHorizontal: 14 },
  form: { marginTop: 14, marginHorizontal: 14, padding: 14, gap: 12 },
  label: { marginBottom: 6, ...font("400", 10.5, C.muted) },
  chips: { flexDirection: "row", gap: 6 },
  upiRow: { flexDirection: "row", gap: 8 },
  grow: { flex: 1, minWidth: 0 },
  msg: { marginTop: 6, ...font("400", 11, C.muted, 15) },
  save: { marginTop: 24, marginHorizontal: 14 },
});
