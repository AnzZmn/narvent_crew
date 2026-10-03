import React, { useEffect, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileBackground from "../components/ProfileBackground";
import DetailHeader from "../components/DetailHeader";
import Field from "../components/Field";
import { P, Variant, VariantContext } from "../components/theme";
import type { BankDetails } from "../types";

export type PaymentSettingsProps = {
  bank: BankDetails;
  /** called with the edited values when leaving the screen */
  onBack: (bank: BankDetails) => void;
  onChange?: (bank: BankDetails) => void;
  variant?: Variant;
};

/** "Settings" – editable Account No, IFSC, Account Name, UPI ID. Opened from Payment Details → Edit. */
export default function PaymentSettings({
  bank,
  onBack,
  onChange,
  variant,
}: PaymentSettingsProps) {
  const insets = useSafeAreaInsets();
  const [v, setV] = useState(bank);
  const set = (k: keyof BankDetails) => (text: string) => {
    const next = { ...v, [k]: text };
    setV(next);
    onChange?.(next);
  };
  const back = () => onBack(v);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      back();
      return true;
    });
    return () => sub.remove();
  });

  const body = (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ProfileBackground settings />
      <DetailHeader title="Settings" onBack={back} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <Text style={styles.title} accessibilityRole="header">
            Payment Details
          </Text>
          <View style={styles.stack}>
            <Field
              label="Account No:"
              value={v.accountNo}
              onChangeText={set("accountNo")}
              autoCapitalize="characters"
            />
            <Field
              label="IFSC Code:"
              value={v.ifsc}
              onChangeText={set("ifsc")}
              autoCapitalize="characters"
            />
            <Field
              label="Account Name:"
              value={v.accountName}
              onChangeText={set("accountName")}
              autoCapitalize="characters"
            />
            <Field
              label="UPI ID:"
              value={v.upiId}
              onChangeText={set("upiId")}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
  return variant ? (
    <VariantContext.Provider value={variant}>{body}</VariantContext.Provider>
  ) : (
    body
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
  flex: { flex: 1 },
  content: { paddingTop: 22, paddingHorizontal: 14 },
  title: { fontSize: 12, fontWeight: "500", color: P.settingsHeading },
  stack: { marginTop: 12, rowGap: 10 },
});
