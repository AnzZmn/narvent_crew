import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {C} from '../theme';

export const ICON_PATHS = {
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5',
  bank: 'M3 7.5h18v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-10Zm0 0 .9-2.1A1.5 1.5 0 0 1 5.3 4.5h13.4a1.5 1.5 0 0 1 1.4.9l.9 2.1M3 11h18M7 15.5h3',
  doc: 'M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Zm7 0v4h4M9 12.5h6M9 16h4',
  bell: 'M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15l1.5-2ZM10 20.5h4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5.5M12 7.6v.1',
  list: 'M8 6.5h11M8 12h11M8 17.5h11M4.5 6.5h.1M4.5 12h.1M4.5 17.5h.1',
  shield: 'M12 3 5 5.8v5.4c0 4.3 3 8 7 9.3 4-1.3 7-5 7-9.3V5.8L12 3Zm-3 9 2.2 2.2L15.5 10',
  phone: 'M5 4.5h3.2l1.6 4-2 1.3a10 10 0 0 0 5.4 5.4l1.3-2 4 1.6v3.2A1.5 1.5 0 0 1 17 19.5 13.5 13.5 0 0 1 3.5 6 1.5 1.5 0 0 1 5 4.5Z',
  mail: 'M3.5 6h17v12h-17V6Zm0 0 8.5 7 8.5-7',
  chat: 'M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1Z',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
} as const;

export type IconName = keyof typeof ICON_PATHS;

export function LineIcon({name, size = 18, color = C.violet}: {name: IconName; size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={ICON_PATHS[name]} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BackArrow() {
  return (
    <Svg width={22} height={16} viewBox="0 0 22 16" fill="none">
      <Path d="M21 8H2M2 8L8.4 1.6M2 8L8.4 14.4" stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Chevron() {
  return (
    <Svg width={8} height={13} viewBox="0 0 8 13" fill="none">
      <Path d="M1.5 1.5 6.5 6.5l-5 5" stroke={C.faint} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
