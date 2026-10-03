import React from 'react';
import DetailScreen from '../components/DetailScreen';
import PaymentList from '../components/PaymentList';
import type {Variant} from '../components/theme';
import type {PaymentEntry} from '../types';

export type PaymentsDetailProps = {
  payments: PaymentEntry[];
  onBack: () => void;
  onPressPayment?: (p: PaymentEntry) => void;
  variant?: Variant;
};

export default function PaymentsDetail({payments, onBack, onPressPayment, variant}: PaymentsDetailProps) {
  return (
    <DetailScreen title="Payments" onBack={onBack} variant={variant}>
      <PaymentList payments={payments} onPressItem={onPressPayment} />
    </DetailScreen>
  );
}
