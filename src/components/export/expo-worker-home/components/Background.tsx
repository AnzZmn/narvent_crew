import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Defs, RadialGradient, Rect, Stop} from 'react-native-svg';
import GradientFill from './GradientFill';
import {useGlass} from './theme';

/** Screen ground. Glass: lavender gradient + soft glows for the blur to pick up. Flat: solid #F6F5FC. */
export default function Background() {
  const glass = useGlass();
  if (!glass) return <View style={[StyleSheet.absoluteFill, styles.flat]} pointerEvents="none" />;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <GradientFill colors={['#E6DEFF', '#F3F0FF', '#E9E3FF']} stops={[0, 0.45, 1]} from={[0.41, 0]} to={[0.59, 1]} />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id="whGlow1" cx="12%" cy="30%" r="50%">
            <Stop offset="0" stopColor="#B7A8FF" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#B7A8FF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="whGlow2" cx="92%" cy="68%" r="55%">
            <Stop offset="0" stopColor="#9C88FF" stopOpacity="0.45" />
            <Stop offset="1" stopColor="#9C88FF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#whGlow1)" />
        <Rect width="100%" height="100%" fill="url(#whGlow2)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({flat: {backgroundColor: '#F6F5FC'}});
