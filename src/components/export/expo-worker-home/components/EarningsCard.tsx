import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SummaryTile from './SummaryTile';
import {C} from './theme';

type Props = {
  width: number;
  height: number;
  monthTotal: string;
  /** 0–100 per bar, oldest first */
  bars: number[];
  onPress?: () => void;
};

export default function EarningsCard({width, height, monthTotal, bars, onPress}: Props) {
  return (
    <SummaryTile
      width={width}
      height={height}
      gradient={{to: '#BBB1FF', angleStop: 0.46}}
      onPress={onPress}
      accessibilityLabel={`Earnings, this month ${monthTotal}`}>
      <Text style={styles.title}>Earnings</Text>
      <View style={styles.row}>
        <Text style={styles.meta}>This month</Text>
        <Text style={styles.meta}>{monthTotal}</Text>
      </View>
      <View style={styles.chart}>
        {bars.map((h, i) => (
          <View key={i} style={styles.col}>
            <View style={styles.cap} />
            <View style={[styles.bar, {height: `${Math.max(0, Math.min(100, h)) * 0.9}%`}]} />
          </View>
        ))}
      </View>
    </SummaryTile>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 13, lineHeight: 16, fontWeight: '700', color: C.ink2, letterSpacing: -0.13},
  row: {marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', columnGap: 8},
  meta: {fontSize: 10, color: C.body},
  chart: {flex: 1, minHeight: 0, flexDirection: 'row', alignItems: 'flex-end', columnGap: 1.14, marginTop: 8, paddingBottom: 5},
  col: {flex: 1, height: '100%', justifyContent: 'flex-end', rowGap: 1},
  cap: {height: '6%', backgroundColor: C.bar, opacity: 0.64},
  bar: {backgroundColor: C.bar, opacity: 0.24},
});
