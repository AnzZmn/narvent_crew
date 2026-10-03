import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useGlass} from './theme';

type Props = {
  /** row = work item, stat = statistics tile, pay = payment row (on the tinted card) */
  kind?: 'row' | 'stat' | 'pay';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** Surfaces nested inside a card. No second blur on glass: a translucent fill over the parent blur is enough and cheaper. */
export default function InnerSurface({kind = 'row', style, children}: Props) {
  const glass = useGlass();
  const look = glass ? GLASS[kind] : FLAT[kind];
  return <View style={[kind === 'stat' ? styles.stat : styles.row, look, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {borderRadius: 14, padding: 14},
  stat: {borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14},
});

const GLASS = StyleSheet.create({
  row: {backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.62)'},
  stat: {backgroundColor: 'rgba(255,255,255,0.42)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)'},
  pay: {backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.66)'},
});

const FLAT = StyleSheet.create({
  row: {backgroundColor: '#FBFAFE', borderWidth: 1, borderColor: '#EDEBF7'},
  stat: {backgroundColor: '#F6F5FA'},
  pay: {backgroundColor: '#FFFFFF'},
});
