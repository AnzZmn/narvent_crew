import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import TradeChip from './TradeChip';
import type {Job, Trade} from '../types';

export type TradeFilter = 'All' | Trade;
export const TRADE_FILTERS: TradeFilter[] = ['All', 'Electrical', 'Plumbing', 'Carpentry', 'Painting', 'Helper'];

type Props = {jobs: Job[]; value: TradeFilter; onChange: (t: TradeFilter) => void; hideEmpty?: boolean};

/** Horizontal chip row. Counts come from the full job list, not the filtered one. */
export default function TradeChips({jobs, value, onChange, hideEmpty = false}: Props) {
  const items = TRADE_FILTERS.map(t => ({t, n: t === 'All' ? jobs.length : jobs.filter(j => j.trade === t).length})).filter(
    x => !hideEmpty || x.t === 'All' || x.n > 0,
  );
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} accessibilityRole="radiogroup">
      {items.map(({t, n}) => (
        <TradeChip key={t} label={t} count={n} active={t === value} onPress={() => onChange(t)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {paddingHorizontal: 14, paddingBottom: 10, columnGap: 6},
});
