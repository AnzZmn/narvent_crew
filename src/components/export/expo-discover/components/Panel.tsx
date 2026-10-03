import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {BlurView} from 'expo-blur';
import {C, useGlass} from './theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  /** Frosted blur behind the panel (iOS glass only). Use over the map; skip inside sheets. */
  blur?: boolean;
};

/** Card surface. Glass: frosted white with a bright rim. Flat: white (over map) / #F6F5FC (inside sheets). */
export default function Panel({children, style, radius = 16, blur = false}: Props) {
  const glass = useGlass();
  if (!glass) {
    return <View style={[blur ? styles.flatRaised : styles.flatInset, {borderRadius: radius}, style]}>{children}</View>;
  }
  return (
    <View style={[styles.glass, {borderRadius: radius}, style]}>
      {blur && <BlurView intensity={50} tint="light" style={[StyleSheet.absoluteFill, {borderRadius: radius, overflow: 'hidden'}]} />}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, {borderRadius: radius, backgroundColor: blur ? C.glassFill : 'rgba(255,255,255,0.72)'}]} />
      <View pointerEvents="none" style={[styles.rim, {left: radius, right: radius}]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderWidth: 1,
    borderColor: C.glassEdge,
    shadowColor: '#3C288C',
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 14},
  },
  rim: {position: 'absolute', top: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.95)'},
  flatRaised: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.flatLine,
    elevation: 6,
    shadowColor: '#3C288C',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 10},
  },
  flatInset: {backgroundColor: C.flatBg, borderWidth: 1, borderColor: C.flatLine},
});
