import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Surface from './Surface';
import {C, MONO, useGlass} from './theme';
import type {ActivityNote} from '../types';

type Props = {items: ActivityNote[]; /** Day vs Payout uses short labels with a taller row */ compact?: boolean};

export default function ActivityReport({items, compact}: Props) {
  const glass = useGlass();
  return (
    <Surface radius={16} style={styles.card}>
      <Text style={styles.title}>Activity Report</Text>
      <View style={styles.list}>
        {items.map(n => (
          <View key={n.id} style={[styles.note, glass ? styles.glass : styles.flat, compact && styles.compact]}>
            <Text style={styles.text}>{n.text}</Text>
            <Text style={[styles.date, compact && styles.dateCompact]}>{n.date}</Text>
          </View>
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 12, marginTop: 14, paddingVertical: 18, paddingHorizontal: 16},
  title: {fontSize: 17, lineHeight: 20, fontWeight: '700', color: C.ink, letterSpacing: -0.17},
  list: {marginTop: 14, rowGap: 10},
  note: {borderRadius: 10, paddingVertical: 12, paddingHorizontal: 13},
  glass: {backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.62)'},
  flat: {backgroundColor: '#FBFAFE', borderWidth: 1, borderColor: C.line},
  compact: {minHeight: 58, justifyContent: 'space-between'},
  text: {fontSize: 10.5, lineHeight: 16, color: C.muted},
  date: {marginTop: 8, textAlign: 'right', fontSize: 9, fontFamily: MONO, color: C.faint},
  dateCompact: {marginTop: 10},
});
