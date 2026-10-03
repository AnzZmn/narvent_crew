import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Surface from './Surface';
import SectionHeader from './SectionHeader';
import CompletedWorkItem from './CompletedWorkItem';
import {GAP} from './theme';
import type {CompletedWork} from '../types';

type Props = {work: CompletedWork; onExpand?: () => void};

export default function CompletedWorksCard({work, onExpand}: Props) {
  return (
    <Surface style={styles.card}>
      <SectionHeader title="Completed Works Data" onExpand={onExpand} />
      <Pressable onPress={onExpand} accessibilityRole="button" accessibilityLabel={`${work.title}, ${work.amount}`} style={styles.item}>
        <CompletedWorkItem work={work} bold />
      </Pressable>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: GAP, marginTop: GAP, padding: 18},
  item: {marginTop: 10},
});
