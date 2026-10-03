import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Circle, G, Path} from 'react-native-svg';

const START = 236; // degrees clockwise from 12 o'clock
const SWEEP = 248;
const SEGMENTS = 62;
const R = 44.3; // ring centre radius in a 100-unit box (outer 50, inner 38.6)
const W = 11.4;

const RED = [255, 0, 0];
const YELLOW = [255, 238, 0];
const GREEN = [0, 255, 64];

function pt(deg: number, r = R) {
  const a = (deg * Math.PI) / 180;
  return [50 + r * Math.sin(a), 50 - r * Math.cos(a)];
}

function colorAt(t: number) {
  const [a, b, k] = t < 0.5 ? [RED, YELLOW, t * 2] : [YELLOW, GREEN, (t - 0.5) * 2];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/** Red → yellow → green ring (CSS conic-gradient stand-in) with a needle at `value` (0–1). */
export default function PerformanceGauge({size, value}: {size: number; value: number}) {
  const arcs = useMemo(
    () =>
      Array.from({length: SEGMENTS}, (_, i) => {
        const a1 = START + (SWEEP * i) / SEGMENTS;
        const a2 = Math.min(START + (SWEEP * (i + 1)) / SEGMENTS + 0.6, START + SWEEP);
        const [x1, y1] = pt(a1);
        const [x2, y2] = pt(a2);
        return {d: `M${x1} ${y1}A${R} ${R} 0 0 1 ${x2} ${y2}`, color: colorAt((i + 0.5) / SEGMENTS)};
      }),
    [],
  );
  const [sx, sy] = pt(START);
  const [ex, ey] = pt(START + SWEEP);
  // the mockup needle points at 36.2°; rotate it to the value's angle
  const rotation = START + SWEEP * Math.max(0, Math.min(1, value)) - 360 - 36.2;

  return (
    <View style={{width: size, height: size}}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {arcs.map((a, i) => (
          <Path key={i} d={a.d} stroke={a.color} strokeWidth={W} fill="none" />
        ))}
        <Circle cx={sx} cy={sy} r={W / 2} fill="#FF0000" />
        <Circle cx={ex} cy={ey} r={W / 2} fill="#00FF40" />
      </Svg>
      <Svg style={StyleSheet.absoluteFill} width={size} height={size} viewBox="16.1 16 213.5 213.6">
        <G rotation={rotation} origin="122.85, 122.8">
          <Path
            d="M176.585 49.4882L127.661 117.125C125.213 119.895 122.971 122.651 119.337 119.688C115.703 116.724 117.055 113.369 119.705 110.637L176.585 49.4882Z"
            fill="#181818"
          />
        </G>
      </Svg>
    </View>
  );
}
