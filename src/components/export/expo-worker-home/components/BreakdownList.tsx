import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C, useGlass} from './theme';
import {inr} from './money';
import type {PaymentBreakdown} from '../types';

type Row = {key: string; label: string; hint: string; value: number; tone?: 'strong' | 'minus' | 'net'};

const rowsFor = (b: PaymentBreakdown): Row[] => [
  {key: 'gross', label: 'Gross Earnings', hint: 'Total earned before deductions', value: b.gross, tone: 'strong'},
  {key: 'base', label: 'Base Pay / Work Amount', hint: 'Payment for completing the work', value: b.base},
  {key: 'travel', label: 'Travel Allowance (TA)', hint: 'Allowance for travel', value: b.travel},
  {key: 'food', label: 'Food Allowance', hint: 'Meal allowance, if applicable', value: b.food},
  {key: 'other', label: 'Other Allowances', hint: 'Project-specific allowance', value: b.other},
  {key: 'bonus', label: 'Bonus / Incentive', hint: 'Performance, target or special bonus', value: b.bonus},
  {key: 'overtime', label: 'Overtime Pay', hint: 'Extra hours worked', value: b.overtime},
  {key: 'deductions', label: 'Deductions / Cut', hint: 'Amount deducted from earnings', value: b.deductions, tone: 'minus'},
  {key: 'net', label: 'Net Earnings', hint: 'Final amount payable to you', value: b.net, tone: 'net'},
];

/** Same grouped-list treatment as PaymentList: 2px gaps, 10px outer / 4px inner corners. */
export default function BreakdownList({breakdown}: {breakdown: PaymentBreakdown}) {
  const glass = useGlass();
  const rows = rowsFor(breakdown);
  const last = rows.length - 1;
  return (
    <View style={styles.list}>
      {rows.map((r, i) => (
        <View
          key={r.key}
          accessible
          accessibilityLabel={`${r.label}, ${r.tone === 'minus' && r.value ? 'minus ' : ''}${inr(r.value)}`}
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
          <View style={styles.left}>
            <Text style={[styles.label, r.tone && r.tone !== 'minus' && styles.bold]} numberOfLines={1}>{r.label}</Text>
            <Text style={styles.hint} numberOfLines={1}>{r.hint}</Text>
          </View>
          <Text
            style={[
              styles.value,
              r.tone === 'strong' && styles.bold,
              r.tone === 'net' && styles.net,
              r.tone === 'minus' && r.value > 0 && styles.minus,
            ]}>
            {inr(r.value, r.tone === 'minus' && r.value > 0 ? '-' : '')}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {marginHorizontal: 12, marginTop: 10, rowGap: 2},
  row: {flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingVertical: 12, paddingHorizontal: 16},
  glass: {backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.66)'},
  flat: {backgroundColor: '#FFFFFF'},
  left: {flex: 1, minWidth: 0},
  label: {fontSize: 13.5, fontWeight: '500', color: C.ink},
  hint: {marginTop: 4, fontSize: 11, color: C.meta},
  value: {fontSize: 13.5, fontWeight: '500', color: C.ink},
  bold: {fontWeight: '700'},
  net: {fontWeight: '700', color: C.purple},
  minus: {color: C.red},
});
