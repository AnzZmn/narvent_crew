import {createContext, useContext} from 'react';
import {Platform} from 'react-native';

export type Variant = 'glass' | 'flat';

/** iOS → frosted glass, Android → flat white/lavender. Override with variant="…". */
export const VariantContext = createContext<Variant>(Platform.OS === 'ios' ? 'glass' : 'flat');
export const useGlass = () => useContext(VariantContext) === 'glass';

export const C = {
  ink: '#0E0E14',
  body: '#4A4766',
  muted: '#8B87A8',
  faint: '#A6A3BF',
  violet: '#7D3BFF',
  violetSoft: '#9A7BFF',
  purple: '#7D69FF',
  tint: '#F3EDFF',
  chipBg: '#E8E4FB',
  chipText: '#6C5ECF',
  pendingBg: '#FFF4C2',
  pendingText: '#8A6A00',
  line: '#EDEBF7',
  inputBorder: '#E7E4F2',
  divider: 'rgba(14,14,20,0.06)',
  toggleOff: '#D9D5EA',
  danger: '#E5484D',
  dangerBorder: '#FF8A94',
  flatBg: '#F6F5FC',
};

/** iOS screen background (190deg lavender wash) */
export const GLASS_BG = {colors: ['#EDE4FF', '#F6F2FF', '#EFE7FF'], stops: [0, 0.46, 1]};

export const MONO = Platform.select({ios: 'Menlo', default: 'monospace'});
export const GAP = 14;

/** Carousel + detail timing (matches the mockup: .5s cubic-bezier(.22,.8,.26,1)) */
export const SLIDE_MS = 500;
export const DETAIL_MS = 280;
