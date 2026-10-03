import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {C} from './theme';
import type {Trade} from '../types';

/** 24×24 paths, lifted from the mockup */
export const PATHS = {
  bolt: 'M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z',
  wrench: 'M14.5 5.5a4 4 0 0 0-5.3 5.3L4 16l4 4 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.6-.7-.7-2.6 2.6-2.6Z',
  hammer: 'M4 20l8.5-8.5M10 7l3-3 7 7-3 3-2-2-2 2-3-3 2-2-2-2Z',
  roller: 'M5 4h12v5H5V4Zm12 2.5h2v5h-7V14m-1 0h2v6h-2v-6Z',
  box: 'M4 8l8-4 8 4v8l-8 4-8-4V8Zm0 0 8 4 8-4M12 12v8',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  map: 'M9 5 3 7.5v12L9 17l6 2.5 6-2.5V5l-6 2.5L9 5Zm0 0v12m6-9.5v12',
  locate: 'M20 4 4 11l7 2 2 7 7-16Z',
  pin: 'M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Zm2.5-11.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z',
  check: 'M5 12.5 10 17l9-10',
  checkSm: 'M2.5 6.2 5 8.5l4.5-5',
  close: 'M7 7l10 10M17 7 7 17',
};

export const TRADE_ICON: Record<Trade, string> = {
  Electrical: PATHS.bolt,
  Plumbing: PATHS.wrench,
  Carpentry: PATHS.hammer,
  Painting: PATHS.roller,
  Helper: PATHS.box,
};

type Props = {d: string; size?: number; color?: string; strokeWidth?: number; fill?: boolean; viewBox?: string};

export function Icon({d, size = 18, color = C.violet, strokeWidth = 1.7, fill = false, viewBox = '0 0 24 24'}: Props) {
  return (
    <Svg width={size} height={size} viewBox={viewBox} fill="none">
      <Path
        d={d}
        fill={fill ? color : 'none'}
        stroke={fill ? 'none' : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
