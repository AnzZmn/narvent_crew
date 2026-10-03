import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C, useGlass} from './theme';

/** "Total earnings ₹7950" tile at the top of Day vs Payout. */
export default function TotalEarnings({total}: {total: string}) {
  const glass = useGlass();
  return (
    <View style={[styles.box, glass ? styles.glass : styles.flat]} accessibilityLabel={`Total earnings ${total}`}>
      <Text style={styles.label}>Total earnings</Text>
      <Text style={styles.value} adjustsFontSizeToFit numberOfLines={1}>{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {alignSelf: 'center', width: '70%', maxWidth: 200, borderRadius: 10, padding: 14, alignItems: 'center'},
  glass: {backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)'},
  flat: {backgroundColor: '#FBFAFE', borderWidth: 1, borderColor: C.line},
  label: {fontSize: 14, color: C.ink},
  value: {marginTop: 6, fontSize: 27, lineHeight: 32, fontWeight: '700', color: C.ink, letterSpacing: -0.54},
});
