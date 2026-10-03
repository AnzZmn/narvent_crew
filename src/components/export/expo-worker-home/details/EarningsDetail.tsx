import React from 'react';
import {StyleSheet, View} from 'react-native';
import DetailScreen from '../components/DetailScreen';
import Surface from '../components/Surface';
import TotalEarnings from '../components/TotalEarnings';
import MonthPicker from '../components/MonthPicker';
import PayoutChart from '../components/PayoutChart';
import ActivityReport from '../components/ActivityReport';
import {C, Variant} from '../components/theme';
import type {WorkerDetailsData} from '../types';

export type EarningsDetailProps = {
  earnings: WorkerDetailsData['earnings'];
  onBack: () => void;
  onMonthPress?: () => void;
  variant?: Variant;
};

/** "Day vs Payout": total, month chip, daily bar chart, activity report. */
export default function EarningsDetail({earnings, onBack, onMonthPress, variant}: EarningsDetailProps) {
  return (
    <DetailScreen title="Day vs Payout" onBack={onBack} variant={variant}>
      <Surface radius={16} style={styles.card}>
        <TotalEarnings total={earnings.total} />
        <View style={styles.divider} />
        <MonthPicker month={earnings.month} onPress={onMonthPress} />
        <PayoutChart days={earnings.days} max={earnings.max} />
      </Surface>
      <ActivityReport items={earnings.activity} compact />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 12, marginTop: 12, paddingTop: 22, paddingHorizontal: 16, paddingBottom: 16},
  divider: {height: 1, marginTop: 24, marginHorizontal: 18, backgroundColor: C.divider},
});
