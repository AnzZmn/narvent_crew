import React, { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

export type Tab = "home" | "discover" | "profile";
export const TABS: Tab[] = ["home", "discover", "profile"];
export type TabBarVariant = "glass" | "dark";

const SLOT_W = 60;
const SLOT_H = 44;
const GAP = 8;
const PAD = 7;
const STEP = SLOT_W + GAP;
export const TAB_BAR_WIDTH = PAD * 2 + SLOT_W * 3 + GAP * 2; // 210
export const TAB_BAR_HEIGHT = 58;
const ICON_ON = 1.2;
const ICON_OFF = 0.9;

const C = {
  panel: "#22134F",
  violet: "#7D3BFF",
  violetTop: "#A88CFF",
  ink: "#0E0E14",
  idleGlass: "#7B7795",
  idleDark: "#C9BFFF",
  white: "#FFFFFF",
};

const DEFAULT_LABELS: Record<Tab, string> = {
  home: "Home",
  discover: "Discover work",
  profile: "Profile",
};

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
  /** Distance from the bottom of the screen (usually safe-area inset + 14). */
  bottom: number;
  /** Default: 'glass' on iOS, 'dark' on Android. */
  variant?: TabBarVariant;
  labels?: Partial<Record<Tab, string>>;
};

/**
 * Three-tab pill: Home · Discover (centre) · Profile. Same height end to end; the
 * highlight is one fixed size and springs between slots. Icons cross-fade
 * outline → filled and grow slightly when selected.
 * glass (iOS): frosted pill, clear-glass highlight, ink icon.
 * dark (Android): #22134F pill, violet gradient highlight, white icon, lilac idle icons.
 */
export default function TabBar({
  active,
  onChange,
  bottom,
  variant,
  labels,
}: Props) {
  const glass =
    (variant ?? (Platform.OS === "ios" ? "glass" : "dark")) === "glass";
  const idx = Math.max(0, TABS.indexOf(active));
  const x = useRef(new Animated.Value(idx)).current;
  const names = { ...DEFAULT_LABELS, ...labels };

  useEffect(() => {
    Animated.spring(x, {
      toValue: idx,
      friction: 7,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [idx, x]);

  const translateX = x.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, STEP, STEP * 2],
  });
  const onColor = glass ? C.ink : C.white;
  const idle = glass ? C.idleGlass : C.idleDark;
  const cut = glass ? C.white : C.violet;

  const content = (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          !glass && styles.indicatorShadow,
          { transform: [{ translateX }] },
        ]}
      >
        {glass ? (
          <View style={[styles.indicatorFill, styles.indicatorGlass]}>
            <View style={styles.indicatorRim} />
          </View>
        ) : (
          <View style={styles.indicatorFill}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="tabInd" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={C.violetTop} />
                  <Stop offset="1" stopColor={C.violet} />
                </LinearGradient>
              </Defs>
              <Rect
                width="100%"
                height="100%"
                rx={SLOT_H / 2}
                fill="url(#tabInd)"
              />
            </Svg>
          </View>
        )}
      </Animated.View>
      <View style={styles.slots}>
        {TABS.map((t, i) => {
          const on = x.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          });
          const off = Animated.subtract(1, on);
          const scale = x.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [ICON_OFF, ICON_ON, ICON_OFF],
            extrapolate: "clamp",
          });
          return (
            <Pressable
              key={t}
              onPress={() => onChange(t)}
              style={styles.slot}
              hitSlop={4}
              accessibilityRole="tab"
              accessibilityLabel={names[t]}
              accessibilityState={{ selected: active === t }}
            >
              <Animated.View
                style={[styles.iconBox, { transform: [{ scale }] }]}
              >
                <Animated.View style={[styles.icon, { opacity: off }]}>
                  <TabIcon tab={t} filled={false} color={idle} cut={cut} />
                </Animated.View>
                <Animated.View style={[styles.icon, { opacity: on }]}>
                  <TabIcon tab={t} filled color={onColor} cut={cut} />
                </Animated.View>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </>
  );

  return (
    <View style={[styles.wrap, { bottom }]} accessibilityRole="tablist">
      {glass ? (
        <BlurView
          intensity={70}
          tint="light"
          style={[styles.pill, styles.pillGlass]}
        >
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.pillGlassFill]}
          />
          <View pointerEvents="none" style={styles.pillRim} />
          {content}
        </BlurView>
      ) : (
        <View style={[styles.pill, styles.pillDark]}>{content}</View>
      )}
    </View>
  );
}

const HOME =
  "M4 10.4 12 4l8 6.4V20a.9.9 0 0 1-.9.9h-4.3v-6h-5.6v6H4.9A.9.9 0 0 1 4 20v-9.6Z";
const NEEDLE = "m15.6 8.4-2 5.2-5.2 2 2-5.2 5.2-2Z";

function TabIcon({
  tab,
  filled,
  color,
  cut,
}: {
  tab: Tab;
  filled: boolean;
  color: string;
  cut: string;
}) {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
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
            <Path d={NEEDLE} fill={cut} />
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
  wrap: {
    position: "absolute",
    left: "50%",
    marginLeft: -TAB_BAR_WIDTH / 2,
    zIndex: 5,
  },
  pill: {
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    padding: PAD,
  },
  pillGlass: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  pillGlassFill: { backgroundColor: "rgba(255,255,255,0.38)" },
  pillRim: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  pillDark: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    elevation: 12,
    shadowColor: C.panel,
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 16 },
  },
  // 1px border, so the highlight sits at PAD - 1 to line up with the padding
  indicator: {
    position: "absolute",
    top: PAD - 1,
    left: PAD - 1,
    width: SLOT_W,
    height: SLOT_H,
    borderRadius: SLOT_H / 2,
  },
  indicatorShadow: {
    elevation: 6,
    shadowColor: "#9A7BFF",
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  indicatorFill: { flex: 1, borderRadius: SLOT_H / 2, overflow: "hidden" },
  indicatorGlass: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
  },
  indicatorRim: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: C.white,
  },
  slots: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: GAP,
  },
  slot: {
    width: SLOT_W,
    height: SLOT_H,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: { width: 23, height: 23 },
  icon: { position: "absolute", top: 0, left: 0 },
});
