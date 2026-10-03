import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DetailScreen from '../components/DetailScreen';
import Surface from '../components/Surface';
import OngoingWorkItem from '../components/OngoingWorkItem';
import LocationMap from '../components/LocationMap';
import PillButton from '../components/PillButton';
import {C, Variant} from '../components/theme';
import type {OngoingWork} from '../types';

export type OngoingWorkDetailProps = {
  work: OngoingWork;
  onBack: () => void;
  onUploadProof?: () => void;
  onCurrentLocation?: () => void;
  onSubmit?: () => void;
  /** real map to show instead of the placeholder */
  map?: React.ReactNode;
  variant?: Variant;
};

export default function OngoingWorkDetail({work, onBack, onUploadProof, onCurrentLocation, onSubmit, map, variant}: OngoingWorkDetailProps) {
  return (
    <DetailScreen title="Ongoing Work" onBack={onBack} variant={variant}>
      <Surface style={styles.card}>
        <OngoingWorkItem work={work} onUploadProof={onUploadProof} />
        <Text style={styles.label}>Current location</Text>
        <View style={styles.map}>
          <LocationMap onCurrentLocation={onCurrentLocation} map={map} />
        </View>
        <View style={styles.actions}>
          <PillButton label="Submit" height={40} fontSize={14} onPress={onSubmit ?? onBack} style={styles.submit} />
        </View>
      </Surface>
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 12, marginTop: 14, padding: 16},
  label: {marginTop: 18, fontSize: 13.5, color: C.ink},
  map: {marginTop: 10},
  actions: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16},
  submit: {minWidth: 96},
});
