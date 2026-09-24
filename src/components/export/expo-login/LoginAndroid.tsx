/**
 * Narvent — Log in, Android (S 360×800 / L 412×915, and anything between).
 * Expo + StyleSheet.create. No NativeWind.
 *
 *   npx expo install react-native-svg react-native-safe-area-context
 *
 * Wrap the app root in <SafeAreaProvider>.
 *
 * Flat Material surfaces: solid white card with elevation, white logo badge
 * straddling the card's top edge, outlined phone field, solid purple OTP
 * button with ripple. Offsets follow the mockup's container-unit rules via
 * useWindowDimensions(). The OTP button stays disabled until the number is a
 * valid 10-digit Indian mobile (starts 6–9).
 */
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Defs,
  G,
  Mask,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import LoginIllustration from "../reanimated/LoginIllustration";

const PURPLE = "#7D69FF";
const INK = "#0E0E14";
const PLACEHOLDER = "#A6A3BF";
const TEXTURE = require("./assets/arrow-texture.png");
const ILLUSTRATION = require("./assets/login-illustration.png");

function BadgeMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={(size * 94) / 53} viewBox="152 353 53 94">
      <Path
        d="M160.166 446.358L152.161 430.493L174.048 446.357L160.166 446.358Z"
        fill={PURPLE}
      />
      <Path
        d="M160.166 384.883L178.471 395.027V446.358H160.166V384.883Z"
        fill={PURPLE}
      />
      <Defs>
        <Mask id="badgeClipA">
          <Rect
            x={160.166}
            y={353}
            width={44.2379}
            height={65.1365}
            fill="#fff"
          />
        </Mask>
      </Defs>
      <G mask="url(#badgeClipA)">
        <Path
          d="M160.082 355.594L204.405 379.948V418.145L186.542 408.289V389.96L160.082 375.384V355.594Z"
          fill={PURPLE}
        />
      </G>
    </Svg>
  );
}

