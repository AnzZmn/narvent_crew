import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Panel from './Panel';
import Field from './Field';
import EditButton from './EditButton';
import {P} from './theme';
import type {BankDetails} from '../types';

/** Account No, IFSC, Account Name + Edit (opens Settings). */
export default function PaymentDetailsCard({bank, onEdit}: {bank: BankDetails; onEdit?: () => void}) {
  return (
    <Panel kind="section" style={styles.card}>
      <Text style={styles.title} accessibilityRole="header">Payment Details</Text>
      <View style={styles.stack}>
        <Field label="Account No:" value={bank.accountNo} />
        <Field label="IFSC Code:" value={bank.ifsc} />
        <Field label="Account Name:" value={bank.accountName} />
      </View>
      <EditButton onPress={onEdit} />
    </Panel>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 14, marginTop: 18, paddingVertical: 16, paddingHorizontal: 14},
  title: {fontSize: 12, fontWeight: '500', color: P.violet},
  stack: {marginTop: 12, rowGap: 10},
});
