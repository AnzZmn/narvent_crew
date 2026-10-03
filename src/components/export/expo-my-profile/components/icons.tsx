import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { C } from "./theme";

export function MenuIcon() {
  return (
    <Svg width={20} height={14} viewBox="0 0 20 14" fill="none">
      <Path
        d="M1 1h18M1 7h18M1 13h12"
        stroke={C.ink}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ChevronRight({ color = C.purple }: { color?: string }) {
  return (
    <Svg width={7} height={11} viewBox="0 0 7 11" fill="none">
      <Path
        d="M1 1l4.4 4.5L1 10"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const STAR =
  "M11 0l3.2 7h7.3l-5.9 4.4 2.2 7.2L11 14.2 4.2 18.6l2.2-7.2L.5 7h7.3L11 0Z";
export function Star({ size, on }: { size: number; on: boolean }) {
  return (
    <Svg width={size} height={(size * 21) / 22} viewBox="0 0 22 21" fill="none">
      <Path d={STAR} fill={on ? C.star : C.starOff} />
    </Svg>
  );
}

export function CameraIcon() {
  return (
    <Svg width={17} height={15} viewBox="0 0 17 15" fill="none">
      <Rect
        x={0.9}
        y={3.3}
        width={15.2}
        height={10.8}
        rx={2.6}
        stroke="#fff"
        strokeWidth={1.5}
      />
      <Circle cx={8.5} cy={8.7} r={2.9} stroke="#fff" strokeWidth={1.5} />
      <Path
        d="M5.6 3.3 6.7 1h3.6l1.1 2.3"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClockIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Circle cx={6} cy={6} r={5.2} stroke={C.meta} strokeWidth={1.2} />
      <Path
        d="M6 3.2V6l2 1.4"
        stroke={C.meta}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CashIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Rect
        x={0.6}
        y={2.4}
        width={10.8}
        height={7.2}
        rx={1.4}
        stroke={C.meta}
        strokeWidth={1.2}
      />
      <Path
        d="M3 6h6"
        stroke={C.meta}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CarIcon() {
  return (
    <Svg width={14} height={12} viewBox="0 0 14 12" fill="none">
      <Path
        d="M1.2 8.4V6l1.4-3h8.8L13 6v2.4H1.2Z"
        stroke={C.meta}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Circle cx={3.6} cy={9} r={1.2} stroke={C.meta} strokeWidth={1.2} />
      <Circle cx={10.4} cy={9} r={1.2} stroke={C.meta} strokeWidth={1.2} />
    </Svg>
  );
}

export function ChatIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 2.6c4.8 0 8.6 3.2 8.6 7.2 0 4-3.8 7.2-8.6 7.2-1 0-2-.15-2.9-.4L4 19l1.2-3.1C3.4 14.6 2.4 12.8 2.4 9.8c0-4 3.8-7.2 8.6-7.2Z"
        stroke={C.purple}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BackArrow() {
  return (
    <Svg width={22} height={16} viewBox="0 0 22 16" fill="none">
      <Path
        d="M21 8H2M2 8L8.4 1.6M2 8L8.4 14.4"
        stroke={C.ink}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CaretDown() {
  return (
    <Svg width={10} height={6} viewBox="0 0 10 6" fill="none">
      <Path
        d="M1 1L5 5L9 1"
        stroke={C.purple}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SendIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
      <Path
        d="M2 11.6 11.4 2.2l3.4 3.4L5.4 15 2 15.4 2 11.6Z"
        stroke={C.purple}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MapPin() {
  return (
    <Svg width={22} height={28} viewBox="0 0 22 28" fill="none">
      <Path
        d="M11 27.5C11 27.5 21 16.6 21 10.6 21 5.02 16.52.5 11 .5S1 5.02 1 10.6C1 16.6 11 27.5 11 27.5Z"
        fill={C.purple}
        stroke="#fff"
        strokeWidth={1.4}
      />
      <Path d="M11 6.5l4.2 3.4v5.1H6.8V9.9L11 6.5Z" fill="#fff" />
    </Svg>
  );
}

export function PinSmall() {
  return (
    <Svg width={11} height={14} viewBox="0 0 11 14" fill="none">
      <Path
        d="M5.5 13.2S10.3 7.9 10.3 5.2A4.8 4.8 0 1 0 .7 5.2c0 2.7 4.8 8 4.8 8Z"
        fill="#fff"
      />
    </Svg>
  );
}

export function SearchIcon() {
  return (
    <Svg width={11} height={11} viewBox="0 0 12 12" fill="none">
      <Circle cx={5.2} cy={5.2} r={3.6} stroke="#fff" strokeWidth={1.3} />
      <Path
        d="M8.2 8.2 10.8 10.8"
        stroke="#fff"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function LayersIcon() {
  return (
    <Svg width={11} height={11} viewBox="0 0 12 12" fill="none">
      <Path
        d="M1.4 3.2 4.6 1.6l2.8 1.6 3.2-1.6v7.2L7.4 10.4 4.6 8.8 1.4 10.4V3.2Z"
        stroke="#fff"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function NavigateIcon() {
  return (
    <Svg width={11} height={11} viewBox="0 0 12 12" fill="none">
      <Path
        d="M10.8 1.2 1.2 5.4l3.9 1.5 1.5 3.9 4.2-9.6Z"
        stroke="#fff"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const HOUSE =
  "M4 10.4 12 4l8 6.4V20a.9.9 0 0 1-.9.9h-4.3v-6h-5.6v6H4.9A.9.9 0 0 1 4 20v-9.6Z";
export function HomeIcon({
  filled,
  color,
}: {
  filled: boolean;
  color: string;
}) {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <Path d={HOUSE} fill={color} />
      ) : (
        <Path
          d={HOUSE}
          stroke={color}
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

export function ProfileIcon({
  filled,
  color,
}: {
  filled: boolean;
  color: string;
}) {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <>
          <Circle cx={12} cy={8.2} r={3.9} fill={color} />
          <Path
            d="M4.8 20.6c0-3.7 3.2-5.8 7.2-5.8s7.2 2.1 7.2 5.8H4.8Z"
            fill={color}
          />
        </>
      ) : (
        <>
          <Circle cx={12} cy={8.2} r={3.9} stroke={color} strokeWidth={1.7} />
          <Path
            d="M4.8 20.4c0-3.6 3.2-5.6 7.2-5.6s7.2 2 7.2 5.6"
            stroke={color}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
}
