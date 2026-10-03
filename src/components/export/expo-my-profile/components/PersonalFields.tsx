import React from 'react';
import {StyleSheet, View} from 'react-native';
import Field from './Field';
import FieldPair from './FieldPair';
import type {PersonalInfo} from '../types';

/** Full Name, DOB | Gender, Phone, Email, Aadhar. */
export default function PersonalFields({info}: {info: PersonalInfo}) {
  return (
    <View style={styles.stack}>
      <Field label="Full Name" value={info.fullName} />
      <FieldPair>
        <Field label="DOB" value={info.dob} />
        <Field label="Gender" value={info.gender} />
      </FieldPair>
      <Field label="Phone No:" value={info.phone} />
      <Field label="Email address" value={info.email} />
      <Field label="Aadhar No:" value={info.aadhar} />
    </View>
  );
}

const styles = StyleSheet.create({stack: {marginHorizontal: 14, marginTop: 18, rowGap: 10}});
