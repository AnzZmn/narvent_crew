import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Surface from './Surface';
import PerformanceGauge from './PerformanceGauge';
import {C} from './theme';

type Props = {score: number; label: string; description: string};

const badgeColor = (s: number) => (s < 40 ? C.cancelled : s < 70 ? C.lime : '#3DDC6B');

/** Big gauge card on the Performance detail. */
export default function PerformanceSummary({score, label, description}: Props) {
  const {width} = useWindowDimensions();
  const inner = width - 24 - 40;
  const gauge = Math.min(188, inner * 0.72);
  return (
    <Surface radius={16} style={styles.card}>
      <View style={[styles.badge, {backgroundColor: badgeColor(score)}]}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
      <View style={styles.gauge} accessibilityLabel={`Performance meter at ${score}%`}>
        <PerformanceGauge size={gauge} value={score / 100} />
      </View>
      <View style={styles.score}>
        <Text style={styles.scoreText}>{`${score}%`}</Text>
      </View>
      <Text style={styles.desc}>{description}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 12, marginTop: 12, paddingTop: 26, paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center'},
  badge: {paddingVertical: 6, paddingHorizontal: 20, borderRadius: 15},
  badgeText: {fontSize: 14, fontWeight: '700', color: C.ink2},
  gauge: {marginTop: 26},
  score: {marginTop: 14, paddingVertical: 9, paddingHorizontal: 26, borderRadius: 16, backgroundColor: 'rgba(242,239,255,0.85)'},
  scoreText: {fontSize: 19, fontWeight: '700', color: C.ink2},
  desc: {marginTop: 16, maxWidth: 280, textAlign: 'center', fontSize: 11.5, lineHeight: 19, color: C.muted},
});
