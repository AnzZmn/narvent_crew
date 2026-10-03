import React, {memo, useEffect, useState} from 'react';
import {Marker} from 'react-native-maps';
import PriceMarker from './PriceMarker';
import {TRADE_ICON} from './icons';
import {formatINR} from '../utils/format';
import type {Job} from '../types';

type Props = {job: Job; selected: boolean; onPress: (job: Job) => void};

/**
 * Custom-view marker. `tracksViewChanges` is on only briefly after the
 * selected state changes — leaving it on for every marker is the #1 cause
 * of janky maps on Android.
 */
function JobMarker({job, selected, onPress}: Props) {
  const [track, setTrack] = useState(true);
  useEffect(() => {
    setTrack(true);
    const t = setTimeout(() => setTrack(false), 600);
    return () => clearTimeout(t);
  }, [selected]);

  return (
    <Marker
      identifier={job.id}
      coordinate={job.coordinate}
      anchor={{x: 0.5, y: 1}}
      zIndex={selected ? 10 : 1}
      tracksViewChanges={track}
      onPress={e => {
        e.stopPropagation?.();
        onPress(job);
      }}
      accessibilityLabel={job.title + ', ' + formatINR(job.pay)}>
      <PriceMarker label={formatINR(job.pay)} icon={TRADE_ICON[job.trade]} selected={selected} urgent={job.urgent} />
    </Marker>
  );
}

export default memo(JobMarker);
