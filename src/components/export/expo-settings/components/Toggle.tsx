import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
import {C} from '../theme';

/** 44×26 switch. Purely visual; the parent row handles the press. */
export default function Toggle({on}: {on: boolean}) {
  const v = useRef(new Animated.Value(on ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(v, {toValue: on ? 1 : 0, duration: 300, easing: Easing.bezier(0.34, 1.32, 0.4, 1), useNativeDriver: false}).start();
  }, [on, v]);
  const bg = v.interpolate({inputRange: [0, 1], outputRange: [C.toggleOff, C.violet]});
  const x = v.interpolate({inputRange: [0, 1], outputRange: [0, 18]});
  return (
    <Animated.View style={[styles.track, {backgroundColor: bg}]}>
      <Animated.View style={[styles.knob, {transform: [{translateX: x}]}]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {width: 44, height: 26, borderRadius: 13, padding: 3},
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E1450',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
});
