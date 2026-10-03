import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {BlurView} from 'expo-blur';
import {Icon, PATHS} from './icons';
import {C, useGlass} from './theme';

/** 44px round button that re-centres the map on the worker. */
export default function LocateButton({onPress, bottom}: {onPress: () => void; bottom: number}) {
  const glass = useGlass();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Show my location"
      style={({pressed}) => [styles.btn, glass ? styles.glass : styles.flat, {bottom, opacity: pressed ? 0.8 : 1}]}>
      {glass && (
        <>
          <BlurView intensity={50} tint="light" style={[StyleSheet.absoluteFill, styles.clip]} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.clip, {backgroundColor: 'rgba(255,255,255,0.65)'}]} />
        </>
      )}
      <Icon d={PATHS.locate} size={18} strokeWidth={1.9} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 14,
    zIndex: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3C288C',
    shadowOpacity: 0.28,
    shadowRadius: 13,
    shadowOffset: {width: 0, height: 10},
  },
  clip: {borderRadius: 22, overflow: 'hidden'},
  glass: {borderWidth: 1, borderColor: C.glassEdge},
  flat: {backgroundColor: C.white, borderWidth: 1, borderColor: C.flatLine, elevation: 5},
});
