import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import InnerSurface from './InnerSurface';
import PillButton from './PillButton';
import {CameraIcon} from './icons';
import {C} from './theme';
import type {OngoingWork} from '../types';

/** Current job row: title, amount, date, reporting time, place, Upload Work Proof. Used on Home and in the Ongoing Work detail. */
export default function OngoingWorkItem({work, onUploadProof}: {work: OngoingWork; onUploadProof?: () => void}) {
  return (
    <InnerSurface>
      <View style={styles.titleRow}>
        <Text style={styles.name} numberOfLines={1}>{work.title}</Text>
        <Text style={styles.amount}>{work.amount}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{work.date}</Text>
        <Text style={styles.meta}>{`Reporting Time: ${work.reportingTime}`}</Text>
      </View>
      <Text style={styles.place}>{work.location}</Text>
      <PillButton
        label="Upload Work Proof"
        icon={<CameraIcon />}
        color={C.red}
        pressedColor={C.redPressed}
        onPress={onUploadProof}
        style={styles.button}
      />
    </InnerSurface>
  );
}

const styles = StyleSheet.create({
  titleRow: {flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', columnGap: 10},
  name: {flexShrink: 1, fontSize: 13.5, fontWeight: '500', color: C.ink},
  amount: {fontSize: 13.5, fontWeight: '700', color: C.ink},
  metaRow: {flexDirection: 'row', flexWrap: 'wrap', columnGap: 18, rowGap: 6, marginTop: 10},
  meta: {fontSize: 11, color: C.meta},
  place: {marginTop: 10, fontSize: 12, color: C.ink},
  button: {marginTop: 14},
});
