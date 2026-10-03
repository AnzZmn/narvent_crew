import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C, GAP, useGlass} from '../theme';

export default function SectionPill({title}: {title: string}) {
  const glass = useGlass();
  return (
    <View style={[styles.pill, glass ? styles.glass : styles.flat]}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {alignSelf: 'flex-start', height: 26, borderRadius: 13, paddingHorizontal: 14, justifyContent: 'center', marginHorizontal: GAP, marginTop: 18, marginBottom: 8},
  glass: {backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.72)'},
  flat: {backgroundColor: C.tint},
  text: {fontSize: 11, fontWeight: '500', color: C.violet},
});
