import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SummaryTile from './SummaryTile';
import PerformanceGauge from './PerformanceGauge';
import {C} from './theme';

type Props = {width: number; height: number; score: number; label: string; onPress?: () => void};

const dotColor = (s: number) => (s < 40 ? '#FF0000' : s < 70 ? C.star : '#00FF40');

export default function PerformanceCard({width, height, score, label, onPress}: Props) {
  const gauge = Math.min(74, (width - 32) * 0.88);
  return (
    <SummaryTile width={width} height={height} onPress={onPress} accessibilityLabel={`Performance score ${score}%, ${label}`}>
      <View style={styles.top}>
        <Text style={styles.title}>Perfomance score</Text>
        <View style={[styles.dot, {backgroundColor: dotColor(score)}]} />
      </View>
      <Text style={styles.sub}>{label}</Text>
      <View style={styles.gaugeArea}>
        <View style={[styles.gauge, {marginLeft: -gauge / 2}]}>
          <PerformanceGauge size={gauge} value={score / 100} />
        </View>
      </View>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{`${score}%`}</Text>
      </View>
    </SummaryTile>
  );
}

const styles = StyleSheet.create({
  top: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', columnGap: 8},
  title: {flex: 1, fontSize: 13, lineHeight: 16, fontWeight: '700', color: C.ink2, letterSpacing: -0.13},
  dot: {width: 9, height: 9, borderRadius: 4.5, marginTop: 2},
  sub: {marginTop: 5, fontSize: 10.5, color: C.grey},
  gaugeArea: {flex: 1, minHeight: 0},
  gauge: {position: 'absolute', left: '50%', bottom: -13},
  pill: {alignSelf: 'center', paddingVertical: 3, paddingHorizontal: 13, borderRadius: 6, backgroundColor: 'rgba(242,239,255,0.8)'},
  pillText: {fontSize: 9.5, color: C.body},
});
