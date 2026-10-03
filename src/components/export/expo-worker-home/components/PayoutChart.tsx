import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C, MONO} from './theme';
import type {DayPayout} from '../types';

type Props = {days: DayPayout[]; /** top of the y-axis in rupees */ max: number};

const PLOT_H = 136;

const inr = (n: number) => `₹${Math.round(n)}`;

/** Day vs payout bars with rotated y-axis title, ₹ ticks and day labels. */
export default function PayoutChart({days, max}: Props) {
  return (
    <View style={styles.wrap} accessibilityLabel={`Daily payouts for ${days.length} days, up to ${inr(max)}`}>
      <View style={styles.axis}>
        <View style={styles.axisTitleBox}>
          <Text style={styles.axisTitle} numberOfLines={1}>Earnings (₹)</Text>
        </View>
        <View style={styles.ticks}>
          <Text style={styles.tick}>{inr(max)}</Text>
          <Text style={styles.tick}>{inr(max / 2)}</Text>
          <Text style={styles.tick}>₹0</Text>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.plot}>
          {days.map(d => {
            const pct = Math.max(0, Math.min(1, d.value / max)) * 100;
            return (
              <View key={d.day} style={[styles.bar, {height: `${pct}%`}]}>
                <View style={styles.cap} />
                <View style={styles.fill} />
              </View>
            );
          })}
        </View>
        <View style={styles.labels}>
          {days.map(d => (
            <Text key={d.day} style={styles.day}>{d.day}</Text>
          ))}
        </View>
        <Text style={styles.days}>Days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {flexDirection: 'row', columnGap: 6, marginTop: 18},
  axis: {flexDirection: 'row', alignItems: 'flex-start', columnGap: 4},
  axisTitleBox: {width: 12, height: PLOT_H, alignItems: 'center', justifyContent: 'center'},
  axisTitle: {width: PLOT_H, textAlign: 'center', fontSize: 8, fontFamily: MONO, color: C.muted, transform: [{rotate: '-90deg'}]},
  ticks: {height: PLOT_H + 5, justifyContent: 'space-between', marginTop: -5},
  tick: {fontSize: 8, fontFamily: MONO, color: C.muted},
  main: {flex: 1, minWidth: 0},
  plot: {
    height: PLOT_H,
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: 2,
    paddingHorizontal: 2,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.divider,
  },
  bar: {flex: 1, minHeight: 5},
  cap: {height: 11, maxHeight: '100%', backgroundColor: C.bar, opacity: 0.85},
  fill: {flex: 1, backgroundColor: C.bar, opacity: 0.32},
  labels: {flexDirection: 'row', columnGap: 2, paddingHorizontal: 3, marginTop: 3},
  day: {flex: 1, textAlign: 'center', fontSize: 8, fontFamily: MONO, color: C.muted},
  days: {marginTop: 6, fontSize: 9, fontFamily: MONO, color: C.muted},
});
