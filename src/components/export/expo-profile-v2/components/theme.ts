import { createContext, useContext } from "react";
import { Easing, Platform, TextStyle } from "react-native";

export type Variant = "glass" | "flat";

/** iOS → liquid glass, Android → flat. Override with <ProfileFlow variant="…" />. */
export const VariantContext = createContext<Variant>(
  Platform.OS === "ios" ? "glass" : "flat",
);
export const useGlass = () => useContext(VariantContext) === "glass";

export const C = {
  violet: "#7D3BFF",
  violetTop: "#9A7BFF",
  ink: "#0E0E14",
  body: "#4A4766",
  muted: "#8B87A8",
  faint: "#A6A3BF",
  idle: "#6E6A88",
  chipBg: "#E8E4FB",
  chipText: "#6C5ECF",
  tagText: "#5B49C9",
  tile: "rgba(125,105,255,0.14)",
  track: "rgba(125,59,255,0.14)",
  hair: "rgba(14,14,20,0.06)",
  dashed: "#B9AEFF",
  outline: "#C9C0FF",
  toggleOff: "#D9D5EA",
  danger: "#E5484D",
  ok: "#2F8F5B",
  bad: "#D93A44",
  amber: "#F2B544",
  white: "#FFFFFF",
  // Android (flat)
  flatBg: "#F6F5FC",
  flatLine: "#EDEBF7",
  flatInput: "#E7E4F2",
  flatSoft: "#EDE8FB",
  // iOS (glass)
  glassSoft: "rgba(255,255,255,0.55)",
  glassEdge: "rgba(255,255,255,0.72)",
  glassInput: "rgba(255,255,255,0.5)",
};

/** Glass screen background, same as Worker Home: 190° #E6DEFF → #F3F0FF (45%) → #E9E3FF */
export const BG = {
  colors: ["#E6DEFF", "#F3F0FF", "#E9E3FF"],
  stops: [0, 0.45, 1],
};

/** Fill these after loading DM Sans with expo-font. undefined = system font. */
export const FAMILY: Record<"400" | "500" | "600" | "700", string | undefined> =
  {
    "400": undefined,
    "500": undefined,
    "600": undefined,
    "700": undefined,
  };
export const MONO = Platform.select({ ios: "Menlo", default: "monospace" });

export const font = (
  weight: keyof typeof FAMILY,
  size: number,
  color: string = C.ink,
  lineHeight?: number,
): TextStyle => ({
  fontSize: size,
  color,
  fontWeight: weight,
  ...(FAMILY[weight] ? { fontFamily: FAMILY[weight] } : null),
  ...(lineHeight ? { lineHeight } : null),
});

/** iOS sheet curve used for page slides, sheets and the tab thumb */
export const EASE = Easing.bezier(0.32, 0.72, 0, 1);
export const SLIDE_MS = 420;
