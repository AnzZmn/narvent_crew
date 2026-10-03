import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Surface from './Surface';
import GradientFill from './GradientFill';

type Props = {
  width: number;
  height: number;
  /** omit for a white / glass tile */
  gradient?: {to: string; angleStop: number};
  onPress?: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
};

/**
 * One tile in the sideways summary row (179×155 in the mockup, 49.7% of the
 * screen width). Gradient tiles stay solid on both platforms; the plain tile
 * becomes glass on iOS.
 */
export default function SummaryTile({width, height, gradient, onPress, accessibilityLabel, children}: Props) {
  const size = {width, height};
  const body = gradient ? (
    <View style={[styles.tile, styles.solid, size]}>
      {/* CSS: linear-gradient(~16deg, #fff <stop>, <colour> 150%) */}
      <GradientFill colors={['#FFFFFF', '#FFFFFF', gradient.to]} stops={[0, gradient.angleStop, 1]} from={[0.36, 1]} to={[0.64, 0]} />
      <View style={styles.content}>{children}</View>
    </View>
  ) : (
    <Surface radius={8} style={[styles.tile, size]}>
      <View style={styles.content}>{children}</View>
    </Surface>
  );
  if (!onPress) return <View accessibilityLabel={accessibilityLabel}>{body}</View>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={({pressed}) => pressed && styles.pressed}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {borderRadius: 8, overflow: 'hidden'},
  solid: {backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#6D58F4', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: {width: 0, height: 8}},
  content: {flex: 1, paddingVertical: 14, paddingHorizontal: 16},
  pressed: {opacity: 0.85},
});
