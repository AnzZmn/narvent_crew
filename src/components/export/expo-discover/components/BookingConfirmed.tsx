import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Panel from './Panel';
import SoftButton from './SoftButton';
import PrimaryButton from './PrimaryButton';
import GradientFill from './GradientFill';
import {Icon, PATHS} from './icons';
import {C, font} from './theme';
import {formatINR} from '../utils/format';
import type {Booking, Job} from '../types';

type Props = {job: Job; booking: Booking; onChange: () => void; onDone: () => void};

/** Sheet body after booking: check, message, summary rows, Change slot / Done. */
export default function BookingConfirmed({job, booking, onChange, onDone}: Props) {
  const rows: [string, string, boolean?][] = [
    ['Job', job.title],
    ['When', booking.label],
    ['Pay', formatINR(job.pay) + ' ' + job.payUnit, true],
  ];
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.check}>
          <GradientFill colors={[C.violetTop, C.violet]} stops={[0, 1]} radius={34} />
          <Icon d={PATHS.check} size={30} color={C.white} strokeWidth={2.6} />
        </View>
        <Text style={styles.title} accessibilityRole="header">Slot booked</Text>
        <Text style={styles.msg}>{job.client.name} will confirm within 30 minutes. You’ll get the exact address once they do.</Text>
      </View>
      <Panel style={styles.panel}>
        {rows.map(([k, v, accent], i) => (
          <View key={k} style={[styles.row, i < rows.length - 1 && styles.div]}>
            <Text style={styles.k}>{k}</Text>
            <Text style={accent ? styles.vAccent : styles.v} numberOfLines={2}>{v}</Text>
          </View>
        ))}
      </Panel>
      <View style={styles.actions}>
        <SoftButton label="Change slot" onPress={onChange} height={46} style={styles.a1} />
        <PrimaryButton label="Done" onPress={onDone} height={46} style={styles.a2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {alignItems: 'center', paddingTop: 14, paddingHorizontal: 4},
  check: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: C.violet,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: {width: 0, height: 14},
  },
  title: {...font('700', 20, C.ink), letterSpacing: -0.4, marginTop: 16},
  msg: {...font('400', 12.5, C.sub, 19), textAlign: 'center', marginTop: 6, maxWidth: 280},
  panel: {marginTop: 18, paddingHorizontal: 14, paddingVertical: 2},
  row: {flexDirection: 'row', justifyContent: 'space-between', columnGap: 12, paddingVertical: 12},
  div: {borderBottomWidth: 1, borderBottomColor: C.hair},
  k: font('400', 12, C.muted),
  v: {...font('500', 12.5, C.ink), flexShrink: 1, textAlign: 'right'},
  vAccent: {...font('700', 12.5, C.violet), textAlign: 'right'},
  actions: {flexDirection: 'row', columnGap: 8, marginTop: 16},
  a1: {flex: 1},
  a2: {flex: 1.4},
});
