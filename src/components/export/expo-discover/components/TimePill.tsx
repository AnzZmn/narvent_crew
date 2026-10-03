import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {C, font, useGlass} from './theme';
import type {TimeSlot} from '../types';

type Props = {slot: TimeSlot; selected: boolean; onPress: () => void};

/** Start-time tile. Full slots are dimmed, struck through and not pressable. */
export default function TimePill({slot, selected, onPress}: Props) {
  const glass = useGlass();
  return (
    <Pressable
      onPress={slot.full ? undefined : onPress}
      disabled={slot.full}
      accessibilityRole="radio"
      accessibilityState={{selected, disabled: slot.full}}
      accessibilityLabel={slot.time + (slot.full ? ', full' : '')}
      style={[styles.pill, selected ? styles.on : glass ? styles.glass : styles.flat, slot.full && styles.full]}>
      <Text style={[styles.time, {color: selected ? C.white : C.markerInk}, slot.full && styles.strike]}>{slot.time}</Text>
      <Text style={[styles.state, {color: selected ? 'rgba(255,255,255,0.82)' : C.muted}]}>{slot.full ? 'Full' : 'Open'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {flexBasis: '30%', flexGrow: 1, height: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', rowGap: 2},
  on: {backgroundColor: C.violet, borderColor: C.violet},
  glass: {backgroundColor: 'rgba(255,255,255,0.72)', borderColor: 'rgba(255,255,255,0.95)'},
  flat: {backgroundColor: C.flatBg, borderColor: C.flatLine},
  full: {opacity: 0.45},
  time: font('600', 12.5),
  strike: {textDecorationLine: 'line-through'},
  state: font('400', 9.5),
});
