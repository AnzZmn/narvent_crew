import React from 'react';
import {StyleSheet} from 'react-native';
import DetailScreen from '../components/DetailScreen';
import Surface from '../components/Surface';
import CompletedWorkItem from '../components/CompletedWorkItem';
import type {Variant} from '../components/theme';
import type {CompletedWork} from '../types';

export type CompletedWorksDetailProps = {works: CompletedWork[]; onBack: () => void; variant?: Variant};

export default function CompletedWorksDetail({works, onBack, variant}: CompletedWorksDetailProps) {
  return (
    <DetailScreen title="Completed Works" onBack={onBack} variant={variant}>
      <Surface style={styles.card}>
        {works.map(w => (
          <CompletedWorkItem key={w.id} work={w} />
        ))}
      </Surface>
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 12, marginTop: 14, padding: 14, rowGap: 10},
});
