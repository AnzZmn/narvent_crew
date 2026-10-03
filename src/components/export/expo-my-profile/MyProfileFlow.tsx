import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MyProfile, { MyProfileProps } from "./MyProfile";
import PaymentSettings from "./details/PaymentSettings";
import TabBar, { Tab } from "./components/TabBar";
import { VariantContext, Variant } from "./components/theme";
import { BankDetails, ProfileData, sampleProfile } from "./types";

export type MyProfileFlowProps = Omit<
  MyProfileProps,
  "data" | "onEditPayment" | "tabBarSpace"
> & {
  data?: ProfileData;
  onTabChange?: (tab: Tab) => void;
  onSaveBank?: (bank: BankDetails) => void;
  /** true when a navigator renders the tab bar once for all tabs (see expo-tabs/) */
  hideTabBar?: boolean;
  /** fires true when Settings opens, false when it closes */
  onOverlayChange?: (open: boolean) => void;
};

const TAB_H = 58;

/** My Profile + Settings + tab bar, without a navigation library. */
export default function MyProfileFlow({
  data = sampleProfile,
  variant,
  onTabChange,
  onSaveBank,
  hideTabBar = false,
  onOverlayChange,
  ...rest
}: MyProfileFlowProps) {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState(data);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    onOverlayChange?.(editing);
  }, [editing, onOverlayChange]);
  const tabBottom = Math.max(24, insets.bottom + 8);

  const closeSettings = useCallback(
    (bank: BankDetails) => {
      setProfile((p) => ({ ...p, bank }));
      onSaveBank?.(bank);
      setEditing(false);
    },
    [onSaveBank],
  );

  const content = (
    <View style={styles.root}>
      <MyProfile
        {...rest}
        data={profile}
        tabBarSpace={TAB_H + tabBottom - insets.bottom}
        onEditPayment={() => setEditing(true)}
      />
      {!editing && !hideTabBar && (
        <TabBar
          active="profile"
          onChange={(t) => onTabChange?.(t)}
          bottom={tabBottom}
        />
      )}
      {editing && (
        <View style={StyleSheet.absoluteFill}>
          <PaymentSettings bank={profile.bank} onBack={closeSettings} />
        </View>
      )}
    </View>
  );
  return variant ? (
    <VariantContext.Provider value={variant as Variant}>
      {content}
    </VariantContext.Provider>
  ) : (
    content
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
