import React, {useEffect, useId, useRef} from 'react';
import {Animated, Platform, Pressable, StyleSheet, View} from 'react-native';
import Svg, {Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop} from 'react-native-svg';

/* ───────────────────────────── public API ───────────────────────────── */

export type Tab = 'home' | 'discover' | 'profile';
export const TABS: Tab[] = ['home', 'discover', 'profile'];
export type TabBarVariant = 'glass' | 'flat';

export const TAB_BAR_WIDTH = 224;
export const TAB_BAR_HEIGHT = 66;

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
  /** Distance from the bottom of the screen (usually safe-area inset + 14). */
  bottom: number;
  /** Default: 'glass' on iOS, 'flat' on Android. */
  variant?: TabBarVariant;
  /** Screen-reader labels. */
  labels?: Partial<Record<Tab, string>>;
};

/* ───────────────────────────── geometry ───────────────────────────── */

const W = TAB_BAR_WIDTH;
const H = TAB_BAR_HEIGHT;
const SLOT_W = 60;
const SLOT_H = 48;
const SLOT_GAP = 8;
const STEP = SLOT_W + SLOT_GAP; // 68 — distance between slot centres
// Highlight: big oval in the tall middle, smaller at the thin ends of the bar.
const IND_W = 66;
const IND_H = 54;
const END_SX = 54 / IND_W; // → 54 px wide at the ends
const END_SY = 40 / IND_H; // → 40 px tall at the ends
const ICON_ON = 1.2;
const ICON_OFF = 0.9;
const SHADOW_PAD = 24; // room around the oval for the drawn shadow

const COLORS = {
  violet: '#7D3BFF',
  violetTop: '#9A7BFF',
  ink: '#0E0E14',
  idle: '#7B7795',
  white: '#FFFFFF',
  line: '#EDEBF7',
};

const DEFAULT_LABELS: Record<Tab, string> = {home: 'Home', discover: 'Discover work', profile: 'Profile'};

/* ───────────────────────────── component ───────────────────────────── */

/**
 * Oval three-tab bar: Home · Discover · Profile.
 * The bar is a true ellipse (tallest in the middle, thinning toward both ends).
 * The focused tab gets an oval highlight and a larger icon; the others shrink slightly.
 * Glass (iOS): translucent white oval with a bright rim, clear-glass highlight, ink icon.
 * Flat (Android): white oval, violet gradient highlight, white icon.
 * All animation runs on the native driver.
 */
