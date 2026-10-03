import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {BlurView} from 'expo-blur';
import {useGlass} from './theme';

type Props = {
  /** card = white section card, tint = lavender (Payments) */
  tone?: 'card' | 'tint';
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Top-level surface. Glass: BlurView + translucent fill + white hairline and
 * top highlight. Flat: solid fill with elevation.
 */
export default function Surface({tone = 'card', radius = 20, style, children}: Props) {
  const glass = useGlass();
  if (glass) {
    return (
      <BlurView
        intensity={tone === 'tint' ? 45 : 55}
        tint="light"
        style={[styles.glass, {borderRadius: radius}, tone === 'tint' && styles.glassTintBorder, style]}>
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, tone === 'tint' ? styles.glassTintFill : styles.glassFill]} />
        <View pointerEvents="none" style={[styles.highlight, {left: radius * 0.6, right: radius * 0.6}]} />
        {children}
      </BlurView>
    );
  }
  return <View style={[{borderRadius: radius}, tone === 'tint' ? styles.flatTint : styles.flatCard, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  glass: {overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.72)'},
  glassTintBorder: {borderColor: 'rgba(255,255,255,0.62)'},
  glassFill: {backgroundColor: 'rgba(255,255,255,0.48)'},
  glassTintFill: {backgroundColor: 'rgba(236,231,255,0.5)'},
  highlight: {position: 'absolute', top: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.9)'},
  flatCard: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#3C288C',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 8},
  },
  flatTint: {backgroundColor: '#EFECFC'},
});
