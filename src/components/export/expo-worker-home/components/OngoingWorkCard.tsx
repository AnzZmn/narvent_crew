import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Surface from './Surface';
import SectionHeader from './SectionHeader';
import OngoingWorkItem from './OngoingWorkItem';
import {GAP} from './theme';
import type {OngoingWork} from '../types';

type Props = {work: OngoingWork; onExpand?: () => void; onUploadProof?: () => void};

export default function OngoingWorkCard({work, onExpand, onUploadProof}: Props) {
  return (
    <Surface style={styles.card}>
      <SectionHeader title="Ongoing Work" onExpand={onExpand} />
      <Pressable onPress={onExpand} accessibilityRole="button" accessibilityLabel={`${work.title}, ${work.amount}`} style={styles.item}>
        <OngoingWorkItem work={work} onUploadProof={onUploadProof} />
      </Pressable>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: GAP, marginTop: GAP, padding: 18},
  item: {marginTop: 10},
});
