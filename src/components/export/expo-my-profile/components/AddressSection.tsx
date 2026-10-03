import React from 'react';
import {StyleSheet, View} from 'react-native';
import SectionPill from './SectionPill';
import Field from './Field';
import FieldPair from './FieldPair';
import type {Address} from '../types';

type Props = {title: string; address: Address; onSelectCity?: () => void};

/** Section pill, Address, City (dropdown) | PIN Code. */
export default function AddressSection({title, address, onSelectCity}: Props) {
  return (
    <View>
      <SectionPill title={title} />
      <View style={styles.stack}>
        <Field label="Address" value={address.line} />
        <FieldPair>
          <Field label="City" value={address.city} onSelect={onSelectCity ?? (() => {})} />
          <Field label="PIN Code" value={address.pin} />
        </FieldPair>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({stack: {marginTop: 10, rowGap: 10}});
