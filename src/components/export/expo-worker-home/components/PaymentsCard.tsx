import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Surface from './Surface';
import InnerSurface from './InnerSurface';
import SectionHeader from './SectionHeader';
import {C, GAP} from './theme';
import type {Payment} from '../types';

type Props = {payments: Payment[]; onExpand?: () => void};

export default function PaymentsCard({payments, onExpand}: Props) {
  return (
    <Surface tone="tint" style={styles.card}>
      <SectionHeader title="Payments" onExpand={onExpand} />
      <Pressable onPress={onExpand} accessibilityRole="button" accessibilityLabel="Open payments" style={styles.list}>
        {payments.map(p => (
          <InnerSurface key={p.id} kind="pay">
            <View style={styles.titleRow}>
              <Text style={styles.name} numberOfLines={1}>{p.title}</Text>
              <Text style={styles.amount}>{p.amount}</Text>
            </View>
            <Text style={styles.meta}>{p.meta}</Text>
          </InnerSurface>
        ))}
      </Pressable>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: GAP, marginTop: GAP, padding: 18},
  list: {marginTop: 10, rowGap: 10},
  titleRow: {flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', columnGap: 10},
  name: {flexShrink: 1, fontSize: 13.5, fontWeight: '500', color: C.ink},
  amount: {fontSize: 13.5, fontWeight: '700', color: C.ink},
  meta: {marginTop: 8, fontSize: 11, color: C.meta},
});
