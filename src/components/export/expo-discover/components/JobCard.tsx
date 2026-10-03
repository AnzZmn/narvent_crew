import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Panel from './Panel';
import IconTile from './IconTile';
import InfoChip from './InfoChip';
import SoftButton from './SoftButton';
import PrimaryButton from './PrimaryButton';
import {PATHS, TRADE_ICON} from './icons';
import {C, font} from './theme';
import {formatINR} from '../utils/format';
import type {Booking, Job} from '../types';

type Props = {
  job: Job;
  width: number;
  distance: string;
  booking?: Booking;
  onDirections: (job: Job) => void;
  onView: (job: Job) => void;
};

/** Carousel card: trade tile, title, area · distance, pay, schedule chips, Directions / View job. */
function JobCard({job, width, distance, booking, onDirections, onView}: Props) {
  return (
    <Panel blur radius={20} style={[styles.card, {width}]}>
      <View style={styles.top}>
        <IconTile d={TRADE_ICON[job.trade]} />
        <View style={styles.mid}>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.area} numberOfLines={1}>{job.area} · {distance}</Text>
        </View>
        <View style={styles.payBox}>
          <Text style={styles.pay}>{formatINR(job.pay)}</Text>
          <Text style={styles.unit}>{job.payUnit}</Text>
        </View>
      </View>
      <View style={styles.chips}>
        <InfoChip label={job.when} icon={PATHS.clock} />
        {job.urgent && <InfoChip label="Urgent" tone="danger" />}
        {job.slotsNote && <InfoChip label={job.slotsNote} />}
        {booking && <InfoChip label={'Booked · ' + booking.label} tone="solid" icon={PATHS.checkSm} iconViewBox="0 0 12 12" />}
      </View>
      <View style={styles.actions}>
        <SoftButton label="Directions" icon={PATHS.map} onPress={() => onDirections(job)} style={styles.dir} />
        <PrimaryButton label="View job" onPress={() => onView(job)} style={styles.view} />
      </View>
    </Panel>
  );
}

export default memo(JobCard);

const styles = StyleSheet.create({
  card: {padding: 14},
  top: {flexDirection: 'row', alignItems: 'flex-start', columnGap: 12},
  mid: {flex: 1, minWidth: 0},
  title: font('700', 14, C.ink, 18),
  area: {...font('400', 11.5, C.sub), marginTop: 3},
  payBox: {alignItems: 'flex-end'},
  pay: font('700', 16, C.violet),
  unit: {...font('400', 10.5, C.muted), marginTop: 3},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10},
  actions: {flexDirection: 'row', columnGap: 8, marginTop: 12},
  dir: {flex: 1},
  view: {flex: 1.4},
});
