/**
 * Narvent — Log in (Android S 360×800 / Android L 412×915, and anything between).
 * Expo + StyleSheet.create. No NativeWind.
 *
 *   npx expo install react-native-svg react-native-safe-area-context
 *
 * Wrap the app root in <SafeAreaProvider>.
 *
 * Static values live in StyleSheet.create. Values that depend on the screen
 * (title offset, card insets, badge size) come from useWindowDimensions(),
 * matching the mockup's container-unit rules, so S and L frames both fill.
 *
 * Keyboard behavior: when the phone field is focused and the keyboard opens,
 * the card (and its badge) slide up by however much the keyboard would
 * otherwise cover, so the input + button stay visible above it.
 */
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardEvent,
  Platform,
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
import TEXTURE from "./assets/arrow-texture.png";

const PURPLE = "#7D69FF";
const INK = "#0E0E14";
import ILLUSTRATION from "./assets/login-illustration.png";
import LoginIllustration from "../reanimated/LoginIllustration";

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
        <Mask id="badgeClip">
          <Rect
            x={160.166}
            y={353}
            width={44.2379}
            height={65.1365}
            fill="#fff"
          />
        </Mask>
      </Defs>
      <G mask="url(#badgeClip)">
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

/** White radial wash over the texture (mockup: 112% 62% at 50% 24%, solid to 38%). */
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
  /** Receives the full number including country code. */
  onRequestOtp?: (phone: string) => void;
  countryCode?: string;
  countryLabel?: string;
};

export default function LoginAndroid({
  onRequestOtp,
  countryCode = "+91",
  countryLabel = "IN",
}: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");

  // --- keyboard-aware card lift -------------------------------------------
  const cardLift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: KeyboardEvent) => {
      const keyboardHeight = e.endCoordinates?.height ?? 0;
      // Only lift by however much the keyboard actually eats into the
      // bottom inset/card area — never further than needed.
      const overlap = Math.max(
        0,
        keyboardHeight - insets.bottom - height * 0.066,
      );
      Animated.timing(cardLift, {
        toValue: -overlap,
        duration: e.duration ?? 220,
        useNativeDriver: true,
      }).start();
    };

    const onHide = (e: KeyboardEvent) => {
      Animated.timing(cardLift, {
        toValue: 0,
        duration: e.duration ?? 200,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [cardLift, insets.bottom, height]);
  // -------------------------------------------------------------------------

  // mockup rules: 7cqh, 3.2cqh, 3.4cqw, 6.6cqh, 5.2cqh, 9cqh, 3.4cqh, 23cqw (max 96)
  const titleTop = height * 0.07;
  const cardTopGap = height * 0.032;
  const sideInset = width * 0.034;
  const bottomInset = height * 0.066;
  const cardTop = height * 0.052;
  const cardPadTop = height * 0.09;
  const blockGap = height * 0.034;
  const badge = Math.min(width * 0.23, 96);
  const indicatorW = Math.min(width * 0.26, 96);

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
        <Text style={[styles.title, { marginTop: titleTop }]}>Log in</Text>

        <Animated.View
          style={[
            styles.cardArea,
            {
              marginTop: cardTopGap,
              marginHorizontal: sideInset,
              marginBottom: bottomInset,
              transform: [{ translateY: cardLift }],
            },
          ]}
        >
          <View
            style={[
              styles.card,
              { top: cardTop, paddingTop: cardPadTop, paddingBottom: blockGap },
            ]}
          >
            <View style={styles.illustrationBox}>
              <LoginIllustration />
            </View>
            <View style={[styles.form, { marginTop: blockGap }]}>
              <Text style={styles.label}>Phone number</Text>

              <View style={styles.field}>
                <View style={styles.country}>
                  <Text style={styles.countryText}>{countryLabel}</Text>
                  <Caret />
                </View>
                <View style={styles.divider} />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder={`${countryCode} 0000 0000 00`}
                  placeholderTextColor="#A6A3BF"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  style={styles.input}
                  accessibilityLabel="Phone number"
                />
              </View>

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  onRequestOtp?.(`${countryCode}${phone.replace(/\s+/g, "")}`);
                }}
                android_ripple={{ color: "rgba(255,255,255,0.22)" }}
                accessibilityRole="button"
                accessibilityLabel="Send OTP"
                style={styles.button}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </Pressable>
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
        </Animated.View>
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
  title: {
    flexShrink: 0,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
    color: INK,
    letterSpacing: -0.15,
  },
  cardArea: { flex: 1, minHeight: 0, position: "relative" },
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
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E1F5",
    backgroundColor: "#FFFFFF",
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },
  countryText: { fontSize: 13.5, fontWeight: "500", color: INK },
  divider: { width: 1, height: 20, backgroundColor: "#E4E1F5", flexShrink: 0 },
  input: { flex: 1, height: "100%", fontSize: 13.5, color: INK, padding: 0 },
  button: {
    marginTop: 14,
    height: 46,
    borderRadius: 23,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 4,
    shadowColor: PURPLE,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  buttonText: {
    fontSize: 14.5,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 0.15,
  },
  badge: {
    position: "absolute",
    top: 0,
    left: "50%",
    maxWidth: 96,
    aspectRatio: 1.05,
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
