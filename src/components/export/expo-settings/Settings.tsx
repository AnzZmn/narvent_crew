import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenBackground from "./components/ScreenBackground";
import DetailHeader from "./components/DetailHeader";
import Surface from "./components/Surface";
import SectionPill from "./components/SectionPill";
import SettingsRow from "./components/SettingsRow";
import GradientFill from "./components/GradientFill";
import { Chevron } from "./components/icons";
import SettingsDetail from "./SettingsDetail";
import { ABOUT_ROWS, ACCOUNT_ROWS, samplePages, sampleUser } from "./pages";
import { C, DETAIL_MS, GAP, Variant, VariantContext } from "./theme";
import type { SettingsPage, SettingsPageId, SettingsUser } from "./types";

export type SettingsProps = {
  onBack: () => void;
  user?: SettingsUser;
  pages?: Partial<Record<SettingsPageId, SettingsPage>>;
  /** return true to handle a row yourself (e.g. route to the existing MyProfile / PaymentSettings) */
  onOpenPage?: (id: SettingsPageId) => boolean | void;
  onSave?: (id: SettingsPageId, values: Record<string, string>) => void;
  notificationsOn?: boolean;
  onToggleNotifications?: (on: boolean) => void;
  onLogout?: () => void;
  version?: string;
  logo?: { mark: any; wordmark: any };
  variant?: Variant;
  /** false while the carousel is closed → resets to the list and disables the Android back handler */
  active?: boolean;
  /** true while a detail page is open */
  onPageChange?: (open: boolean) => void;
};

export default function Settings(props: SettingsProps) {
  const { variant } = props;
  const body = <SettingsBody {...props} />;
  return variant ? (
    <VariantContext.Provider value={variant}>{body}</VariantContext.Provider>
  ) : (
    body
  );
}

function SettingsBody({
  onBack,
  user = sampleUser,
  pages,
  onOpenPage,
  onSave,
  notificationsOn,
  onToggleNotifications,
  onLogout,
  version = "1.0.0",
  logo,
  active = true,
  onPageChange,
}: SettingsProps) {
  const [logoutPressed, setLogoutPressed] = useState(false);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const all = { ...samplePages, ...pages };
  const [page, setPage] = useState<SettingsPageId | null>(null);
  const [shown, setShown] = useState<SettingsPageId | null>(null);
  const [notifLocal, setNotifLocal] = useState(true);
  const notif = notificationsOn ?? notifLocal;
  const x = useRef(new Animated.Value(0)).current;

  const open = (id: SettingsPageId) => {
    if (onOpenPage?.(id) === true) return;
    setShown(id);
    setPage(id);
  };
  const close = () => setPage(null);

  useEffect(() => {
    onPageChange?.(!!page);
    if (page) x.setValue(1);
    Animated.timing(x, {
      toValue: page ? 0 : 1,
      duration: DETAIL_MS,
      easing: Easing.bezier(0.22, 0.8, 0.26, 1),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !page) setShown(null);
    });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // carousel closed → drop back to the list
  useEffect(() => {
    if (!active) {
      setPage(null);
      setShown(null);
    }
  }, [active]);

  // Android hardware back: detail → list → home
  useEffect(() => {
    if (!active) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (page) close();
      else onBack();
      return true;
    });
    return () => sub.remove();
  }, [active, page, onBack]);

  const toggleNotif = () => {
    const next = !notif;
    if (notificationsOn === undefined) setNotifLocal(next);
    onToggleNotifications?.(next);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <ScreenBackground />
      <View style={{ paddingTop: insets.top }}>
        <DetailHeader title="Settings" onBack={onBack} />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 34 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => open("profile")}
          accessibilityRole="button"
          accessibilityLabel={`${user.name}, open My Profile`}
        >
          {({ pressed }) => (
            <Surface style={[styles.profile, pressed && { opacity: 0.7 }]}>
              <View style={styles.avatar}>
                <GradientFill
                  colors={[C.violetSoft, C.violet]}
                  stops={[0, 1]}
                  radius={26}
                />
                <Text style={styles.initials}>{user.initials}</Text>
              </View>
              <View style={styles.profileText}>
                <Text style={styles.name} numberOfLines={1}>
                  {user.name}
                </Text>
                <Text style={styles.phone} numberOfLines={1}>
                  {user.phone}
                </Text>
              </View>
              {user.verified && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Verified</Text>
                </View>
              )}
              <Chevron />
            </Surface>
          )}
        </Pressable>

        <SectionPill title="Account" />
        <Surface style={styles.group}>
          {ACCOUNT_ROWS.map((r, i) => (
            <SettingsRow
              key={r.id}
              icon={r.icon}
              label={r.label}
              sub={r.sub}
              first={i === 0}
              onPress={() => open(r.id)}
            />
          ))}
        </Surface>

        <SectionPill title="Preferences" />
        <Surface style={styles.group}>
          <SettingsRow
            icon="bell"
            label="Notifications"
            sub={notif ? "Job alerts and payout updates on" : "Off"}
            first
            toggle={notif}
            onPress={toggleNotif}
          />
        </Surface>

        <SectionPill title="About Us" />
        <Surface style={styles.group}>
          {ABOUT_ROWS.map((r, i) => (
            <SettingsRow
              key={r.id}
              icon={r.icon}
              label={r.label}
              sub={r.sub}
              first={i === 0}
              onPress={() => open(r.id)}
            />
          ))}
        </Surface>

        <Pressable
          onPress={onLogout}
          onPressIn={() => setLogoutPressed(true)}
          onPressOut={() => setLogoutPressed(true)}
          style={[styles.logout, logoutPressed && { opacity: 0.6 }]}
          accessibilityRole="button"
        >
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
        <Text style={styles.version}>{`Narvent v${version}`}</Text>
      </ScrollView>

      {shown && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [
                {
                  translateX: x.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width],
                  }),
                },
              ],
            },
          ]}
        >
          <SettingsDetail
            id={shown}
            page={all[shown]}
            onBack={close}
            onSave={onSave}
            logo={logo}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    marginHorizontal: GAP,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.violet,
  },
  initials: { fontSize: 17, fontWeight: "700", color: "#FFFFFF" },
  profileText: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, lineHeight: 18, fontWeight: "700", color: C.ink },
  phone: { marginTop: 4, fontSize: 11.5, color: C.muted },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: C.chipBg,
  },
  chipText: { fontSize: 10.5, fontWeight: "500", color: C.chipText },
  group: { marginHorizontal: GAP, paddingHorizontal: 14 },
  logout: {
    marginHorizontal: GAP,
    marginTop: 22,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: C.dangerBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: { fontSize: 14, fontWeight: "500", color: C.danger },
  version: { marginTop: 14, textAlign: "center", fontSize: 11, color: C.faint },
});
