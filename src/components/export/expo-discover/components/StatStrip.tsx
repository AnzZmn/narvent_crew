import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C, font} from './theme';

export type Stat = {value: string; label: string; accent?: boolean};

/** Three equal columns with hairline dividers: pay · duration · distance. */
export default function StatStrip({items}: {items: Stat[]}) {
  return (
    <View style={styles.row}>
      {items.map((s, i) => (
        <View key={s.label} style={[styles.cell, i > 0 && styles.div]}>
          <Text style={s.accent ? styles.accent : styles.value} numberOfLines={1}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', paddingVertical: 12},
  cell: {flex: 1, alignItems: 'center', paddingHorizontal: 4},
  div: {borderLeftWidth: 1, borderLeftColor: 'rgba(14,14,20,0.07)'},
  accent: font('700', 16, C.violet),
  value: font('700', 15, C.ink),
  label: {...font('400', 10.5, C.muted), marginTop: 4},
});
