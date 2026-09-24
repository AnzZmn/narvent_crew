/**
 * LoginIllustration — animated OTP illustration for the Narvent Log in card.
 * React Native + Reanimated 3 + react-native-svg.
 *
 *   npx expo install react-native-reanimated react-native-svg
 *   (add 'react-native-reanimated/plugin' last in babel.config.js plugins)
 *
 * Same scene and timing as the web mockup: breathing lavender hill, trend
 * arrow drawing itself, clock with a 6s minute hand and 72s hour hand, bulb
 * with pulsing halo and rays, typing bubble, twinkling sparkles, and the phone
 * floating while four OTP dots fill in, the button lights up and a check pops.
 *
 * One shared clock drives everything. It runs linearly from 0 to 144s, the
 * least common multiple of every loop (16, 8, 6, 3, 2.4, 1.2, 72s), so each
 * loop stays in phase forever. It only animates plain SVG attributes (r, cy,
 * x2/y2, d, opacity, fill, strokeDashoffset). Those update reliably on the UI
 * thread; animated SVG transforms don't. The phone float is the one exception
 * and uses a native Animated.View translate.
 *
 * Reduced motion: when the OS setting is on, the scene freezes on a fully
 * revealed frame (all dots in, check shown, arrow drawn).
 */
import React, {useEffect} from 'react';
import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  SharedValue,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle, G, Line, Path, Rect} from 'react-native-svg';

const APath = Animated.createAnimatedComponent(Path);
const ACircle = Animated.createAnimatedComponent(Circle);
const ALine = Animated.createAnimatedComponent(Line);
const ARect = Animated.createAnimatedComponent(Rect);

const INK = '#3A3850';
const PURPLE = '#7D69FF';
const CYCLE = 144000; // ms, LCM of every loop period
const FROZEN_T = 3500; // fully revealed frame for reduced motion

