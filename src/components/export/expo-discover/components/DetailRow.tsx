import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C, font} from './theme';

type Props = {leading: React.ReactNode; title: string; subtitle?: React.ReactNode; divider?: boolean};

/** Row inside a sheet panel: 36px leading element, title, muted subtitle. */
export default function DetailRow({leading, title, subtitle, divider}: Props) {
  return (
    <View style={[styles.row, divider && styles.div]}>
      {leading}
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <View style={styles.subWrap}>{typeof subtitle === 'string' ? <Text style={styles.sub}>{subtitle}</Text> : subtitle}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', columnGap: 12, minHeight: 60, paddingVertical: 10},
  div: {borderTopWidth: 1, borderTopColor: C.hair},
  text: {flex: 1, minWidth: 0},
  title: font('500', 13, C.ink),
  subWrap: {marginTop: 2},
  sub: font('400', 11, C.muted, 15),
});
