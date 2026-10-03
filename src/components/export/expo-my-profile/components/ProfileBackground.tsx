import React from 'react';
import {StyleSheet, View} from 'react-native';
import GradientFill from './GradientFill';
import {useGlass} from './theme';

/** Glass: lavender 190° gradient (#EDE4FF → #F6F2FF → #EFE7FF). Flat: white, or #F8F7FF on Settings. */
export default function ProfileBackground({settings = false}: {settings?: boolean}) {
  const glass = useGlass();
  if (!glass) return <View pointerEvents="none" style={[StyleSheet.absoluteFill, settings ? styles.flatSettings : styles.flat]} />;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <GradientFill colors={['#EDE4FF', '#F6F2FF', '#EFE7FF']} stops={[0, 0.46, 1]} from={[0.59, 0]} to={[0.41, 1]} />
    </View>
  );
}

const styles = StyleSheet.create({
  flat: {backgroundColor: '#FFFFFF'},
  flatSettings: {backgroundColor: '#F8F7FF'},
});
