import {createContext, useContext} from 'react';
import {Platform} from 'react-native';

export type Variant = 'glass' | 'flat';

/** iOS → frosted glass, Android → flat Material. Override with <WorkerHome variant="…" />. */
export const VariantContext = createContext<Variant>(Platform.OS === 'ios' ? 'glass' : 'flat');
export const useGlass = () => useContext(VariantContext) === 'glass';

export const C = {
  purple: '#7D69FF',
  purplePressed: '#5A44E0',
  bar: '#855CF8',
  ink: '#0E0E14',
  ink2: '#181818',
  body: '#444444',
  grey: '#7A7A7A',
  muted: '#8B87A8',
  meta: '#7C71C7',
  navIdle: '#7B7795',
  red: '#FF5A5F',
  redPressed: '#F04B50',
  star: '#FFEE00',
  starOff: '#C9C9C9',
  line: '#EDEBF7',
  divider: '#E7E4F2',
  faint: '#A6A3BF',
  chipBg: '#E8E4FB',
  chipText: '#6C5ECF',
  me: '#6C5ECF',
  lime: '#C8F000',
  cancelled: '#FF8A94',
};

/** stand-in for DM Mono on small labels */
export const MONO = Platform.select({ios: 'Menlo', default: 'monospace'});

export const GAP = 14;
