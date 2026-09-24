/**
 * Pieces shared by LoginIOS and LoginAndroid.
 *
 * Nothing here decides platform look — each screen passes its own surface
 * styling in. What is shared: the arrow-texture ground, the logo badge mark,
 * the country picker + phone row layout, and the fluid sizing rules.
 *
 * deps: nativewind, react-native-svg, react-native-svg-transformer
 *   (metro.config.js must route .svg through react-native-svg-transformer so
 *    `import ArrowTexture from '../assets/arrow-texture.svg'` yields a component)
 */
import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import Svg, {
  Defs,
  Path,
  Rect,
  Stop,
  RadialGradient,
  LinearGradient,
  G,
  Mask,
} from "react-native-svg";

export const PURPLE = "#7D69FF";
export const INK = "#0E0E14";

/** Fluid values derived from the live window box, with px floors. */
export function useLoginMetrics() {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    titleTop: height * 0.07,
    cardSideInset: width * 0.034,
    cardBottomInset: height * 0.066,
    cardTopGap: height * 0.032,
    badgeSize: Math.max(72, Math.min(width * 0.23, 96)),
    cardPadTop: height * 0.09,
    blockGap: height * 0.034,
  };
}

/** Repeating arrow texture + the light wash over it. */
export function TextureGround({
  width,
  height,
  textureOpacity,
  wash,
}: {
  width: number;
  height: number;
  textureOpacity: number;
  wash: "glass" | "flat";
}) {
  // The tile is authored at 360x800; cover the screen with whole tiles.
  const cols = Math.ceil(width / 360);
  const rows = Math.ceil(height / 800);
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push(
        <View
          key={`${r}-${c}`}
          className="absolute"
          style={{ left: c * 360, top: r * 800 }}
        ></View>,
      );
    }
  }

  return (
    <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
      <View className="absolute inset-0" style={{ opacity: textureOpacity }}>
        {tiles}
      </View>
      <Svg width={width} height={height} style={{ position: "absolute" }}>
        <Defs>
          <RadialGradient
            id="wash"
            cx="50%"
            cy={wash === "glass" ? "20%" : "24%"}
            rx="90%"
            ry="46%"
          >
            <Stop
              offset="0.3"
              stopColor="#FFFFFF"
              stopOpacity={wash === "glass" ? 0.92 : 1}
            />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="tint" x1="0" y1="0" x2="0.6" y2="1">
            <Stop offset="0" stopColor={PURPLE} stopOpacity="0.22" />
            <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0" />
            <Stop offset="1" stopColor={PURPLE} stopOpacity="0.18" />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#wash)" />
        {wash === "glass" && (
          <Rect width={width} height={height} fill="url(#tint)" />
        )}
      </Svg>
    </View>
  );
}

/** Narvent "n" in brand purple, used inside the badge. */
export function BadgeMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={(size * 94) / 53} viewBox="152 353 53 94">
      <Path
        d="M160.166 446.358L152.161 430.493L174.048 446.357L160.166 446.358Z"
        fill={PURPLE}
      />
      <Path
        d="M160.166 384.883L178.471 395.027V446.358H160.166V384.883Z"
        fill={PURPLE}
      />
      <Mask id="badgeClip">
        <Rect
          x={160.166}
          y={353}
          width={44.2379}
          height={65.1365}
          fill="#fff"
        />
      </Mask>
      <G mask="url(#badgeClip)">
        <Path
          d="M160.082 355.594L204.405 379.948V418.145L186.542 408.289V389.96L160.082 375.384V355.594Z"
          fill={PURPLE}
        />
      </G>
    </Svg>
  );
}

export function Caret() {
  return (
    <Svg width={10} height={6} viewBox="0 0 10 6" fill="none">
      <Path
        d="M1 1L5 5L9 1"
        stroke={INK}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** "IN ⌄ | +91 0000 0000 00" — the inner content of the phone field. */
export function PhoneRowContent({
  placeholderColor,
  dividerColor,
}: {
  placeholderColor: string;
  dividerColor: string;
}) {
  return (
    <>
      <View className="flex-none flex-row items-center gap-[5px]">
        <Text className="text-[13.5px] font-medium" style={{ color: INK }}>
          IN
        </Text>
        <Caret />
      </View>
      <View
        className="h-[20px] w-[1px] flex-none"
        style={{ backgroundColor: dividerColor }}
      />
      <Text className="text-[13.5px]" style={{ color: placeholderColor }}>
        +91 0000 0000 00
      </Text>
    </>
  );
}

export const ILLUSTRATION = require("../../../../../assets/images/Onboarding/Big Shoes Chatting.png");
