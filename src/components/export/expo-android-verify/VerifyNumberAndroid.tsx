/**
 * Narvent — Verify Number (Android S 360×800 / Android L 412×915, and anything between).
 * Expo + StyleSheet.create. No NativeWind.
 *
 *   npx expo install react-native-svg react-native-safe-area-context
 *
 * Wrap the app root in <SafeAreaProvider>.
 *
 * Mirrors section 3 of the mockup: textured ground with white wash, back arrow
 * + "Verify Number" header, white card with title, subtitle, six OTP cells,
 * Submit and the resend prompt. Screen-relative offsets use the mockup's
 * container-unit rules via useWindowDimensions(); the six cells split the card
 * width evenly, so they stay square on both S and L.
 *
 * The cells are driven by one hidden TextInput (numeric, one-time-code
 * autofill), so the Android SMS Retriever / keyboard suggestion fills all six.
 * Empty cells show the mockup's dot; the next cell to type into is outlined.
 */
import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Keyboard,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from "react-native-svg";

const PURPLE = "#7D69FF";
const INK = "#0E0E14";
const MUTED = "#A6A3BF";
const LINE = "#E4E1F5";
import TEXTURE from "./assets/arrow-texture.png";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

function BackArrow() {
  return (
    <Svg width={22} height={16} viewBox="0 0 22 16" fill="none">
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

/** mockup: radial-gradient(112% 62% at 50% 24%, #fff 38%, transparent) */
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
          id="wash"
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
      <Rect width={width} height={height} fill="url(#wash)" />
    </Svg>
  );
}

type Props = {
  /** Shown for context only, e.g. "+91 91234 56789". */
  phone?: string;
  onBack?: () => void;
  onSubmit?: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
};

export default function VerifyNumberAndroid({
  phone,
  onBack,
  onSubmit,
  onResend,
}: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  // mockup rules: 6.4cqh header top, 3.4cqw side, 3.2cqh card gap, 6.6cqh bottom,
  // 5.6cqh card pad top, 6.2cqh cells gap, 3.4cqh button gap, 1.8cqh resend gap
  const headerTop = height * 0.064;
  const side = width * 0.034;
  const cardGap = height * 0.032;
  const bottom = height * 0.066;
  const padTop = height * 0.056;
  const padBottom = height * 0.034;
  const cellsTop = height * 0.062;
  const buttonTop = height * 0.034;
  const resendTop = height * 0.018;
  const indicatorW = Math.min(width * 0.26, 96);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const complete = code.length === CODE_LENGTH;

  const submit = async () => {
    if (!complete || busy) return;
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

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const focusInput = () => {
    // Already focused and keyboard is visible → do nothing
    if (focused && keyboardVisible) {
      return;
    }

    // Input still has focus but keyboard was dismissed
    if (focused && !keyboardVisible) {
      inputRef.current?.blur();

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return;
    }

    // Not focused → simply focus
    inputRef.current?.focus();
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setCode("");
    setCooldown(RESEND_SECONDS);
    try {
      await onResend?.();
    } catch (err) {
      console.error("[VerifyNumber] onResend failed", err);
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

      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
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
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.headerSide}
          >
            <BackArrow />
          </Pressable>
          <Text style={styles.headerTitle}>Verify Number</Text>
          <View style={styles.headerSide} />
        </View>

        <View
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
            onPress={focusInput}
            style={[styles.cells, { marginTop: cellsTop }]}
            accessibilityLabel={`One-time code, ${code.length} of ${CODE_LENGTH} digits entered`}
          >
            {Array.from({ length: CODE_LENGTH }, (_, i) => {
              const digit = code[i];
              const active =
                focused && i === Math.min(code.length, CODE_LENGTH - 1);
              return (
                <View
                  key={i}
                  style={[styles.cell, active && styles.cellActive]}
                >
                  {digit ? <Text style={styles.digit}>{digit}</Text> : <View />}
                </View>
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
            onSubmitEditing={submit}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            importantForAutofill="yes"
            maxLength={CODE_LENGTH}
            caretHidden
            autoFocus
            showSoftInputOnFocus
            style={styles.hiddenInput}
          />

          <Pressable
            onPress={submit}
            disabled={!complete || busy}
            android_ripple={{ color: "rgba(255,255,255,0.22)" }}
            accessibilityRole="button"
            accessibilityLabel="Submit code"
            accessibilityState={{ disabled: !complete || busy, busy }}
            style={[
              styles.button,
              { marginTop: buttonTop },
              (!complete || busy) && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {busy ? "Verifying…" : "Submit"}
            </Text>
          </Pressable>

          <View style={[styles.resend, { marginTop: resendTop }]}>
            <Text style={styles.resendHint}>Did'nt receive the code ?</Text>
            <Pressable
              onPress={resend}
              disabled={cooldown > 0}
              hitSlop={8}
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
        </View>
      </View>

      <View
        style={[
          styles.gestureBar,
          { width: indicatorW, marginLeft: -indicatorW / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7FF", overflow: "hidden" },
  texture: { opacity: 0.55, width: 360, height: 800 },
  content: { ...StyleSheet.absoluteFill },

  header: { flexDirection: "row", alignItems: "center" },
  headerSide: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
    color: INK,
    letterSpacing: -0.15,
  },

  card: {
    flex: 1,
    minHeight: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: "8%",
    elevation: 6,
    shadowColor: "#3C288C",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    textAlign: "center",
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "700",
    color: INK,
    letterSpacing: -0.38,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 17.5,
    color: MUTED,
  },

  cells: { flexDirection: "row", columnGap: "2.4%" },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: LINE,
    alignItems: "center",
    justifyContent: "center",
  },
  cellActive: { borderColor: PURPLE, borderWidth: 1.5 },
  digit: { fontSize: 15, fontWeight: "500", color: INK },
  hiddenInput: { position: "absolute", width: 1, height: 1, opacity: 0.01 },

  button: {
    height: 46,
    borderRadius: 23,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 4,
    shadowColor: PURPLE,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  buttonDisabled: { opacity: 0.55, elevation: 0 },
  buttonText: { fontSize: 15, fontWeight: "500", color: "#FFFFFF" },

  resend: { alignItems: "center" },
  resendHint: {
    fontSize: 11.5,
    lineHeight: 19.5,
    color: MUTED,
    textAlign: "center",
  },
  resendLink: {
    fontSize: 11.5,
    lineHeight: 19.5,
    fontWeight: "700",
    color: INK,
    textAlign: "center",
  },
  resendLinkWait: { color: MUTED, fontWeight: "500" },

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
