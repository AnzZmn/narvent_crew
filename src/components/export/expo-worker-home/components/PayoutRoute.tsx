import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Surface from './Surface';
import {C} from './theme';
import {inr} from './money';
import type {PaymentBreakdown, PayoutStatus} from '../types';

type StepState = 'done' | 'current' | 'upcoming' | 'stopped';
type Step = {key: string; title: string; state: StepState; lines: [string, string][]};

const STATUS_LABEL: Record<PayoutStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  paid: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

function stepsFor(r: PaymentBreakdown['route']): Step[] {
  const paid = r.payoutStatus === 'paid';
  const stopped = r.payoutStatus === 'failed' || r.payoutStatus === 'cancelled';
  const payoutState: StepState = paid ? 'done' : stopped ? 'stopped' : r.clientReceived ? 'current' : 'upcoming';
  return [
    {
      key: 'client',
      title: 'Client',
      state: r.clientReceived ? 'done' : stopped ? 'stopped' : 'current',
      lines: [
        ['Client Payment', inr(r.clientPayment)],
        ['Received from Client', r.clientReceived ? '✓ Received' : 'Awaiting'],
        ['Client Payment Date', r.clientPaymentDate ?? '—'],
      ],
    },
    {
      key: 'narvent',
      title: 'Narvent',
      state: r.clientReceived ? 'done' : 'upcoming',
      lines: [
        ['Worker Earnings', inr(r.workerEarnings)],
        ['Narvent Adjustment / Fee', inr(r.narventFee)],
      ],
    },
    {
      key: 'payout',
      title: 'Payout',
      state: payoutState,
      lines: [
        ['Payout Status', STATUS_LABEL[r.payoutStatus]],
        ['Expected Payout Date', r.expectedPayoutDate ?? '—'],
        ['Payout Method', r.payoutMethod],
        ['Payout Reference', r.payoutReference ?? '—'],
      ],
    },
    {
      key: 'you',
      title: 'You',
      state: paid ? 'done' : 'upcoming',
      lines: [
        ['Amount Received', r.amountReceived != null ? inr(r.amountReceived) : '—'],
        ['Actual Payout Date', r.actualPayoutDate ?? '—'],
      ],
    },
  ];
}

/** Client → Narvent → Payout → You, as a vertical route with a state dot per stop. */
export default function PayoutRoute({route}: {route: PaymentBreakdown['route']}) {
  const steps = stepsFor(route);
  const last = steps.length - 1;
  return (
    <Surface style={styles.card}>
      <Text style={styles.heading}>Payment route</Text>
      <View style={styles.steps}>
        {steps.map((s, i) => (
          <View key={s.key} style={styles.step}>
            <View style={styles.rail}>
              <View style={[styles.dot, DOT[s.state]]}>{s.state === 'done' && <View style={styles.dotCore} />}</View>
              {i < last && <View style={[styles.line, s.state === 'done' ? styles.lineDone : styles.lineIdle]} />}
            </View>
            <View style={[styles.body, i < last && styles.bodyGap]}>
              <View style={styles.titleRow}>
                <Text style={[styles.stepTitle, s.state === 'upcoming' && styles.dim]}>{s.title}</Text>
                {s.state === 'current' && <Text style={styles.chip}>In progress</Text>}
                {s.state === 'stopped' && <Text style={[styles.chip, styles.chipStop]}>{STATUS_LABEL[route.payoutStatus]}</Text>}
              </View>
              {s.lines.map(([k, v]) => (
                <View key={k} style={styles.kv}>
                  <Text style={styles.k} numberOfLines={1}>{k}</Text>
                  <Text style={[styles.v, v === '—' && styles.dim, v.startsWith('✓') && styles.ok]} numberOfLines={1}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </Surface>
  );
}

const DOT = StyleSheet.create({
  done: {borderColor: C.purple, backgroundColor: C.purple},
  current: {borderColor: C.purple, backgroundColor: '#FFFFFF'},
  upcoming: {borderColor: C.faint, backgroundColor: 'transparent'},
  stopped: {borderColor: C.cancelled, backgroundColor: C.cancelled},
});

const styles = StyleSheet.create({
  card: {marginHorizontal: 12, marginTop: 14, padding: 16},
  heading: {fontSize: 16, lineHeight: 19, fontWeight: '700', color: C.ink, letterSpacing: -0.16},
  steps: {marginTop: 16},
  step: {flexDirection: 'row', columnGap: 12},
  rail: {width: 14, alignItems: 'center'},
  dot: {width: 14, height: 14, borderRadius: 7, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 2},
  dotCore: {width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFFFFF'},
  line: {flex: 1, width: 2, marginVertical: 4, borderRadius: 1},
  lineDone: {backgroundColor: C.purple},
  lineIdle: {backgroundColor: C.divider},
  body: {flex: 1, minWidth: 0},
  bodyGap: {paddingBottom: 18},
  titleRow: {flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 6},
  stepTitle: {fontSize: 13.5, fontWeight: '600', color: C.ink},
  chip: {fontSize: 10, fontWeight: '500', color: C.chipText, backgroundColor: C.chipBg, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 9, overflow: 'hidden'},
  chipStop: {color: '#FFFFFF', backgroundColor: C.cancelled},
  kv: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', columnGap: 10, paddingVertical: 3},
  k: {flexShrink: 1, fontSize: 11.5, color: C.meta},
  v: {fontSize: 12, fontWeight: '500', color: C.ink},
  dim: {color: C.faint},
  ok: {color: C.purple},
});
