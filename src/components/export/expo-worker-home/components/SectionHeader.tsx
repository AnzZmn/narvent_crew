import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronRight} from './icons';
import {C} from './theme';

type Props = {title: string; onExpand?: () => void};

export default function SectionHeader({title, onExpand}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {onExpand && (
        <Pressable onPress={onExpand} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Expand ${title}`}>
          {({pressed}) => (
            <View style={styles.expand}>
              <Text style={[styles.expandText, pressed && styles.pressed]}>Expand</Text>
              <ChevronRight color={pressed ? C.purplePressed : C.purple} />
            </View>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 10},
  title: {flexShrink: 1, fontSize: 16, lineHeight: 19, fontWeight: '700', color: C.ink, letterSpacing: -0.16},
  expand: {flexDirection: 'row', alignItems: 'center', columnGap: 5, paddingVertical: 6, paddingHorizontal: 2},
  expandText: {fontSize: 11, fontWeight: '500', color: C.purple},
  pressed: {color: C.purplePressed},
});
