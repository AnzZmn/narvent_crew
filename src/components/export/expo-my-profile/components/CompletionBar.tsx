import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {P, useGlass} from './theme';

/** "Work completion (in %)" box with the 12px violet progress track. */
export default function CompletionBar({percent}: {percent: number}) {
  const glass = useGlass();
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <View style={[styles.box, glass ? styles.glass : styles.flat]} accessible accessibilityRole="progressbar" accessibilityLabel="Work completion" accessibilityValue={{min: 0, max: 100, now: pct}}>
      <Text style={styles.label}>Work completion (in %)</Text>
      <View style={styles.track}>
        <View style={[styles.fill, {width: `${pct}%`}]} />
        <Text style={styles.value}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {alignSelf: 'stretch', marginTop: 10, borderRadius: 9, paddingVertical: 6, paddingHorizontal: 8},
  glass: {backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)'},
  flat: {backgroundColor: '#FFFFFF'},
  label: {fontSize: 8, color: P.label},
  track: {marginTop: 4, height: 12, borderRadius: 6, backgroundColor: P.track, overflow: 'hidden', justifyContent: 'center'},
  fill: {position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: P.violetSoft},
  value: {textAlign: 'center', fontSize: 7.5, fontWeight: '500', color: '#FFFFFF'},
});