const ink = {
  stroke: INK,
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* ---------------------------------------------------------------- worklets */

/** 0..1 position inside a loop. Before `delay` it holds at 0 (CSS fill-mode: both). */
function phase(t: number, period: number, delay = 0) {
  'worklet';
  if (t < delay) return 0;
  return ((t - delay) % period) / period;
}

/** Smooth 0 -> 1 -> 0 wave, equivalent to ease-in-out alternate. */
function wave(p: number) {
  'worklet';
  return 0.5 - 0.5 * Math.cos(p * Math.PI * 2);
}

function kf(p: number, at: number[], vals: number[]) {
  'worklet';
  return interpolate(p, at, vals, Extrapolation.CLAMP);
}

/** Lavender hill, scaled about its base centre (154, 204). */
function blobPath(sx: number, sy: number) {
  'worklet';
  const X = (x: number) => (154 + (x - 154) * sx).toFixed(2);
  const Y = (y: number) => (204 + (y - 204) * sy).toFixed(2);
  return (
    `M${X(18)} ${Y(204)}` +
    `C${X(36)} ${Y(158)} ${X(86)} ${Y(128)} ${X(128)} ${Y(126)}` +
    `C${X(168)} ${Y(124)} ${X(188)} ${Y(80)} ${X(228)} ${Y(88)}` +
    `C${X(264)} ${Y(96)} ${X(280)} ${Y(156)} ${X(290)} ${Y(204)}Z`
  );
}

/* ------------------------------------------------------------- sub-pieces */

type Clock = {t: SharedValue<number>};

const DOT_AT = [0, 0.06, 0.12, 0.8, 0.88, 1];

function OtpDot({t, cx, delay}: Clock & {cx: number; delay: number}) {
  const props = useAnimatedProps(() => {
    const p = phase(t.value, 6000, delay);
    return {
      opacity: kf(p, DOT_AT, [0, 0, 1, 1, 0, 0]),
      r: 2.1 * kf(p, DOT_AT, [0.3, 0.3, 1, 1, 0.3, 0.3]),
    };
  });
  return <ACircle cx={cx} cy={131} fill={INK} animatedProps={props} />;
}

function TypingDot({t, cx, delay}: Clock & {cx: number; delay: number}) {
  const props = useAnimatedProps(() => {
    const p = phase(t.value, 1200, delay);
    return {
      cy: 46.5 + kf(p, [0, 0.3, 0.6, 1], [0, -2.5, 0, 0]),
      opacity: kf(p, [0, 0.3, 0.6, 1], [0.45, 1, 0.45, 0.45]),
    };
  });
  return <ACircle cx={cx} r={2.1} fill={PURPLE} animatedProps={props} />;
}

function Sparkle({
  t,
  x,
  y,
  color,
  width,
  delay,
}: Clock & {x: number; y: number; color: string; width: number; delay: number}) {
  const props = useAnimatedProps(() => {
    const s = wave(phase(t.value, 3000, delay));
    const l = 3.5 * (0.4 + 0.6 * s);
    return {
      d: `M${x - l} ${y}h${2 * l}M${x} ${y - l}v${2 * l}`,
      opacity: s,
    };
  });
  return (
    <APath stroke={color} strokeWidth={width} strokeLinecap="round" animatedProps={props} />
  );
}

/* ---------------------------------------------------------------- scene */

type Props = {
  /** Container style. The scene keeps its 300:230 aspect and fills the width. */
  style?: StyleProp<ViewStyle>;
};

export default function LoginIllustration({style}: Props) {
  const reduced = useReducedMotion();
  const t = useSharedValue(reduced ? FROZEN_T : 0);

  useEffect(() => {
    if (reduced) {
      cancelAnimation(t);
      t.value = FROZEN_T;
      return;
    }
    t.value = 0;
    t.value = withRepeat(
      withTiming(CYCLE, {duration: CYCLE, easing: Easing.linear}),
      -1,
      false,
    );
    return () => cancelAnimation(t);
  }, [reduced, t]);

  const blob = useAnimatedProps(() => {
    const s = wave(phase(t.value, 16000));
    return {d: blobPath(1 + 0.035 * s, 1 + 0.06 * s)};
  });

  const trend = useAnimatedProps(() => {
    const p = phase(t.value, 6000);
    return {
      strokeDashoffset: kf(p, [0, 0.35, 1], [90, 0, 0]),
      opacity: kf(p, [0, 0.75, 0.9, 1], [1, 1, 0, 0]),
    };
  });

  const minute = useAnimatedProps(() => {
    const a = phase(t.value, 6000) * Math.PI * 2;
    return {x2: 70 + 15 * Math.sin(a), y2: 146 - 15 * Math.cos(a)};
  });
  const hour = useAnimatedProps(() => {
    const a = phase(t.value, 72000) * Math.PI * 2;
    return {x2: 70 + 10 * Math.sin(a), y2: 146 - 10 * Math.cos(a)};
  });

  const halo = useAnimatedProps(() => {
    const s = wave(phase(t.value, 2400));
    return {r: 22 * (0.85 + 0.25 * s), opacity: 0.08 + 0.12 * s};
  });
  const rays = useAnimatedProps(() => ({
    opacity: 0.35 + 0.65 * wave(phase(t.value, 2400)),
  }));

  const btn = useAnimatedProps(() => {
    const p = phase(t.value, 6000, 2400);
    const k = kf(p, [0, 0.08, 0.14, 0.72, 0.8, 1], [0, 0, 1, 1, 0, 0]);
    return {fill: interpolateColor(k, [0, 1], ['#C9C0FF', PURPLE])};
  });

  const POP_AT = [0, 0.08, 0.13, 0.16, 0.72, 0.8, 1];
  const checkDisc = useAnimatedProps(() => {
    const p = phase(t.value, 6000, 2400);
    return {
      r: 9 * kf(p, POP_AT, [0, 0, 1.15, 1, 1, 0.6, 0.6]),
      opacity: kf(p, POP_AT, [0, 0, 1, 1, 1, 0, 0]),
    };
  });
  const checkTick = useAnimatedProps(() => {
    const p = phase(t.value, 6000, 2400);
    return {opacity: kf(p, [0, 0.1, 0.15, 0.72, 0.78, 1], [0, 0, 1, 1, 0, 0])};
  });

  // phone float: native view transform, scaled from viewBox units by onLayout width
  const [scale, setScale] = React.useState(1);
  const float = useAnimatedStyle(() => ({
    transform: [{translateY: -4 * scale * wave(phase(t.value, 8000))}],
  }));

  return (
    <View
      style={[styles.box, style]}
      onLayout={e => setScale(e.nativeEvent.layout.width / 300)}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Phone receiving a one-time passcode">
      {/* scene */}
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 300 230" fill="none">
        <APath fill="#EEEAFE" animatedProps={blob} />
        <Path d="M10 204H290" stroke="#D9D5EC" strokeWidth={1.5} strokeLinecap="round" />

        <Sparkle t={t} x={43.5} y={38} color={PURPLE} width={1.4} delay={0} />
        <Sparkle t={t} x={271.5} y={44} color={PURPLE} width={1.4} delay={1000} />
        <Sparkle t={t} x={115} y={26} color={INK} width={1.2} delay={2000} />

        <APath
          d="M24 98L40 82L51 89L72 64M63 64H72V73"
          {...ink}
          strokeDasharray="90"
          animatedProps={trend}
        />

        {/* clock */}
        <Circle cx={70} cy={146} r={21} fill="#fff" {...ink} />
        <Path d="M70 128v3M70 161v3M52 146h3M85 146h3" stroke={INK} strokeWidth={1.3} strokeLinecap="round" />
        <ALine x1={70} y1={146} stroke={INK} strokeWidth={2} strokeLinecap="round" animatedProps={hour} />
        <ALine x1={70} y1={146} stroke={PURPLE} strokeWidth={1.6} strokeLinecap="round" animatedProps={minute} />
        <Circle cx={70} cy={146} r={2} fill={INK} />

        {/* bulb */}
        <ACircle cx={252} cy={112} fill={PURPLE} animatedProps={halo} />
        <APath
          d="M252 86v-6M236 93l-4-4M268 93l4-4M229 110h-6M275 110h6"
          stroke={PURPLE}
          strokeWidth={1.5}
          strokeLinecap="round"
          animatedProps={rays}
        />
        <Path d="M252 96a14 14 0 0 0-8 25.5V127h16v-5.5A14 14 0 0 0 252 96Z" fill="#fff" {...ink} />
        <Path d="M246 132h12M248 136h8" {...ink} />
        <Path d="M246 118l2-4 2 4 2-4 2 4 2-4" stroke={PURPLE} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />

        {/* typing bubble */}
        <Rect x={190} y={36} width={42} height={21} rx={10.5} fill="#fff" {...ink} />
        <Path d="M198 57l-5 7 11-7" fill="#fff" {...ink} />
        <TypingDot t={t} cx={202} delay={0} />
        <TypingDot t={t} cx={211} delay={150} />
        <TypingDot t={t} cx={220} delay={300} />
      </Svg>

      {/* floating phone */}
      <Animated.View style={[StyleSheet.absoluteFill, float]} pointerEvents="none">
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 300 230" fill="none">
          <Rect x={121} y={62} width={58} height={110} rx={10} fill="#fff" {...ink} />
          <Path d="M143 70h14" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M145.5 90v-4a4.5 4.5 0 0 1 9 0v4" stroke={PURPLE} strokeWidth={1.8} strokeLinecap="round" />
          <Rect x={142} y={89.5} width={16} height={12} rx={2.5} fill={PURPLE} />
          <Circle cx={150} cy={95.5} r={1.6} fill="#fff" />
          <Rect x={132} y={109} width={36} height={3} rx={1.5} fill="#E4E1F5" />
          <Rect x={138} y={115} width={24} height={3} rx={1.5} fill="#E4E1F5" />
          <G fill="#FBFAFF" stroke="#CFC9EE" strokeWidth={1.1}>
            <Rect x={127.5} y={125} width={9} height={12} rx={2} />
            <Rect x={139.5} y={125} width={9} height={12} rx={2} />
            <Rect x={151.5} y={125} width={9} height={12} rx={2} />
            <Rect x={163.5} y={125} width={9} height={12} rx={2} />
          </G>
          <OtpDot t={t} cx={132} delay={0} />
          <OtpDot t={t} cx={144} delay={600} />
          <OtpDot t={t} cx={156} delay={1200} />
          <OtpDot t={t} cx={168} delay={1800} />
          <ARect x={131} y={145} width={38} height={9} rx={4.5} animatedProps={btn} />
          <Path d="M143 165h14" stroke="#D9D5EC" strokeWidth={1.5} strokeLinecap="round" />
          <ACircle cx={179} cy={64} fill={PURPLE} stroke="#fff" strokeWidth={2} animatedProps={checkDisc} />
          <APath
            d="M175 64.2l2.8 2.8 5-5.6"
            stroke="#fff"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            animatedProps={checkTick}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {width: '100%', aspectRatio: 300 / 230, maxHeight: '100%'},
});