export default function TabBar({active, onChange, bottom, variant, labels}: Props) {
  const glass = (variant ?? (Platform.OS === 'ios' ? 'glass' : 'flat')) === 'glass';
  const idx = Math.max(0, TABS.indexOf(active));
  const x = useRef(new Animated.Value(idx)).current;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    Animated.spring(x, {toValue: idx, friction: 7, tension: 90, useNativeDriver: true}).start();
  }, [idx, x]);

  const translateX = x.interpolate({inputRange: [0, 1, 2], outputRange: [-STEP, 0, STEP]});
  const scaleX = x.interpolate({inputRange: [0, 1, 2], outputRange: [END_SX, 1, END_SX]});
  const scaleY = x.interpolate({inputRange: [0, 1, 2], outputRange: [END_SY, 1, END_SY]});

  const onColor = glass ? COLORS.ink : COLORS.white;
  const cut = glass ? COLORS.white : COLORS.violet;
  const names = {...DEFAULT_LABELS, ...labels};

  return (
    <View pointerEvents="box-none" style={[styles.wrap, {bottom: bottom - SHADOW_PAD}]} accessibilityRole="tablist">
      {/* oval body + drawn shadow (works the same on iOS and Android) */}
      <Svg width={W + SHADOW_PAD * 2} height={H + SHADOW_PAD * 2} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id={'sh' + uid} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0.55" stopColor="#3C288C" stopOpacity={glass ? 0.32 : 0.24} />
            <Stop offset="1" stopColor="#3C288C" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id={'bd' + uid} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.white} stopOpacity={glass ? 0.72 : 1} />
            <Stop offset="1" stopColor={COLORS.white} stopOpacity={glass ? 0.48 : 1} />
          </LinearGradient>
        </Defs>
        <Ellipse cx={SHADOW_PAD + W / 2} cy={SHADOW_PAD + H / 2 + 12} rx={W / 2 - 6} ry={H / 2 + 2} fill={'url(#sh' + uid + ')'} />
        <Ellipse
          cx={SHADOW_PAD + W / 2}
          cy={SHADOW_PAD + H / 2}
          rx={W / 2 - 0.5}
          ry={H / 2 - 0.5}
          fill={'url(#bd' + uid + ')'}
          stroke={glass ? 'rgba(255,255,255,0.75)' : COLORS.line}
          strokeWidth={1}
        />
        {glass && (
          // top rim highlight
          <Path
            d={'M ' + (SHADOW_PAD + W * 0.2) + ' ' + (SHADOW_PAD + H * 0.1) + ' Q ' + (SHADOW_PAD + W / 2) + ' ' + (SHADOW_PAD - H * 0.06) + ' ' + (SHADOW_PAD + W * 0.8) + ' ' + (SHADOW_PAD + H * 0.1)}
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={1.2}
            fill="none"
          />
        )}
      </Svg>

      <View style={styles.bar}>
        {/* highlight */}
        <Animated.View pointerEvents="none" style={[styles.indicator, {transform: [{translateX}, {scaleX}, {scaleY}]}]}>
          <Svg width={IND_W + 8} height={IND_H + 12}>
            <Defs>
              <LinearGradient id={'in' + uid} x1="0" y1="0" x2="0" y2="1">
                {glass ? (
                  <>
                    <Stop offset="0" stopColor={COLORS.white} stopOpacity={0.5} />
                    <Stop offset="1" stopColor={COLORS.white} stopOpacity={0.14} />
                  </>
                ) : (
                  <>
                    <Stop offset="0" stopColor={COLORS.violetTop} />
                    <Stop offset="1" stopColor={COLORS.violet} />
                  </>
                )}
              </LinearGradient>
              <RadialGradient id={'ig' + uid} cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0.5" stopColor={glass ? '#3C288C' : COLORS.violet} stopOpacity={glass ? 0.22 : 0.45} />
                <Stop offset="1" stopColor={glass ? '#3C288C' : COLORS.violet} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse cx={(IND_W + 8) / 2} cy={IND_H / 2 + 10} rx={IND_W / 2 - 2} ry={IND_H / 2 - 4} fill={'url(#ig' + uid + ')'} />
            <Ellipse
              cx={(IND_W + 8) / 2}
              cy={IND_H / 2 + 2}
              rx={IND_W / 2 - 0.5}
              ry={IND_H / 2 - 0.5}
              fill={'url(#in' + uid + ')'}
              stroke={glass ? 'rgba(255,255,255,0.9)' : 'none'}
              strokeWidth={1}
            />
          </Svg>
        </Animated.View>

        {/* slots */}
        <View style={styles.slots}>
          {TABS.map((t, i) => {
            const on = x.interpolate({inputRange: [i - 1, i, i + 1], outputRange: [0, 1, 0], extrapolate: 'clamp'});
            const off = Animated.subtract(1, on);
            const scale = x.interpolate({inputRange: [i - 1, i, i + 1], outputRange: [ICON_OFF, ICON_ON, ICON_OFF], extrapolate: 'clamp'});
            return (
              <Pressable
                key={t}
                onPress={() => onChange(t)}
                style={styles.slot}
                hitSlop={4}
                accessibilityRole="tab"
                accessibilityLabel={names[t]}
                accessibilityState={{selected: active === t}}>
                <Animated.View style={[styles.iconBox, {transform: [{scale}]}]}>
                  <Animated.View style={[styles.icon, {opacity: off}]}>
                    <TabIcon tab={t} filled={false} color={COLORS.idle} cut={cut} />
                  </Animated.View>
                  <Animated.View style={[styles.icon, {opacity: on}]}>
                    <TabIcon tab={t} filled color={onColor} cut={cut} />
                  </Animated.View>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/* ───────────────────────────── icons ───────────────────────────── */

const HOME = 'M4 10.4 12 4l8 6.4V20a.9.9 0 0 1-.9.9h-4.3v-6h-5.6v6H4.9A.9.9 0 0 1 4 20v-9.6Z';
const NEEDLE = 'm15.6 8.4-2 5.2-5.2 2 2-5.2 5.2-2Z';

function TabIcon({tab, filled, color, cut}: {tab: Tab; filled: boolean; color: string; cut: string}) {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
      {tab === 'home' &&
        (filled ? <Path d={HOME} fill={color} /> : <Path d={HOME} stroke={color} strokeWidth={1.7} strokeLinejoin="round" />)}
      {tab === 'discover' &&
        (filled ? (
          <G>
            <Circle cx={12} cy={12} r={9.4} fill={color} />
            <Path d={NEEDLE} fill={cut} />
          </G>
        ) : (
          <G>
            <Circle cx={12} cy={12} r={8.6} stroke={color} strokeWidth={1.7} />
            <Path d={NEEDLE} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
          </G>
        ))}
      {tab === 'profile' &&
        (filled ? (
          <G>
            <Circle cx={12} cy={8.2} r={3.9} fill={color} />
            <Path d="M4.8 20.6c0-3.7 3.2-5.8 7.2-5.8s7.2 2.1 7.2 5.8H4.8Z" fill={color} />
          </G>
        ) : (
          <G>
            <Circle cx={12} cy={8.2} r={3.9} stroke={color} strokeWidth={1.7} />
            <Path d="M4.8 20.4c0-3.6 3.2-5.6 7.2-5.6s7.2 2 7.2 5.6" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
          </G>
        ))}
    </Svg>
  );
}

/* ───────────────────────────── styles ───────────────────────────── */

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: '50%',
    marginLeft: -(W / 2 + SHADOW_PAD),
    width: W + SHADOW_PAD * 2,
    height: H + SHADOW_PAD * 2,
    zIndex: 5,
  },
  bar: {position: 'absolute', left: SHADOW_PAD, top: SHADOW_PAD, width: W, height: H, alignItems: 'center', justifyContent: 'center'},
  indicator: {
    position: 'absolute',
    width: IND_W + 8,
    height: IND_H + 12,
    left: (W - (IND_W + 8)) / 2,
    top: (H - IND_H) / 2 - 2,
  },
  slots: {flexDirection: 'row', alignItems: 'center', columnGap: SLOT_GAP},
  slot: {width: SLOT_W, height: SLOT_H, alignItems: 'center', justifyContent: 'center'},
  iconBox: {width: 23, height: 23},
  icon: {position: 'absolute', top: 0, left: 0},
});
