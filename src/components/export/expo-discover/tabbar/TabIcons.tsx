import React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';

type P = {filled: boolean; color: string; size?: number};
const STROKE = 1.7;

export function HomeIcon({filled, color, size = 23}: P) {
  const d = 'M4 10.4 12 4l8 6.4V20a.9.9 0 0 1-.9.9h-4.3v-6h-5.6v6H4.9A.9.9 0 0 1 4 20v-9.6Z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? <Path d={d} fill={color} /> : <Path d={d} stroke={color} strokeWidth={STROKE} strokeLinejoin="round" />}
    </Svg>
  );
}

/** Compass. Filled = solid disc with the needle cut out in `cut` (white on iOS, violet on Android). */
export function DiscoverIcon({filled, color, size = 23, cut = '#FFFFFF'}: P & {cut?: string}) {
  const needle = 'm15.6 8.4-2 5.2-5.2 2 2-5.2 5.2-2Z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <G>
          <Circle cx={12} cy={12} r={9.4} fill={color} />
          <Path d={needle} fill={cut} />
        </G>
      ) : (
        <G>
          <Circle cx={12} cy={12} r={8.6} stroke={color} strokeWidth={STROKE} />
          <Path d={needle} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
        </G>
      )}
    </Svg>
  );
}

export function ProfileIcon({filled, color, size = 23}: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <G>
          <Circle cx={12} cy={8.2} r={3.9} fill={color} />
          <Path d="M4.8 20.6c0-3.7 3.2-5.8 7.2-5.8s7.2 2.1 7.2 5.8H4.8Z" fill={color} />
        </G>
      ) : (
        <G>
          <Circle cx={12} cy={8.2} r={3.9} stroke={color} strokeWidth={STROKE} />
          <Path d="M4.8 20.4c0-3.6 3.2-5.6 7.2-5.6s7.2 2 7.2 5.6" stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
        </G>
      )}
    </Svg>
  );
}
