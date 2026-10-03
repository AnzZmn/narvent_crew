import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DetailScreen from '../components/DetailScreen';
import Surface from '../components/Surface';
import InnerSurface from '../components/InnerSurface';
import BreakdownList from '../components/BreakdownList';
import PayoutRoute from '../components/PayoutRoute';
import {C, Variant} from '../components/theme';
import {inr} from '../components/money';
import type {PaymentEntry} from '../types';

export type PaymentBreakdownDetailProps = {
  payment: PaymentEntry;
  onBack: () => void;
  variant?: Variant;
};

export default function PaymentBreakdownDetail({payment, onBack, variant}: PaymentBreakdownDetailProps) {
  const b = payment.breakdown;
  return (
    <DetailScreen title="Payment Details" onBack={onBack} variant={variant}>
      <Surface style={styles.hero}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{payment.title}</Text>
          {payment.status && (
            <View style={[styles.badge, BADGE[payment.status]]}>
              <Text style={[styles.badgeText, payment.status === 'pending' && styles.badgeTextTint]}>{payment.status}</Text>
            </View>
          )}
        </View>
        <Text style={styles.meta}>{payment.meta}</Text>
        <Text style={styles.netLabel}>Net Earnings</Text>
        <Text style={styles.net}>{b ? inr(b.net) : payment.amount}</Text>
        {b && (
          <View style={styles.stats}>
            <InnerSurface kind="stat" style={styles.stat}>
              <Text style={styles.statLabel}>Amount Paid</Text>
              <Text style={styles.statValue}>{inr(b.paid)}</Text>
            </InnerSurface>
            <InnerSurface kind="stat" style={styles.stat}>
              <Text style={styles.statLabel}>Pending Amount</Text>
              <Text style={styles.statValue}>{inr(b.pending)}</Text>
            </InnerSurface>
          </View>
        )}
      </Surface>

      {b ? (
        <>
          <Text style={styles.section}>Earnings breakdown</Text>
          <BreakdownList breakdown={b} />
          <PayoutRoute route={b.route} />
        </>
      ) : (
        <Text style={styles.empty}>Breakdown not available for this payment yet.</Text>
      )}
    </DetailScreen>
  );
}

const BADGE = StyleSheet.create({
  paid: {backgroundColor: C.purple},
  pending: {backgroundColor: C.chipBg},
  cancelled: {backgroundColor: C.cancelled},
});

const styles = StyleSheet.create({
  hero: {marginHorizontal: 12, marginTop: 14, padding: 16},
  titleRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 10},
  name: {flexShrink: 1, fontSize: 16, fontWeight: '700', color: C.ink, letterSpacing: -0.16},
  meta: {marginTop: 6, fontSize: 11.5, color: C.meta},
  badge: {paddingVertical: 3, paddingHorizontal: 10, borderRadius: 9},
  badgeText: {fontSize: 10, fontWeight: '500', color: '#FFFFFF'},
  badgeTextTint: {color: C.chipText},
  netLabel: {marginTop: 18, fontSize: 11.5, color: C.grey},
  net: {marginTop: 4, fontSize: 30, fontWeight: '700', color: C.ink, letterSpacing: -0.6},
  stats: {flexDirection: 'row', columnGap: 8, marginTop: 14},
  stat: {flex: 1},
  statLabel: {fontSize: 11, color: C.meta},
  statValue: {marginTop: 6, fontSize: 15, fontWeight: '700', color: C.ink},
  section: {marginTop: 22, marginHorizontal: 16, fontSize: 16, lineHeight: 19, fontWeight: '700', color: C.ink, letterSpacing: -0.16},
  empty: {marginTop: 24, marginHorizontal: 24, fontSize: 12, color: C.meta, textAlign: 'center'},
});
