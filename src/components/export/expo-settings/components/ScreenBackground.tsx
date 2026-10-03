import React from 'react';
import {StyleSheet, View} from 'react-native';
import GradientFill from './GradientFill';
import {C, GLASS_BG, useGlass} from '../theme';

/** Lavender gradient on iOS, flat #F6F5FC on Android. Opaque so it fully covers the Home pane during the slide. */
export default function ScreenBackground() {
  const glass = useGlass();
  return (
    <View style={[StyleSheet.absoluteFill, {backgroundColor: glass ? GLASS_BG.colors[1] : C.flatBg}]} pointerEvents="none">
      {glass && <GradientFill colors={GLASS_BG.colors} stops={GLASS_BG.stops} from={[0.6, 0]} to={[0.4, 1]} />}
    </View>
  );
}