function Caret() {
  return (
    <Svg width={10} height={6} viewBox="0 0 10 6" fill="none">
      <Path
        d="M1 1L5 5L9 1"
        stroke={INK}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Wash({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient
          id="washA"
          cx="50%"
          cy="24%"
          rx="112%"
          ry="62%"
          fx="50%"
          fy="24%"
        >
          <Stop offset="0.38" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#F8F7FF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#washA)" />
    </Svg>
  );
}

/** "9876543210" -> "98765 43210" */
function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}

type Props = {
  /** Receives the full number including country code, e.g. "+919876543210". */
  onRequestOtp?: (phone: string) => void | Promise<void>;
  onCountryPress?: () => void;
  countryCode?: string;
  countryLabel?: string;
};

export default function LoginAndroid({
  onRequestOtp,
  onCountryPress,
  countryCode = "+91",
  countryLabel = "IN",
}: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  // mockup rules: 7cqh, 3.2cqh, 3.4cqw, 6.6cqh, 9cqh, 3.4cqh, 23cqw (72–96)
  const titleTop = height * 0.07;
  const cardTopGap = height * 0.032;
  const sideInset = width * 0.034;
  const bottomInset = height * 0.066;
  const cardPadTop = height * 0.09;
  const blockGap = height * 0.034;
  const badge = Math.max(72, Math.min(width * 0.23, 96));
  const indicatorW = Math.min(width * 0.26, 96);

  const digits = phone.replace(/\D/g, "");
  const valid = /^[6-9]\d{9}$/.test(digits);
  const disabled = !valid || busy;

  const submit = async () => {
    if (disabled) return;
    Keyboard.dismiss();
    setBusy(true);
    try {
      await onRequestOtp?.(`${countryCode}${digits}`);
    } catch (err) {
      console.error("[Login] onRequestOtp failed", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={TEXTURE}
        resizeMode="repeat"
        style={StyleSheet.absoluteFill}
        imageStyle={styles.texture}
      />
      <Wash width={width} height={height} />

      <KeyboardAvoidingView
        behavior="padding"
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Text style={[styles.title, { marginTop: titleTop }]}>Log in</Text>

        <View
          style={[
            styles.cardArea,
            {
              marginTop: cardTopGap,
              marginHorizontal: sideInset,
              marginBottom: bottomInset,
            },
          ]}
        >
          <View
            style={[
              styles.card,
              {
                top: badge * 0.5,
                paddingTop: Math.max(cardPadTop, badge * 0.62),
                paddingBottom: blockGap,
              },
            ]}
          >
            <View style={styles.illustrationBox}>
              <LoginIllustration />
            </View>

            <View style={[styles.form, { marginTop: blockGap }]}>
              <Text style={styles.label}>Phone number</Text>
              <View style={styles.field}>
                <Pressable
                  onPress={onCountryPress}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Country ${countryLabel}, change`}
                  style={styles.country}
                >
                  <Text style={styles.countryText}>{countryLabel}</Text>
                  <Caret />
                </Pressable>
                <View style={styles.divider} />
                <Text style={styles.code}>{countryCode}</Text>
                <TextInput
                  value={phone}
                  onChangeText={(v) => setPhone(formatPhone(v))}
                  placeholder="00000 00000"
                  placeholderTextColor={PLACEHOLDER}
                  keyboardType="phone-pad"
                  autoComplete="tel-national"
                  textContentType="telephoneNumber"
                  maxLength={11}
                  returnKeyType="done"
                  onSubmitEditing={submit}
                  style={styles.input}
                  accessibilityLabel="Phone number"
                />
              </View>

              <View
                style={[
                  styles.buttonShell,
                  disabled && styles.buttonShellDisabled,
                ]}
              >
                <Pressable
                  onPress={submit}
                  disabled={disabled}
                  android_ripple={{ color: "rgba(255,255,255,0.25)" }}
                  accessibilityRole="button"
                  accessibilityLabel="Send OTP"
                  accessibilityState={{ disabled, busy }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {busy ? "Sending…" : "OTP"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.badge,
              {
                width: badge,
                height: badge / 1.05,
                marginLeft: -badge / 2,
                borderRadius: badge * 0.22,
              },
            ]}
          >
            <BadgeMark size={badge * 0.38} />
          </View>
        </View>
      </KeyboardAvoidingView>

      <View
        style={[
          styles.gestureBar,
          { width: indicatorW, marginLeft: -indicatorW / 2 },
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7FF", overflow: "hidden" },
  texture: { opacity: 0.55, width: 360, height: 800 },
  content: { flex: 1 },
  title: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
    color: INK,
    letterSpacing: -0.15,
  },

  cardArea: { flex: 1, minHeight: 0 },
  card: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: "8%",
    elevation: 6,
    shadowColor: "#3C288C",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  illustrationBox: {
    flex: 1,
    minHeight: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#FBFAFF",
    overflow: "hidden",
    padding: 8,
  },
  illustration: { width: "100%", height: "100%" },

  form: { flexShrink: 0 },
  label: {
    fontSize: 12.5,
    lineHeight: 15,
    fontWeight: "500",
    color: INK,
    marginBottom: 9,
  },
  field: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E1F5",
    backgroundColor: "#FFFFFF",
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    height: "100%",
  },
  countryText: { fontSize: 13.5, fontWeight: "500", color: INK },
  divider: { width: 1, height: 20, backgroundColor: "#E4E1F5" },
  code: { fontSize: 13.5, color: INK, includeFontPadding: false },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 13.5,
    color: INK,
    padding: 0,
    letterSpacing: 0.3,
  },

  buttonShell: {
    marginTop: 14,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: PURPLE,
    elevation: 4,
  },
  buttonShellDisabled: { backgroundColor: "#C4BBFF", elevation: 0 },
  button: { flex: 1, alignItems: "center", justifyContent: "center" },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.15,
    includeFontPadding: false,
  },

  badge: {
    position: "absolute",
    top: 0,
    left: "50%",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#3C288C",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
  },
  gestureBar: {
    position: "absolute",
    left: "50%",
    bottom: 6,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "#AFAFAF",
    opacity: 0.7,
  },
});
