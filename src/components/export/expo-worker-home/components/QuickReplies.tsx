import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {C} from './theme';

/** Suggested replies under a bot message. */
export default function QuickReplies({options, onPick}: {options: string[]; onPick: (text: string) => void}) {
  return (
    <View style={styles.row}>
      {options.map(o => (
        <Pressable
          key={o}
          onPress={() => onPick(o)}
          accessibilityRole="button"
          accessibilityLabel={`Send "${o}"`}
          style={({pressed}) => [styles.chip, pressed && styles.pressed]}>
          <Text style={styles.text}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flexWrap: 'wrap', columnGap: 7, rowGap: 7},
  chip: {paddingVertical: 5, paddingHorizontal: 11, borderRadius: 7, backgroundColor: C.chipBg, minHeight: 26, justifyContent: 'center'},
  pressed: {backgroundColor: '#DCD5F8'},
  text: {fontSize: 10.5, color: C.chipText},
});
