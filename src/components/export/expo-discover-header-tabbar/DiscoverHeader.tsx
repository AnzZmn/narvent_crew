import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export type HeaderVariant = "dark" | "fade";

export type TradeFilter = { label: string; count: number };

type Props = {
  title?: string;
  /** e.g. "12 jobs near you" */
  subtitle: string;
  trades: TradeFilter[];
  activeTrade: string;
  onTradeChange: (label: string) => void;
  /** Default: 'dark' on Android (solid violet panel), 'fade' on iOS (light fade over the map). */
  variant?: HeaderVariant;
  /** Reports the header's height so the map can pad its top edge. */
  onLayoutHeight?: (h: number) => void;
};

const C = {
  panel: "#22134F",
  panelInk: "#FFFFFF",
  panelSub: "#C9BFFF",
  chipOnInk: "#2A1670",
  ink: "#0E0E14",
  sub: "#6B6788",
  body: "#4A4766",
  violet: "#7D3BFF",
  violetTop: "#9A7BFF",
  fade: "#F6F5FC",
};

const F = {
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  bold: "DMSans_700Bold",
  mono: "DMMono_500Medium",
};

/**
 * Discover work header: title, job count, and trade filter chips.
 * dark: solid #22134F panel with rounded bottom corners, white text, light status bar.
 * fade: no panel; a light gradient fades the map out behind dark text (iOS glass look).
 */
export default function DiscoverHeader({
  title = "Discover work",
  subtitle,
  trades,
  activeTrade,
  onTradeChange,
  variant,
  onLayoutHeight,
}: Props) {
  const insets = useSafeAreaInsets();
  const dark =
    (variant ?? (Platform.OS === "android" ? "dark" : "fade")) === "dark";

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, dark && styles.panel]}
      onLayout={(e) => onLayoutHeight?.(e.nativeEvent.layout.height)}
    >
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={dark ? C.panel : "transparent"}
        translucent
      />
      {!dark && (
        <View
          pointerEvents="none"
          style={[styles.fade, { height: insets.top + 160 }]}
        >
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="discFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={C.fade} stopOpacity={1} />
                <Stop offset="0.52" stopColor={C.fade} stopOpacity={0.9} />
                <Stop offset="1" stopColor={C.fade} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#discFade)" />
          </Svg>
        </View>
      )}

      <View
        pointerEvents="none"
        style={[styles.text, { paddingTop: insets.top + 10 }]}
      >
        <Text
          style={[styles.title, { color: dark ? C.panelInk : C.ink }]}
          accessibilityRole="header"
        >
          {title}
        </Text>
        <Text style={[styles.sub, { color: dark ? C.panelSub : C.sub }]}>
          {subtitle}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipRow}
      >
        {trades.map((t) => (
          <Chip
            key={t.label}
            {...t}
            active={t.label === activeTrade}
            dark={dark}
            onPress={() => onTradeChange(t.label)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  count,
  active,
  dark,
  onPress,
}: TradeFilter & { active: boolean; dark: boolean; onPress: () => void }) {
  const fg = dark
    ? active
      ? C.chipOnInk
      : C.panelInk
    : active
      ? "#FFFFFF"
      : C.body;
  const style = dark
    ? active
      ? styles.darkOn
      : styles.darkOff
    : active
      ? styles.fadeOn
      : styles.fadeOff;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={[styles.chip, style]}
    >
      {!dark && !active && (
        <>
          <BlurView
            intensity={40}
            tint="light"
            style={[StyleSheet.absoluteFill, styles.clip]}
          />
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.clip, styles.glassFill]}
          />
        </>
      )}
      {!dark && active && (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.clip]}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="chipOn" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={C.violetTop} />
                <Stop offset="1" stopColor={C.violet} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#chipOn)" />
          </Svg>
        </View>
      )}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
      <Text style={[styles.count, { color: fg }]}>{count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 3 },
  panel: {
    backgroundColor: C.panel,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingBottom: 12,
    elevation: 10,
    shadowColor: C.panel,
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 14 },
  },
  fade: { position: "absolute", top: 0, left: 0, right: 0 },
  text: { paddingHorizontal: 18 },
  title: {
    fontFamily: F.bold,
    fontSize: 22,
    lineHeight: 25,
    letterSpacing: -0.44,
  },
  sub: { fontFamily: F.regular, fontSize: 12, marginTop: 3 },
  chipRow: { marginTop: 12, flexGrow: 0 },
  chips: { paddingHorizontal: 14, paddingBottom: 4, columnGap: 6 },
  chip: {
    height: 34,
    paddingHorizontal: 13,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  clip: { borderRadius: 17, overflow: "hidden" },
  glassFill: { backgroundColor: "rgba(255,255,255,0.62)" },
  darkOn: { backgroundColor: "#FFFFFF" },
  darkOff: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  fadeOn: {
    shadowColor: "#3C288C",
    shadowOpacity: 0.18,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 6 },
  },
  fadeOff: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#3C288C",
    shadowOpacity: 0.18,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 6 },
  },
  label: { fontFamily: F.medium, fontSize: 12 },
  count: { fontFamily: F.mono, fontSize: 10.5, opacity: 0.7 },
});
