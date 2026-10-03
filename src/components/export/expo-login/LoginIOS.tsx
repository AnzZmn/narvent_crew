/**
 * Narvent — Log in, iOS glass (iPhone SE 375×667 / iPhone 15·16 393×852).
 * Expo + StyleSheet.create. No NativeWind.
 *
 *   npx expo install expo-blur react-native-svg react-native-safe-area-context
 *
 * Wrap the app root in <SafeAreaProvider>.
 *
 * Frosted surfaces: the card, logo badge and phone field are BlurViews with a
 * translucent white fill, a bright hairline border and a 1 px top highlight;
 * lavender glows sit behind so the blur picks up colour. Offsets come from the
 * height left after safe-area insets, so the SE (no notch, home button) and
 * the 15/16 (Dynamic Island + home indicator) both fit. With the keyboard up
 * the card lifts and the illustration shrinks so the OTP button stays visible.
 */
import React, { useEffect, useState } from "react";
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
import { BlurView } from "expo-blur";
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
const PLACEHOLDER = "#8C88AA";
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
        <Mask id="badgeClipI">
          <Rect
            x={160.166}
            y={353}
            width={44.2379}
            height={65.1365}
            fill="#fff"
          />
        </Mask>
      </Defs>
      <G mask="url(#badgeClipI)">
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

function GlassGround({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="gl1" cx="16%" cy="26%" r="55%">
          <Stop offset="0" stopColor="#B7A8FF" stopOpacity="0.75" />
          <Stop offset="1" stopColor="#B7A8FF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="gl2" cx="90%" cy="72%" r="60%">
          <Stop offset="0" stopColor="#9C88FF" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#9C88FF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient
          id="glw"
          cx="50%"
          cy="20%"
          rx="90%"
          ry="46%"
          fx="50%"
          fy="20%"
        >
          <Stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#gl1)" />
      <Rect width={width} height={height} fill="url(#gl2)" />
      <Rect width={width} height={height} fill="url(#glw)" />
    </Svg>
  );
}

function Glass({
  intensity,
  fill,
  style,
  children,
}: {
  intensity: number;
  fill: string;
  style?: any;
  children?: React.ReactNode;
}) {
  return (
    <BlurView
      intensity={intensity}
      tint="light"
      style={[styles.glassBase, style]}
    >
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: fill }]}
        pointerEvents="none"
      />
      <View style={styles.highlight} pointerEvents="none" />
      {children}
    </BlurView>
  );
}

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const s = Keyboard.addListener("keyboardWillShow", () => setVisible(true));
    const h = Keyboard.addListener("keyboardWillHide", () => setVisible(false));
    return () => {
      s.remove();
      h.remove();
    };
  }, []);
  return visible;
}

type Props = {
  onRequestOtp?: (phone: string) => void | Promise<void>;
  onCountryPress?: () => void;
  countryCode?: string;
  countryLabel?: string;
};

export default function LoginIOS({
  onRequestOtp,
  onCountryPress,
  countryCode = "+91",
  countryLabel = "IN",
}: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const kb = useKeyboardVisible();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const usable = height - insets.top - insets.bottom;
  const compact = usable < 640; // iPhone SE
  const titleTop = usable * (compact ? 0.02 : 0.03);
  const cardTopGap = usable * (compact ? 0.022 : 0.03);
  const sideInset = width * 0.04;
  const bottomInset = kb
    ? 10
    : Math.max(usable * (compact ? 0.024 : 0.03), insets.bottom ? 8 : 16);
  const badge = kb
    ? 64
    : Math.max(72, Math.min(width * (compact ? 0.2 : 0.23), 96));
  const cardPadTop = kb
    ? badge * 0.62
    : Math.max(usable * (compact ? 0.075 : 0.09), badge * 0.62);
  const blockGap = kb ? 14 : usable * (compact ? 0.028 : 0.034);

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
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={TEXTURE}
        resizeMode="repeat"
        style={StyleSheet.absoluteFill}
        imageStyle={styles.texture}
      />
      <GlassGround width={width} height={height} />

      <KeyboardAvoidingView
        behavior="padding"
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: kb ? 0 : insets.bottom },
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
          <Glass
            intensity={60}
            fill="rgba(255,255,255,0.42)"
            style={[
              styles.card,
              {
                top: badge * 0.5,
                paddingTop: cardPadTop,
                paddingBottom: blockGap,
              },
            ]}
          >
            <View style={styles.illustrationBox}>
              <LoginIllustration />
            </View>

            <View style={[styles.form, { marginTop: blockGap }]}>
              <Text style={styles.label}>Phone number</Text>
              <Glass
                intensity={40}
                fill="rgba(255,255,255,0.5)"
                style={styles.field}
              >
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
                  style={styles.input}
                  accessibilityLabel="Phone number"
                />
              </Glass>

              <Pressable
                onPress={submit}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Send OTP"
                accessibilityState={{ disabled, busy }}
                style={styles.buttonHit}
              >
                {({ pressed }) => (
                  <View
                    style={[
                      styles.button,
                      disabled && styles.buttonDisabled,
                      pressed && !disabled && styles.buttonPressed,
                    ]}
                  >
                    <View style={styles.buttonHighlight} pointerEvents="none" />
                    <Text style={styles.buttonText}>
                      {busy ? "Sending OTP" : "Get Started"}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </Glass>

          <Glass
            intensity={70}
            fill="rgba(255,255,255,0.55)"
            style={[
              styles.badge,
              {
                width: badge,
                height: badge / 1.05,
                marginLeft: -badge / 2,
                borderRadius: badge * 0.24,
              },
            ]}
          >
            <BadgeMark size={badge * 0.38} />
          </Glass>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EFEBFF", overflow: "hidden" },
  texture: { opacity: 0.9, width: 360, height: 800 },
  content: { flex: 1 },

  glassBase: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
  },

  title: {
    textAlign: "center",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    color: INK,
    letterSpacing: -0.41,
  },

  cardArea: { flex: 1, minHeight: 0 },
  card: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    borderColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: "8%",
  },
  illustrationBox: {
    flex: 1,
    minHeight: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.34)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    overflow: "hidden",
    padding: 8,
  },
  illustration: { width: "100%", height: "100%" },

  form: { flexShrink: 0 },
  label: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "500",
    color: INK,
    marginBottom: 8,
  },
  field: {
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: 14,
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    height: "100%",
  },
  countryText: { fontSize: 16, fontWeight: "500", color: INK },
  divider: { width: 1, height: 22, backgroundColor: "rgba(14,14,20,0.14)" },
  code: { fontSize: 16, color: INK },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: INK,
    padding: 0,
    letterSpacing: 0.3,
  },

  buttonHit: { marginTop: 14 },
  button: {
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonHighlight: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  buttonDisabled: {
    backgroundColor: "#C4BBFF",
    borderColor: "rgba(255,255,255,0.6)",
  },
  buttonPressed: { backgroundColor: "#634FE8" },
  buttonText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },

  badge: {
    position: "absolute",
    top: 0,
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(255,255,255,0.85)",
  },
});
