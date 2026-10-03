import React, {useId, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import {P, useGlass} from './theme';

const RY = 58; // vertical corner radius
const RX = 0.42; // horizontal corner radius, fraction of width

/**
 * Stand-in for CSS `border-radius: 42% 42% 0 0 / 58px 58px 0 0`, which RN can't do.
 * Glass: 200° violet gradient with a white top rim. Flat: solid #8A3BFF.
 */
export default function ArchBackground() {
  const glass = useGlass();
  const id = 'arch' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const [size, setSize] = useState({w: 0, h: 0});
  const onLayout = (e: LayoutChangeEvent) => setSize({w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height});
  const {w, h} = size;
  const rx = w * RX;
  const k = 0.5523; // bezier circle constant
  const d = w
    ? `M0 ${RY} C0 ${RY * (1 - k)} ${rx * (1 - k)} 0 ${rx} 0 L${w - rx} 0 C${w - rx * (1 - k)} 0 ${w} ${RY * (1 - k)} ${w} ${RY} L${w} ${h} L0 ${h} Z`
    : '';
  const rim = w ? `M0 ${RY} C0 ${RY * (1 - k)} ${rx * (1 - k)} 0 ${rx} 0 L${w - rx} 0 C${w - rx * (1 - k)} 0 ${w} ${RY * (1 - k)} ${w} ${RY}` : '';
  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none">
      {w > 0 && (
        <Svg width={w} height={h}>
          <Defs>
            <LinearGradient id={id} x1="0.67" y1="0" x2="0.33" y2="1">
              <Stop offset="0" stopColor="#9A4DFF" stopOpacity={0.92} />
              <Stop offset="1" stopColor="#6C2BF0" stopOpacity={0.95} />
            </LinearGradient>
          </Defs>
          <Path d={d} fill={glass ? `url(#${id})` : P.refer} />
          {glass && <Path d={rim} stroke="rgba(255,255,255,0.4)" strokeWidth={1} fill="none" />}
        </Svg>
      )}
    </View>
  );
}
