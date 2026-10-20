import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G, Path } from "react-native-svg";

export type Tab = "home" | "discover" | "profile";
export const TABS: Tab[] = ["home", "discover", "profile"];

/** Height of the tab row, excluding the bottom (gesture / 3-button) inset. */
export const ANDROID_TAB_ROW_HEIGHT = 66;
/** Total bar height for a given bottom inset. Use it to pad screen content and lift overlays. */
export const androidTabBarHeight = (bottomInset: number) =>
  ANDROID_TAB_ROW_HEIGHT + Math.max(bottomInset, 8);

const PILL_W = 62;
const PILL_H = 32;

const C = {
  surface: "#FFFFFF",
  hairline: "#E6E2F5",
  indicator: "#E3DDFB",
  iconOn: "#3A2A8C",
  iconOff: "#6B6788",
  labelOn: "#1E1440",
  labelOff: "#5E5980",
  white: "#FFFFFF",
};

const DEFAULT_LABELS: Record<Tab, string> = {
  home: "Home",
  discover: "Discover",
  profile: "Profile",
};

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
  labels?: Partial<Record<Tab, string>>;
  /** Override the bottom inset (defaults to the safe-area inset). */
  bottomInset?: number;
};

/**
 * Docked Android tab bar (15b): full-width white surface, hairline top border,
 * labelled tabs, tonal indicator pill behind the active icon. Includes the
 * system navigation inset so content never slides under it.
 */
export default function TabBarAndroid({
  active,
  onChange,
  labels,
  bottomInset,
}: Props) {
  const insets = useSafeAreaInsets();
  const inset = Math.max(bottomInset ?? insets.bottom, 8);
  const names = { ...DEFAULT_LABELS, ...labels };

  return (
    <View
      style={[styles.bar, { paddingBottom: inset }]}
      accessibilityRole="tablist"
    >
      <View style={styles.row}>
        {TABS.map((t) => (
          <TabItem
            key={t}
            tab={t}
            label={names[t]}
            selected={t === active}
            onPress={() => onChange(t)}
          />
        ))}
      </View>
    </View>
  );
}

function TabItem({
  tab,
  label,
  selected,
  onPress,
}: {
  tab: Tab;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const v = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(v, {
      toValue: selected ? 1 : 0,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [selected, v]);

  const off = Animated.subtract(1, v);
  const scaleX = v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <Pressable
      onPress={onPress}
      style={styles.item}
      android_ripple={{
        color: "rgba(125,59,255,0.10)",
        borderless: true,
        radius: 40,
      }}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <View style={styles.iconWrap}>
        <Animated.View
          pointerEvents="none"
          style={[styles.pill, { opacity: v, transform: [{ scaleX }] }]}
        />
        <Animated.View style={[styles.icon, { opacity: off }]}>
          <TabIcon tab={tab} filled={false} color={C.iconOff} />
        </Animated.View>
        <Animated.View style={[styles.icon, { opacity: v }]}>
          <TabIcon tab={tab} filled color={C.iconOn} />
        </Animated.View>
      </View>
      <View style={styles.labelWrap}>
        <Animated.Text
          numberOfLines={1}
          style={[styles.label, styles.labelOff, { opacity: off }]}
        >
          {label}
        </Animated.Text>
        <Animated.Text
          numberOfLines={1}
          style={[styles.label, styles.labelOn, styles.abs, { opacity: v }]}
        >
          {label}
        </Animated.Text>
      </View>
    </Pressable>
  );
}

const HOME =
  "M4 10.4 12 4l8 6.4V20a.9.9 0 0 1-.9.9h-4.3v-6h-5.6v6H4.9A.9.9 0 0 1 4 20v-9.6Z";
const NEEDLE = "m15.6 8.4-2 5.2-5.2 2 2-5.2 5.2-2Z";

function TabIcon({
  tab,
  filled,
  color,
}: {
  tab: Tab;
  filled: boolean;
  color: string;
}) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      {tab === "home" &&
        (filled ? (
          <Path d={HOME} fill={color} />
        ) : (
          <Path
            d={HOME}
            stroke={color}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        ))}
      {tab === "discover" &&
        (filled ? (
          <G>
            <Circle cx={12} cy={12} r={9.4} fill={color} />
            <Path d={NEEDLE} fill={C.white} />
          </G>
        ) : (
          <G>
            <Circle cx={12} cy={12} r={8.6} stroke={color} strokeWidth={1.7} />
            <Path
              d={NEEDLE}
              stroke={color}
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
          </G>
        ))}
      {tab === "profile" &&
        (filled ? (
          <G>
            <Circle cx={12} cy={8.2} r={3.9} fill={color} />
            <Path
              d="M4.8 20.6c0-3.7 3.2-5.8 7.2-5.8s7.2 2.1 7.2 5.8H4.8Z"
              fill={color}
            />
          </G>
        ) : (
          <G>
            <Circle cx={12} cy={8.2} r={3.9} stroke={color} strokeWidth={1.7} />
            <Path
              d="M4.8 20.4c0-3.6 3.2-5.6 7.2-5.6s7.2 2 7.2 5.6"
              stroke={color}
              strokeWidth={1.7}
              strokeLinecap="round"
            />
          </G>
        ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: C.surface,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: C.hairline,
    paddingTop: 6,
    paddingHorizontal: 10,
    elevation: 8,
    shadowColor: "#3C288C",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -6 },
  },
  row: { flexDirection: "row", height: ANDROID_TAB_ROW_HEIGHT - 6 },
  item: { flex: 1, alignItems: "center", justifyContent: "center", rowGap: 4 },
  iconWrap: {
    width: PILL_W,
    height: PILL_H,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    ...StyleSheet.absoluteFill,
    borderRadius: PILL_H / 2,
    backgroundColor: C.indicator,
  },
  icon: { position: "absolute", width: 22, height: 22 },
  labelWrap: { alignItems: "center" },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11.5,
    lineHeight: 14,
    includeFontPadding: false,
  },
  labelOff: { color: C.labelOff },
  labelOn: { color: C.labelOn, fontFamily: "DMSans_700Bold" },
  abs: { position: "absolute", top: 0 },
});
