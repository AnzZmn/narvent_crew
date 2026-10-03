import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {C, useGlass} from './theme';
import type {PaymentEntry} from '../types';

type Props = {payments: PaymentEntry[]; onPressItem?: (p: PaymentEntry) => void};

/** Grouped list: 2px gaps, 10px outer corners, 4px inner corners, optional status badge. */
export default function PaymentList({payments, onPressItem}: Props) {
  const glass = useGlass();
  const last = payments.length - 1;
  return (
    <View style={styles.list}>
      {payments.map((p, i) => (
        <Pressable
          key={p.id}
          onPress={onPressItem ? () => onPressItem(p) : undefined}
          disabled={!onPressItem}
          accessibilityRole={onPressItem ? 'button' : undefined}
          accessibilityLabel={`${p.title}, ${p.amount}, ${p.meta}${p.status ? `, ${p.status}` : ''}`}
          style={[
            styles.row,
            glass ? styles.glass : styles.flat,
            {
              borderTopLeftRadius: i === 0 ? 10 : 4,
              borderTopRightRadius: i === 0 ? 10 : 4,
              borderBottomLeftRadius: i === last ? 10 : 4,
              borderBottomRightRadius: i === last ? 10 : 4,
            },
          ]}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{p.title}</Text>
            <Text style={styles.amount}>{p.amount}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{p.meta}</Text>
            {p.status === 'cancelled' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>cancelled</Text>
              </View>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {marginHorizontal: 12, marginTop: 14, rowGap: 2},
  row: {paddingVertical: 14, paddingHorizontal: 16},
  glass: {backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.66)'},
  flat: {backgroundColor: '#FFFFFF'},
  titleRow: {flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', columnGap: 10},
  name: {flexShrink: 1, fontSize: 13.5, fontWeight: '500', color: C.ink},
  amount: {fontSize: 13.5, fontWeight: '500', color: C.ink},
  metaRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 10, marginTop: 7},
  meta: {fontSize: 11.5, color: C.meta},
  badge: {paddingVertical: 3, paddingHorizontal: 10, borderRadius: 9, backgroundColor: C.cancelled},
  badgeText: {fontSize: 10, fontWeight: '500', color: '#FFFFFF'},
});
