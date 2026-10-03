import {createContext, useContext} from 'react';
import {Easing, Platform, TextStyle} from 'react-native';

export type Variant = 'glass' | 'flat';

/** iOS → liquid glass, Android → flat. Override with <DiscoverFlow variant="…" />. */
export const VariantContext = createContext<Variant>(Platform.OS === 'ios' ? 'glass' : 'flat');
export const useGlass = () => useContext(VariantContext) === 'glass';

export const C = {
  violet: '#7D3BFF',
  violetTop: '#9A7BFF',
  ink: '#0E0E14',
  body: '#4A4766',
  sub: '#6B6788',
  muted: '#8B87A8',
  faint: '#A6A3BF',
  navIdle: '#7B7795',
  markerInk: '#2B2540',
  chipBg: '#E8E4FB',
  tagText: '#5B49C9',
  tile: 'rgba(125,105,255,0.14)',
  hair: 'rgba(14,14,20,0.06)',
  danger: '#E5484D',
  dangerBg: '#FDECEC',
  dangerText: '#C4363A',
  star: '#F5A524',
  white: '#FFFFFF',
  scrim: 'rgba(20,14,50,0.34)',
  // Android (flat)
  flatBg: '#F6F5FC',
  flatLine: '#EDEBF7',
  flatSoft: '#EDE8FB',
  // iOS (glass)
  glassSoft: 'rgba(125,59,255,0.10)',
  glassEdge: 'rgba(255,255,255,0.8)',
  glassFill: 'rgba(255,255,255,0.62)',
};

/** Top fade over the map, behind the title + chips */
export const HEADER_FADE = {
  glass: {colors: ['#E6DEFF', 'rgba(236,230,255,0.88)', 'rgba(236,230,255,0)'], stops: [0, 0.52, 1]},
  flat: {colors: ['#F6F5FC', 'rgba(246,245,252,0.9)', 'rgba(246,245,252,0)'], stops: [0, 0.52, 1]},
};

/** Job sheet background (glass) */
export const SHEET_BG = {colors: ['#EEE8FF', '#F8F6FF'], stops: [0, 0.4]};

/** Fill these after loading DM Sans with expo-font. undefined = system font. */
export const FAMILY: Record<'400' | '500' | '600' | '700', string | undefined> = {
  '400': undefined,
  '500': undefined,
  '600': undefined,
  '700': undefined,
};
export const MONO = Platform.select({ios: 'Menlo', default: 'monospace'});

export const font = (weight: keyof typeof FAMILY, size: number, color: string = C.ink, lineHeight?: number): TextStyle => ({
  fontSize: size,
  color,
  fontWeight: weight,
  ...(FAMILY[weight] ? {fontFamily: FAMILY[weight]} : null),
  ...(lineHeight ? {lineHeight} : null),
});

/** iOS sheet curve used for the sheet and the tab highlight */
export const EASE = Easing.bezier(0.32, 0.72, 0, 1);
export const SLIDE_MS = 420;
