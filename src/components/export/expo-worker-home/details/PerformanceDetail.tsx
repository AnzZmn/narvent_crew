import React from 'react';
import DetailScreen from '../components/DetailScreen';
import PerformanceSummary from '../components/PerformanceSummary';
import ActivityReport from '../components/ActivityReport';
import type {Variant} from '../components/theme';
import type {ActivityNote} from '../types';

export type PerformanceDetailProps = {
  score: number;
  label: string;
  description: string;
  activity: ActivityNote[];
  onBack: () => void;
  variant?: Variant;
};

export default function PerformanceDetail({score, label, description, activity, onBack, variant}: PerformanceDetailProps) {
  return (
    <DetailScreen title="Perfomance score" onBack={onBack} variant={variant}>
      <PerformanceSummary score={score} label={label} description={description} />
      <ActivityReport items={activity} />
    </DetailScreen>
  );
}
