import React from 'react';
import {ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import PerformanceCard from './PerformanceCard';
import EarningsCard from './EarningsCard';
import RatingCard from './RatingCard';
import {GAP} from './theme';
import type {WorkerHomeData} from '../types';

type Props = {
  data: WorkerHomeData;
  onOpenPerformance?: () => void;
  onOpenEarnings?: () => void;
  onOpenRating?: () => void;
};

const TILE_GAP = 9;

/** Sideways-scrolling summary tiles; snaps one tile at a time. */
export default function SummaryRow({data, onOpenPerformance, onOpenEarnings, onOpenRating}: Props) {
  const {width: screenW} = useWindowDimensions();
  const w = Math.min(screenW * 0.497, 179);
  const h = (w * 155) / 179;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={w + TILE_GAP}
      decelerationRate="fast"
      contentContainerStyle={styles.row}>
      <PerformanceCard width={w} height={h} score={data.performance.score} label={data.performance.label} onPress={onOpenPerformance} />
      <EarningsCard width={w} height={h} monthTotal={data.earnings.monthTotal} bars={data.earnings.bars} onPress={onOpenEarnings} />
      <RatingCard width={w} height={h} rating={data.rating.value} subtitle={data.rating.subtitle} onPress={onOpenRating} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {paddingHorizontal: GAP, paddingTop: 14, paddingBottom: 12, columnGap: TILE_GAP},
});
