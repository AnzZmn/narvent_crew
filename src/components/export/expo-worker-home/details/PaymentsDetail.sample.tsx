import React from 'react';
import {Alert} from 'react-native';
import PaymentsDetail, {PaymentsDetailProps} from './PaymentsDetail';
import {buildBreakdown, PaymentEntry} from '../types';

/** `meta` is the secondary line (date or location). `status` omitted = paid. */
export const samplePayments: PaymentEntry[] = [
  {id: 'p1', title: 'Painting Work', amount: '₹ 700', meta: 'March 15', status: 'paid',
    breakdown: buildBreakdown({base: 500, travel: 100, food: 50, bonus: 50, paid: 700, fee: 30, status: 'paid', clientDate: '15 Mar 2026', expected: '18 Mar 2026', actual: '18 Mar 2026', ref: 'NRT-3C71D'})},
  {id: 'p2', title: 'Delivery Work', amount: '₹ 500', meta: 'Thrissur', status: 'paid'},
  {id: 'p3', title: 'Electrical Maintenance', amount: '₹ 1,550', meta: 'April 2', status: 'pending',
    breakdown: buildBreakdown({base: 1100, travel: 150, food: 100, other: 50, bonus: 100, overtime: 100, deductions: 50, paid: 0, fee: 50, status: 'processing', clientDate: '26 Sep 2026', expected: '29 Sep 2026', ref: 'NRT-8F29A'})},
  {id: 'p4', title: 'Installation Work', amount: '₹ 1200', meta: 'Kochi', status: 'paid'},
  {id: 'p5', title: 'Carpentry', amount: '₹ 1100', meta: 'April 10', status: 'pending'},
  {id: 'p6', title: 'Furniture Assembly', amount: '₹ 800', meta: 'Calicut', status: 'cancelled'},
  {id: 'p7', title: 'Plumbing Repair', amount: '₹ 950', meta: 'April 14'},
  {id: 'p8', title: 'Lulu Work', amount: '₹ 650', meta: 'Ernakulam', status: 'paid'},
  {id: 'p9', title: 'Tile Fixing', amount: '₹ 1350', meta: 'April 18', status: 'pending'},
  {id: 'p10', title: 'Warehouse Loading', amount: '₹ 600', meta: 'Palakkad', status: 'cancelled'},
];

export const samplePaymentsDetailProps: PaymentsDetailProps = {
  payments: samplePayments,
  onBack: () => console.log('back'),
  onPressPayment: p =>
    Alert.alert(p.title, `${p.amount} · ${p.meta}\nStatus: ${p.status ?? 'paid'}`),
  // variant: 'ios', // omit to auto-detect platform
};

/** Edge case: empty list */
export const emptyPaymentsDetailProps: PaymentsDetailProps = {
  ...samplePaymentsDetailProps,
  payments: [],
};

export default function PaymentsDetailSample() {
  return <PaymentsDetail {...samplePaymentsDetailProps} />;
}
