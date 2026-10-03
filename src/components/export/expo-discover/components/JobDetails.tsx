import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Panel from './Panel';
import InfoChip from './InfoChip';
import StatStrip from './StatStrip';
import DetailRow from './DetailRow';
import IconTile from './IconTile';
import SlotPicker from './SlotPicker';
import GradientFill from './GradientFill';
import {Icon, PATHS, TRADE_ICON} from './icons';
import {C, font, useGlass} from './theme';
import {formatINR, initials} from '../utils/format';
import type {Day, Job, TimeSlot} from '../types';

type Props = {
  job: Job;
  distance: string;
  days: Day[];
  dayIndex: number;
  onDay: (i: number) => void;
  times: TimeSlot[] | null;
  timeIndex: number | null;
  onTime: (i: number) => void;
};

/** Sheet body before booking: summary, description, requirements, client, location, slot picker. */
export default function JobDetails({job, distance, days, dayIndex, onDay, times, timeIndex, onTime}: Props) {
  const glass = useGlass();
  const place = job.area + (job.city ? ', ' + job.city : '');
  return (
    <View>
      <View style={styles.tags}>
        <InfoChip label={job.trade} icon={TRADE_ICON[job.trade]} />
        {job.urgent && <InfoChip label="Urgent" tone="danger" />}
      </View>
      <Text style={styles.title} accessibilityRole="header">{job.title}</Text>
      <Text style={styles.place}>{place} · {distance} away</Text>

      <Panel style={styles.panel}>
        <StatStrip
          items={[
            {value: formatINR(job.pay), label: job.payUnit, accent: true},
            {value: job.duration, label: 'duration'},
            {value: distance, label: 'from you'},
          ]}
        />
      </Panel>

      <Text style={styles.h}>About the job</Text>
      <Text style={styles.desc}>{job.description}</Text>
      <View style={styles.reqs}>
        {job.requirements.map(r => (
          <View key={r} style={[styles.req, {backgroundColor: glass ? C.glassSoft : C.flatSoft}]}>
            <Text style={styles.reqText}>{r}</Text>
          </View>
        ))}
      </View>

      <Panel style={[styles.panel, styles.rows]}>
        <DetailRow
          leading={
            <View style={styles.avatar}>
              <GradientFill colors={[C.violetTop, C.violet]} stops={[0, 1]} radius={18} />
              <Text style={styles.avatarText}>{initials(job.client.name)}</Text>
            </View>
          }
          title={job.client.name}
          subtitle={
            <View style={styles.rating}>
              <Icon d={PATHS.star} size={11} color={C.star} fill />
              <Text style={styles.ratingText}>{job.client.rating.toFixed(1)} · {job.client.jobsPosted} jobs posted</Text>
            </View>
          }
        />
        <DetailRow divider leading={<IconTile d={PATHS.pin} size={36} iconSize={17} />} title={place} subtitle="Exact address shared after the client confirms" />
      </Panel>

      <SlotPicker days={days} dayIndex={dayIndex} onDay={onDay} times={times} timeIndex={timeIndex} onTime={onTime} />
    </View>
  );
}

const styles = StyleSheet.create({
  tags: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  title: {...font('700', 21, C.ink, 26), letterSpacing: -0.4, marginTop: 10},
  place: {...font('400', 12, C.sub), marginTop: 4},
  panel: {marginTop: 14},
  rows: {paddingHorizontal: 14, marginTop: 16},
  h: {...font('700', 13.5, C.ink), marginTop: 18},
  desc: {...font('400', 12.5, C.body, 19), marginTop: 6},
  reqs: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12},
  req: {height: 26, paddingHorizontal: 10, borderRadius: 13, justifyContent: 'center'},
  reqText: font('500', 11, C.body),
  avatar: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  avatarText: font('700', 12.5, C.white),
  rating: {flexDirection: 'row', alignItems: 'center', columnGap: 4},
  ratingText: font('400', 11, C.muted),
});
