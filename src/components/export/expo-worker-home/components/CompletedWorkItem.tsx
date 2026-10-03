import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import InnerSurface from './InnerSurface';
import {CarIcon, CashIcon, ClockIcon} from './icons';
import {C} from './theme';
import type {CompletedWork} from '../types';

function Meta({icon, text}: {icon: React.ReactNode; text: string}) {
  return (
    <View style={styles.metaItem}>
      {icon}
      <Text style={styles.metaText} numberOfLines={2}>{text}</Text>
    </View>
  );
}

/** Completed job row with place, hours, incentive and travel allowance. `bold` = Home card weight. */
export default function CompletedWorkItem({work, bold = false}: {work: CompletedWork; bold?: boolean}) {
  return (
    <InnerSurface>
      <View style={styles.titleRow}>
        <Text style={styles.name} numberOfLines={1}>{work.title}</Text>
        <Text style={[styles.amount, bold && styles.amountBold]}>{work.amount}</Text>
      </View>
      <Text style={[styles.date, !bold && styles.dateLarge]}>{work.date}</Text>
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <View style={styles.metaItem}>
            <Text style={styles.place}>{work.location}</Text>
          </View>
          <Meta icon={<ClockIcon />} text={`Working hours: ${work.hours}`} />
        </View>
        <View style={styles.gridRow}>
          <Meta icon={<CashIcon />} text={`Incentive : ${work.incentive}`} />
          <Meta icon={<CarIcon />} text={`Travel allowance : ${work.travel}`} />
        </View>
      </View>
    </InnerSurface>
  );
}

const styles = StyleSheet.create({
  titleRow: {flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', columnGap: 10},
  name: {flexShrink: 1, fontSize: 13.5, fontWeight: '500', color: C.ink},
  amount: {fontSize: 13.5, fontWeight: '500', color: C.ink},
  amountBold: {fontWeight: '700'},
  date: {marginTop: 8, fontSize: 11, color: C.meta},
  dateLarge: {marginTop: 7, fontSize: 11.5},
  grid: {marginTop: 14, rowGap: 8},
  gridRow: {flexDirection: 'row', columnGap: 12},
  metaItem: {flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', columnGap: 6},
  place: {fontSize: 11, color: C.ink},
  metaText: {flexShrink: 1, fontSize: 11, color: C.meta},
});
