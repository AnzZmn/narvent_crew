import React from 'react';
import {StyleSheet, View} from 'react-native';
import {IconName, LineIcon} from './icons';
import {C, useGlass} from '../theme';

export default function IconTile({name}: {name: IconName}) {
  const glass = useGlass();
  return (
    <View style={[styles.tile, {backgroundColor: glass ? 'rgba(125,105,255,0.14)' : C.tint}]}>
      <LineIcon name={name} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
});
