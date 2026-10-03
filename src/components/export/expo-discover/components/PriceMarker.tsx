import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from './icons';
import {C, font} from './theme';

type Props = {label: string; icon: string; selected: boolean; urgent?: boolean};

/**
 * Price bubble with a tail. The marker's anchor is bottom-centre, so the tail
 * tip sits on the job's coordinate. Selected = solid violet and slightly larger.
 * Extra padding leaves room for the shadow (Android snapshots clip otherwise).
 */
export default function PriceMarker({label, icon, selected, urgent}: Props) {
  const bg = selected ? C.violet : C.white;
  const bd = selected ? C.violet : 'rgba(125,59,255,0.2)';
  return (
    <View style={[styles.wrap, selected && styles.big]} collapsable={false}>
      <View style={[styles.bubble, {backgroundColor: bg, borderColor: bd}]}>
        <View style={[styles.dot, {backgroundColor: selected ? 'rgba(255,255,255,0.22)' : C.tile}]}>
          <Icon d={icon} size={12} strokeWidth={2.2} color={selected ? C.white : C.violet} />
        </View>
        <Text style={[styles.price, {color: selected ? C.white : C.markerInk}]}>{label}</Text>
        {urgent && <View style={styles.urgent} />}
      </View>
      <View style={[styles.tail, {backgroundColor: bg, borderColor: bd}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', padding: 6, paddingBottom: 4},
  big: {transform: [{scale: 1.12}]},
  bubble: {
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    shadowColor: '#3C288C',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 5},
    elevation: 4,
  },
  dot: {width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  price: font('700', 12),
  urgent: {position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: 5, backgroundColor: C.danger, borderWidth: 2, borderColor: C.white},
  tail: {width: 9, height: 9, marginTop: -5.5, transform: [{rotate: '45deg'}], borderRightWidth: 1, borderBottomWidth: 1, elevation: 4},
});
