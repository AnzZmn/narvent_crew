import React, { useId } from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

type Props = {
  colors: string[];
  stops: number[];
  from?: [number, number];
  to?: [number, number];
  radius?: number;
};

/** Absolute-fill linear gradient (stand-in for CSS linear-gradient). */
export default function GradientFill({
  colors,
  stops,
  from = [0.5, 0],
  to = [0.5, 1],
  radius = 0,
}: Props) {
  const id = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      pointerEvents="none"
    >
      <Defs>
        <LinearGradient id={id} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}>
          {colors.map((c, i) => (
            <Stop key={i} offset={stops[i]} stopColor={c} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" rx={radius} fill={`url(#${id})`} />
    </Svg>
  );
}
