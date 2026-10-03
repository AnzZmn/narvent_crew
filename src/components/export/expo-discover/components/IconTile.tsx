import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon} from './icons';
import {C} from './theme';

/** Rounded violet-tint square holding a stroke icon (trade, location). */
export default function IconTile({d, size = 40, iconSize = 20}: {d: string; size?: number; iconSize?: number}) {
  return (
    <View style={[styles.tile, {width: size, height: size, borderRadius: size * 0.3}]}>
      <Icon d={d} size={iconSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {backgroundColor: C.tile, alignItems: 'center', justifyContent: 'center'},
});
