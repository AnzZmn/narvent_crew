import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { P } from "./theme";

export function PencilIcon({
  size = 10,
  color = "#FFFFFF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M1.5 10.5L2 8L8.5 1.5L10.5 3.5L4 10L1.5 10.5Z" fill={color} />
    </Svg>
  );
}

export function ShareIcon({ color = P.inputBg }: { color?: string }) {
  return (
    <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
      <Circle cx={11} cy={2.6} r={2} stroke={color} strokeWidth={1.3} />
      <Circle cx={3} cy={7} r={2} stroke={color} strokeWidth={1.3} />
      <Circle cx={11} cy={11.4} r={2} stroke={color} strokeWidth={1.3} />
      <Path
        d="M9.2 3.6 4.8 6M4.8 8 9.2 10.4"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  );
}

export function LinkIcon({ color = P.inputBg }: { color?: string }) {
  return (
    <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
      <Path
        d="M5.6 8.4a2.6 2.6 0 0 1 0-3.7l2-2a2.6 2.6 0 0 1 3.7 3.7l-.9.9"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <Path
        d="M8.4 5.6a2.6 2.6 0 0 1 0 3.7l-2 2a2.6 2.6 0 0 1-3.7-3.7l.9-.9"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SelectChevron() {
  return (
    <Svg width={9} height={6} viewBox="0 0 10 6" fill="none">
      <Path
        d="M1 1L5 5L9 1"
        stroke={P.chevron}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
