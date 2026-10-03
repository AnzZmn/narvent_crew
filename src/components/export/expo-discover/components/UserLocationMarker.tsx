import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {Marker} from 'react-native-maps';
import {C} from './theme';
import type {LatLng} from '../types';

const SIZE = 80;
const DURATION = 2400;

function Ripple({delay}: {delay: number}) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(a, {toValue: 1, duration: DURATION, easing: Easing.bezier(0.2, 0.6, 0.35, 1), useNativeDriver: true}),
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [a, delay]);
  const scale = a.interpolate({inputRange: [0, 1], outputRange: [0.2, 1]});
  const opacity = a.interpolate({inputRange: [0, 1], outputRange: [0.9, 0]});
  return <Animated.View pointerEvents="none" style={[styles.ring, {opacity, transform: [{scale}]}]} />;
}

/**
 * Violet dot with two staggered ripples. The marker keeps tracksViewChanges on
 * so the animation renders on Android (only this one marker, so it's cheap).
 */
export default function UserLocationMarker({coordinate}: {coordinate: LatLng}) {
  return (
    <Marker coordinate={coordinate} anchor={{x: 0.5, y: 0.5}} tracksViewChanges zIndex={0} tappable={false} accessibilityLabel="Your location">
      <View style={styles.box} collapsable={false}>
        <Ripple delay={0} />
        <Ripple delay={DURATION / 2} />
        <View style={styles.dot} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  box: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'rgba(125,59,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(125,59,255,0.45)',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.violet,
    borderWidth: 3,
    borderColor: C.white,
    shadowColor: '#3C288C',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },
});
