/**
 * Log in — iPhone (glassmorphism).
 *
 * Frosted surfaces throughout: the card, the logo badge, the phone field and
 * the OTP button are translucent with a real blur behind them (BlurView), a
 * bright hairline border and an inner top highlight — the native equivalent of
 * the CSS backdrop-filter stack in the mockup.
 *
 * deps: nativewind, expo-blur (or @react-native-community/blur), react-native-svg,
 *       react-native-safe-area-context
 */
import React, {useState} from 'react';
import {Image, Pressable, StatusBar, Text, TextInput, View} from 'react-native';
import {BlurView} from 'expo-blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BadgeMark,
  ILLUSTRATION,
  INK,
  PhoneRowContent,
  TextureGround,
  useLoginMetrics,
} from './LoginShared';

type Props = {
  onRequestOtp?: (phone: string) => void;
  countryCode?: string;
};

export default function LoginIOS({onRequestOtp, countryCode = '+91'}: Props) {
  const insets = useSafeAreaInsets();
  const m = useLoginMetrics();
  const [phone, setPhone] = useState('');

  return (
    <View className="flex-1 overflow-hidden" style={{backgroundColor: '#EFEBFF'}}>
      <StatusBar barStyle="dark-content" />
      <TextureGround width={m.width} height={m.height} textureOpacity={0.9} wash="glass" />

      <View
        className="absolute inset-0"
        style={{paddingTop: insets.top, paddingBottom: insets.bottom}}>
        <Text
          className="flex-none text-center text-[15px] font-bold"
          style={{color: INK, marginTop: m.titleTop, letterSpacing: -0.15}}>
          Log in
        </Text>

        <View
          className="relative flex-1"
          style={{
            marginTop: m.cardTopGap,
            marginHorizontal: m.cardSideInset,
            marginBottom: m.cardBottomInset,
          }}>
          {/* frosted card */}
          <BlurView
            intensity={60}
            tint="light"
            className="absolute overflow-hidden"
            style={{
              top: m.height * 0.052,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 26,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.7)',
              shadowColor: '#3C288C',
              shadowOpacity: 0.28,
              shadowRadius: 26,
              shadowOffset: {width: 0, height: 18},
              elevation: 10,
            }}>
            <View
              className="flex-1"
              style={{
                backgroundColor: 'rgba(255,255,255,0.42)',
                paddingTop: m.cardPadTop,
                paddingHorizontal: '8%',
                paddingBottom: m.blockGap,
              }}>
              {/* illustration */}
              <View
                className="flex-1 items-center justify-center overflow-hidden p-2"
                style={{
                  minHeight: 0,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.34)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.55)',
                }}>
                <Image
                  source={ILLUSTRATION}
                  resizeMode="contain"
                  className="h-full w-full"
                  accessibilityLabel="Two people chatting over coffee and a laptop"
                />
              </View>

              <View className="flex-none" style={{marginTop: m.blockGap}}>
                <Text
                  className="mb-[9px] text-[12.5px] font-medium"
                  style={{color: INK}}>
                  Phone number
                </Text>

                {/* frosted phone field */}
                <BlurView
                  intensity={40}
                  tint="light"
                  className="h-[46px] flex-row items-center gap-[10px] overflow-hidden px-[14px]"
                  style={{
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.75)',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                  }}>
                  <PhoneRowContent
                    placeholderColor="#6E6A8C"
                    dividerColor="rgba(14,14,20,0.14)"
                  />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    placeholder=""
                    className="absolute bottom-0 left-[74px] right-[14px] top-0 text-[13.5px]"
                    style={{color: INK}}
                    accessibilityLabel="Phone number"
                  />
                </BlurView>

                {/* OTP button */}
                <Pressable
                  onPress={() => onRequestOtp?.(`${countryCode}${phone}`)}
                  accessibilityRole="button"
                  accessibilityLabel="Send OTP"
                  className="mt-[14px] h-[46px] items-center justify-center overflow-hidden"
                  style={({pressed}) => ({
                    borderRadius: 23,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.45)',
                    backgroundColor: pressed
                      ? 'rgba(99,79,232,0.95)'
                      : 'rgba(118,98,248,0.95)',
                    shadowColor: '#6D58F4',
                    shadowOpacity: 0.55,
                    shadowRadius: 18,
                    shadowOffset: {width: 0, height: 10},
                    elevation: 6,
                  })}>
                  <Text className="text-[14.5px] font-medium text-white">OTP</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>

          {/* frosted logo badge, straddling the card's top edge */}
          <BlurView
            intensity={70}
            tint="light"
            className="absolute items-center justify-center overflow-hidden"
            style={{
              top: 0,
              left: '50%',
              marginLeft: -m.badgeSize / 2,
              width: m.badgeSize,
              height: m.badgeSize / 1.05,
              borderRadius: m.badgeSize * 0.24,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.8)',
              backgroundColor: 'rgba(255,255,255,0.55)',
              shadowColor: '#3C288C',
              shadowOpacity: 0.3,
              shadowRadius: 18,
              shadowOffset: {width: 0, height: 14},
              elevation: 8,
            }}>
            <BadgeMark size={m.badgeSize * 0.38} />
          </BlurView>
        </View>
      </View>

      {/* home indicator */}
      <View
        className="absolute h-[3.5px] rounded-[2px]"
        style={{
          left: '50%',
          marginLeft: -Math.min(m.width * 0.13, 48),
          width: Math.min(m.width * 0.26, 96),
          bottom: 6,
          backgroundColor: INK,
          opacity: 0.3,
        }}
      />
    </View>
  );
}
