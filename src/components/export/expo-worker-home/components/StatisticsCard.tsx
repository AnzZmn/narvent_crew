import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Surface from './Surface';
import InnerSurface from './InnerSurface';
import SectionHeader from './SectionHeader';
import {C, GAP} from './theme';
import type {Stat} from '../types';

/** Two-column grid of four stats. */
export default function StatisticsCard({stats}: {stats: Stat[]}) {
  const rows: Stat[][] = [];
  for (let i = 0; i < stats.length; i += 2) rows.push(stats.slice(i, i + 2));
  return (
    <Surface style={styles.card}>
      <SectionHeader title="Statistics" />
      <View style={styles.grid}>
        {rows.map((row, r) => (
          <View key={r} style={styles.gridRow}>
            {row.map(s => (
              <InnerSurface key={s.label} kind="stat" style={styles.cell}>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{s.value}</Text>
                <Text style={styles.label}>{s.label}</Text>
              </InnerSurface>
            ))}
            {row.length === 1 && <View style={styles.cell} />}
          </View>
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: GAP, marginTop: GAP, padding: 18},
  grid: {marginTop: 14, rowGap: 10},
  gridRow: {flexDirection: 'row', columnGap: 10},
  cell: {flex: 1, minWidth: 0},
  value: {fontSize: 15, lineHeight: 19, fontWeight: '700', color: C.ink},
  label: {marginTop: 4, fontSize: 11, color: C.muted},
});
