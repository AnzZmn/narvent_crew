import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
import DayPill from './DayPill';
import TimePill from './TimePill';
import {C, font} from './theme';
import type {Day, TimeSlot} from '../types';

type Props = {
  days: Day[];
  dayIndex: number;
  onDay: (i: number) => void;
  times: TimeSlot[] | null;
  timeIndex: number | null;
  onTime: (i: number) => void;
};

/** "Choose a day" strip + "Choose a start time" 3-column grid. `times === null` shows a spinner. */
export default function SlotPicker({days, dayIndex, onDay, times, timeIndex, onTime}: Props) {
  const noneOpen = !!times && times.every(t => t.full);
  return (
    <View>
      <View style={styles.headRow}>
        <Text style={styles.h}>Choose a day</Text>
        <Text style={styles.hint}>{days[dayIndex]?.long}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.days} accessibilityRole="radiogroup">
        {days.map((d, i) => (
          <DayPill key={d.key} day={d} selected={i === dayIndex} onPress={() => onDay(i)} />
        ))}
      </ScrollView>
      <Text style={[styles.h, styles.timeHead]}>Choose a start time</Text>
      {times === null ? (
        <View style={styles.loading}><ActivityIndicator color={C.violet} /></View>
      ) : noneOpen ? (
        <Text style={styles.empty}>No open slots on this day. Try another day.</Text>
      ) : (
        <View style={styles.grid} accessibilityRole="radiogroup">
          {times.map((t, i) => (
            <TimePill key={t.time} slot={t} selected={i === timeIndex} onPress={() => onTime(i)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: {flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 20},
  h: font('700', 13.5, C.ink),
  hint: font('400', 11, C.muted),
  bleed: {marginHorizontal: -18, marginTop: 8},
  days: {paddingHorizontal: 18, columnGap: 8},
  timeHead: {marginTop: 18},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8},
  loading: {height: 104, alignItems: 'center', justifyContent: 'center'},
  empty: {...font('400', 12, C.muted, 18), marginTop: 10},
});
