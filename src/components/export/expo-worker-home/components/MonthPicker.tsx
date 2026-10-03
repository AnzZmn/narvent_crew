import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {CaretDown} from './icons';
import {C, MONO, useGlass} from './theme';

/** Small "Month / December ▾" chip. Opens whatever picker the app provides. */
export default function MonthPicker({month, onPress}: {month: string; onPress?: () => void}) {
  const glass = useGlass();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Month, ${month}. Change`}
      style={({pressed}) => [styles.chip, glass ? styles.glass : styles.flat, pressed && styles.pressed]}>
      <Text style={styles.label}>Month</Text>
      <View style={styles.row}>
        <Text style={styles.value}>{month}</Text>
        <CaretDown />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {alignSelf: 'center', marginTop: 12, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1},
  glass: {borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.5)'},
  flat: {borderColor: C.line, backgroundColor: '#FFFFFF'},
  pressed: {opacity: 0.7},
  label: {fontSize: 9, fontFamily: MONO, color: C.muted},
  row: {flexDirection: 'row', alignItems: 'center', columnGap: 8, marginTop: 3},
  value: {fontSize: 11.5, color: C.ink},
});
