/**
 * Log in — Android (flat Material surfaces).
 *
 * No blur: opaque white card and field on the textured ground, elevation-based
 * shadows, and a solid purple OTP button with a ripple. This is the same
 * layout as the iPhone screen, styled for the platform rather than a
 * translucent stack Android renders inconsistently.
 *
 * deps: nativewind, react-native-svg, react-native-safe-area-context
 */
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BadgeMark,
  ILLUSTRATION,
  INK,
  PURPLE,
  PhoneRowContent,
  TextureGround,
  useLoginMetrics,
} from "./LoginShared";

type Props = {
  onRequestOtp?: (phone: string) => void;
  countryCode?: string;
};

export default function LoginAndroid({
  onRequestOtp,
  countryCode = "+91",
}: Props) {
  const insets = useSafeAreaInsets();
  const m = useLoginMetrics();
  const [phone, setPhone] = useState("");

  return (
    <View
      className="flex-1 overflow-hidden"
      style={{ backgroundColor: "#F8F7FF" }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <TextureGround
        width={m.width}
        height={m.height}
        textureOpacity={0.55}
        wash="flat"
      />

      <View
        className="absolute inset-0"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Text
          className="flex-none text-center text-[15px] font-bold"
          style={{ color: INK, marginTop: m.titleTop, letterSpacing: -0.15 }}
        >
          Log in
        </Text>

        <View
          className="relative flex-1"
          style={{
            marginTop: m.cardTopGap,
            marginHorizontal: m.cardSideInset,
            marginBottom: m.cardBottomInset,
          }}
        >
          {/* solid card */}
          <View
            className="absolute overflow-hidden bg-white"
            style={{
              top: m.height * 0.052,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 24,
              paddingTop: m.cardPadTop,
              paddingHorizontal: "8%",
              paddingBottom: m.blockGap,
              elevation: 6,
              shadowColor: "#3C288C",
              shadowOpacity: 0.18,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
            }}
          >
            {/* illustration */}
            <View
              className="flex-1 items-center justify-center overflow-hidden p-2"
              style={{
                minHeight: 0,
                borderRadius: 14,
                backgroundColor: "#FBFAFF",
              }}
            >
              <Image
                source={ILLUSTRATION}
                resizeMode="contain"
                className="h-full w-full"
                accessibilityLabel="Two people chatting over coffee and a laptop"
              />
            </View>

            <View className="flex-none" style={{ marginTop: m.blockGap }}>
              <Text
                className="mb-[9px] text-[12.5px] font-medium"
                style={{ color: INK }}
              >
                Phone number
              </Text>

              <View
                className="h-[46px] flex-row items-center gap-[10px] bg-white px-[14px]"
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E4E1F5",
                }}
              >
                <PhoneRowContent
                  placeholderColor="#A6A3BF"
                  dividerColor="#E4E1F5"
                />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  className="absolute bottom-0 left-[74px] right-[14px] top-0 text-[13.5px]"
                  style={{ color: INK }}
                  accessibilityLabel="Phone number"
                />
              </View>

              <Pressable
                onPress={() => onRequestOtp?.(`${countryCode}${phone}`)}
                android_ripple={{
                  color: "rgba(255,255,255,0.22)",
                  borderless: false,
                }}
                accessibilityRole="button"
                accessibilityLabel="Send OTP"
                className="mt-[14px] h-[46px] items-center justify-center overflow-hidden"
                style={{
                  borderRadius: 23,
                  backgroundColor: PURPLE,
                  elevation: 4,
                  shadowColor: PURPLE,
                  shadowOpacity: 0.5,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 8 },
                }}
              >
                <Text className="text-[14.5px] font-medium text-white">
                  OTP
                </Text>
              </Pressable>
            </View>
          </View>

          {/* logo badge */}
          <View
            className="absolute items-center justify-center bg-white"
            style={{
              top: 0,
              left: "50%",
              marginLeft: -m.badgeSize / 2,
              width: m.badgeSize,
              height: m.badgeSize / 1.05,
              borderRadius: m.badgeSize * 0.22,
              elevation: 8,
              shadowColor: "#3C288C",
              shadowOpacity: 0.3,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 12 },
            }}
          >
            <BadgeMark size={m.badgeSize * 0.38} />
          </View>
        </View>
      </View>

      {/* gesture bar */}
      <View
        className="absolute h-[3.5px] rounded-[2px]"
        style={{
          left: "50%",
          marginLeft: -Math.min(m.width * 0.13, 48),
          width: Math.min(m.width * 0.26, 96),
          bottom: 6,
          backgroundColor: "#AFAFAF",
          opacity: 0.7,
        }}
      />
    </View>
  );
}
