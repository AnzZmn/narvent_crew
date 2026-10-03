import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {C, font, useGlass} from './theme';
import type {Day} from '../types';

type Props = {day: Day; selected: boolean; onPress: () => void};

/** 56×62 day tile: weekday over date. */
export default function DayPill({day, selected, onPress}: Props) {
  const glass = useGlass();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{selected}}
      accessibilityLabel={day.long}
      style={[styles.pill, selected ? styles.on : glass ? styles.glass : styles.flat]}>
      <Text style={[styles.wk, {color: selected ? 'rgba(255,255,255,0.82)' : C.muted}]}>{day.short}</Text>
      <Text style={[styles.num, {color: selected ? C.white : C.markerInk}]}>{day.dayNum}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {width: 56, height: 62, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', rowGap: 3},
  on: {backgroundColor: C.violet, borderColor: C.violet},
  glass: {backgroundColor: 'rgba(255,255,255,0.72)', borderColor: 'rgba(255,255,255,0.95)'},
  flat: {backgroundColor: C.flatBg, borderColor: C.flatLine},
  wk: font('500', 10.5),
  num: font('700', 17),
});
