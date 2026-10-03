import React from 'react';
import {StyleSheet, View} from 'react-native';

/** Two fields side by side (DOB/Gender, City/PIN), 10px gap. */
export default function FieldPair({children}: {children: React.ReactNode}) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({row: {flexDirection: 'row', columnGap: 10}});
