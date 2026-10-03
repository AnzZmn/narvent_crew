import React from "react";
import Svg, { Path } from "react-native-svg";
import { C } from "./theme";

/** 24×24 stroke paths, lifted from the mockup */
export const PATHS = {
  pencil: "M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4",
  pencilSm: "M4 20h4L19 9l-4-4L4 16v4Z",
  copy: "M10.5 8h7A2.5 2.5 0 0 1 20 10.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 8 17.5v-7A2.5 2.5 0 0 1 10.5 8ZM16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8",
  camera:
    "M4 8.5h3l1.6-2.5h6.8L17 8.5h3V19H4V8.5ZM15 13.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  qr: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2.5v2.5H14V14Zm3.5 3.5H20V20h-2.5v-2.5ZM14 19v1m6-6v1",
  check: "M5 12.4 10 17l9-10",
  lock: "M7 11h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Zm1.5 0V8.5a3.5 3.5 0 0 1 7 0V11",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  close: "M7 7l10 10M17 7 7 17",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  trash: "M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12",
  bolt: "M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z",
  briefcase: "M4 7h16v12H4V7Zm5 0V5h6v2M4 12h16",
  bank: "M3 7.5h18v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-10Zm0 0 .9-2.1A1.5 1.5 0 0 1 5.3 4.5h13.4a1.5 1.5 0 0 1 1.4.9l.9 2.1M3 11h18M7 15.5h3",
  doc: "M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Zm7 0v4h4M9 12.5h6M9 16h4",
  card: "M3.5 6.5h17v11h-17v-11ZM7 10.5h4M7 13.5h6M15 10h2.5v4H15v-4Z",
  car: "M5 15.5V12l1.8-4.2A1.5 1.5 0 0 1 8.2 7h7.6a1.5 1.5 0 0 1 1.4.8L19 12v3.5M5 15.5h14M5 15.5V18m14-2.5V18M8 12.5h.01M16 12.5h.01",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z",
};

export type IconName = keyof typeof PATHS;

/** Icons for the "Profile completion" missing items, by item id */
export const MISSING_ICONS: Record<string, string> = {
  photo: PATHS.camera,
  emergency: PATHS.phone,
  skills: PATHS.briefcase,
};

type Props = { d: string; size?: number; color?: string; strokeWidth?: number };

export function Icon({
  d,
  size = 18,
  color = C.violet,
  strokeWidth = 1.7,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BackArrow({ color = C.ink }: { color?: string }) {
  return (
    <Svg width={22} height={16} viewBox="0 0 22 16" fill="none">
      <Path
        d="M21 8H2M2 8L8.4 1.6M2 8L8.4 14.4"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
