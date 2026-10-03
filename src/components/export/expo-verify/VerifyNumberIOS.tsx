/**
 * Narvent — Verify Number, iOS glass (iPhone SE 375×667 / iPhone 15·16 393×852).
 * Expo + StyleSheet.create. No NativeWind.
 *
 *   npx expo install expo-blur react-native-svg react-native-safe-area-context
 *
 * Wrap the app root in <SafeAreaProvider>.
 *
 * Frosted surfaces: back button, card and the six OTP cells are BlurViews with
 * a translucent white fill, white hairline border and 1 px top highlight;
 * lavender glows behind give the blur colour. One hidden TextInput with
 * textContentType="oneTimeCode" drives all six cells, so the iOS keyboard's
 * "From Messages" suggestion fills the whole code. Offsets come from the
 * height left after safe-area insets; with the keyboard up the gaps tighten
 * so Submit and Resend stay above the keyboard on the SE.
 */
import React, { useEffect, useRef, useState } from "react";
import {
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
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from "react-native-svg";

const PURPLE = "#7D69FF";
const INK = "#0E0E14";
const MUTED = "#6F6A92";
const TEXTURE = require("./assets/arrow-texture.png");

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

function BackArrow() {
  return (
    <Svg width={20} height={15} viewBox="0 0 22 16" fill="none">
      <Path
        d="M21 8H2M2 8L8.4 1.6M2 8L8.4 14.4"
        stroke={INK}
        strokeWidth={2.4}
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
        <RadialGradient id="gv1" cx="16%" cy="26%" r="55%">
          <Stop offset="0" stopColor="#B7A8FF" stopOpacity="0.75" />
          <Stop offset="1" stopColor="#B7A8FF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="gv2" cx="90%" cy="72%" r="60%">
          <Stop offset="0" stopColor="#9C88FF" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#9C88FF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient
          id="gvw"
          cx="50%"
          cy="22%"
          rx="90%"
          ry="46%"
          fx="50%"
          fy="22%"
        >
          <Stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#gv1)" />
      <Rect width={width} height={height} fill="url(#gv2)" />
      <Rect width={width} height={height} fill="url(#gvw)" />
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
  /** Shown for context only, e.g. "+91 91234 56789". */
  phone?: string;
  onBack?: () => void;
  onSubmit?: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
};

export default function VerifyNumberIOS({
  phone,
  onBack,
  onSubmit,
  onResend,
}: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const kb = useKeyboardVisible();
  const inputRef = useRef<TextInput>(null);

  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  const usable = height - insets.top - insets.bottom;
  const compact = usable < 640; // iPhone SE
  const headerTop = usable * (compact ? 0.012 : 0.02);
  const side = width * 0.04;
  const cardGap = usable * 0.018;
  const bottom = kb
    ? 10
    : Math.max(usable * (compact ? 0.024 : 0.03), insets.bottom ? 8 : 16);
  const padTop = kb ? 22 : usable * (compact ? 0.05 : 0.06);
  const padBottom = kb ? 16 : usable * (compact ? 0.03 : 0.036);
  const cellsTop = kb ? 20 : usable * (compact ? 0.05 : 0.064);
  const buttonTop = kb ? 18 : usable * (compact ? 0.03 : 0.036);
  const resendTop = kb ? 10 : usable * 0.02;

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const complete = code.length === CODE_LENGTH;
  const disabled = !complete || busy;

  const submit = async () => {
    if (disabled) return;
    Keyboard.dismiss();
    setBusy(true);
    try {
      await onSubmit?.(code);
    } catch (err) {
      console.error("[VerifyNumber] onSubmit failed", err);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setCode("");
    setCooldown(RESEND_SECONDS);
    inputRef.current?.focus();
    try {
      await onResend?.();
    } catch (err) {
      console.error("[VerifyNumber] onResend failed", err);
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
        <View
          style={[
            styles.header,
            { paddingTop: headerTop, paddingHorizontal: side },
          ]}
        >
          <Pressable
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Glass
              intensity={50}
              fill="rgba(255,255,255,0.5)"
              style={styles.backBtn}
            >
              <BackArrow />
            </Glass>
          </Pressable>
          <Text style={styles.headerTitle}>Verify Number</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Glass
          intensity={60}
          fill="rgba(255,255,255,0.42)"
          style={[
            styles.card,
            {
              marginTop: cardGap,
              marginHorizontal: side,
              marginBottom: bottom,
              paddingTop: padTop,
              paddingBottom: padBottom,
            },
          ]}
        >
          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.subtitle}>
            {phone
              ? `Enter the OTP sent to ${phone}`
              : "Enter your OTP code below"}
          </Text>

          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={[styles.cells, { marginTop: cellsTop }]}
            accessibilityLabel={`One-time code, ${code.length} of ${CODE_LENGTH} digits entered`}
          >
            {Array.from({ length: CODE_LENGTH }, (_, i) => {
              const digit = code[i];
              const active =
                focused && i === Math.min(code.length, CODE_LENGTH - 1);
              return (
                <Glass
                  key={i}
                  intensity={40}
                  fill={
                    active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)"
                  }
                  style={[styles.cell, active && styles.cellActive]}
                >
                  {digit ? <Text style={styles.digit}>{digit}</Text> : <View />}
                </Glass>
              );
            })}
          </Pressable>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(v) =>
              setCode(v.replace(/\D/g, "").slice(0, CODE_LENGTH))
            }
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={CODE_LENGTH}
            caretHidden
            autoFocus
            style={styles.hiddenInput}
          />

          <Pressable
            onPress={submit}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Submit code"
            accessibilityState={{ disabled, busy }}
            style={{ marginTop: buttonTop }}
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
                  {busy ? "Verifying…" : "Submit"}
                </Text>
              </View>
            )}
          </Pressable>

          <View style={[styles.resend, { marginTop: resendTop }]}>
            <Text style={styles.resendHint}>Did'nt receive the code ?</Text>
            <Pressable
              onPress={resend}
              disabled={cooldown > 0}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityState={{ disabled: cooldown > 0 }}
            >
              <Text
                style={[
                  styles.resendLink,
                  cooldown > 0 && styles.resendLinkWait,
                ]}
              >
                {cooldown > 0
                  ? `Resend a new code in ${cooldown}s`
                  : "Resend a new code"}
              </Text>
            </Pressable>
          </View>
        </Glass>
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
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
  },

  header: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: { width: 40 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    color: INK,
    letterSpacing: -0.41,
  },

  card: {
    flex: 1,
    minHeight: 0,
    borderRadius: 26,
    borderColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: "8%",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: INK,
    letterSpacing: -0.4,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 19,
    color: MUTED,
  },

  cells: { flexDirection: "row", columnGap: "2.4%" },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cellActive: { borderColor: PURPLE, borderWidth: 1.5 },
  digit: { fontSize: 20, fontWeight: "600", color: INK },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: INK },
  hiddenInput: { position: "absolute", width: 1, height: 1, opacity: 0 },

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

  resend: { alignItems: "center" },
  resendHint: {
    fontSize: 13,
    lineHeight: 20,
    color: MUTED,
    textAlign: "center",
  },
  resendLink: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    color: INK,
    textAlign: "center",
  },
  resendLinkWait: { color: MUTED, fontWeight: "500" },
});
