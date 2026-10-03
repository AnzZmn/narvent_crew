import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import {BlurView} from 'expo-blur';
import GradientFill from './GradientFill';
import {HomeIcon, ProfileIcon} from './icons';
import {C, useGlass} from './theme';

export type Tab = 'home' | 'profile';

type Props = {active: Tab; onChange: (tab: Tab) => void; bottom: number};

const SLOT = 58;
const SLOT_GAP = 6;
const WIDTH = 136;

/**
 * Two-tab pill. The highlight slides with a spring; icons cross-fade between
 * outline and filled. iOS: frosted pill with a clear-glass highlight and ink
 * active icon. Android: white pill with a violet highlight and white icon.
 */
export default function TabBar({active, onChange, bottom}: Props) {
  const glass = useGlass();
  const x = useRef(new Animated.Value(active === 'home' ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(x, {toValue: active === 'home' ? 0 : 1, friction: 7, tension: 90, useNativeDriver: true}).start();
  }, [active, x]);

  const translateX = x.interpolate({inputRange: [0, 1], outputRange: [0, SLOT + SLOT_GAP]});
  const homeOn = x.interpolate({inputRange: [0, 1], outputRange: [1, 0]});
  const homeOff = x;
  const profOn = x;
  const profOff = homeOn;
  const onColor = glass ? C.ink : '#FFFFFF';

  const indicator = glass ? (
    <View style={[styles.indicatorFill, styles.indicatorGlass]}>
      <View style={styles.indicatorHighlight} />
    </View>
  ) : (
    <View style={styles.indicatorFill}>
      <GradientFill colors={['#9A7BFF', '#7D3BFF']} stops={[0, 1]} radius={22} />
    </View>
  );

  const slots = (
    <>
      <Animated.View pointerEvents="none" style={[styles.indicator, !glass && styles.indicatorShadow, {transform: [{translateX}]}]}>
        {indicator}
      </Animated.View>
      <View style={styles.slots}>
        <Pressable onPress={() => onChange('home')} style={styles.slot} accessibilityRole="tab" accessibilityLabel="Home" accessibilityState={{selected: active === 'home'}}>
          <Animated.View style={[styles.icon, {opacity: homeOff}]}><HomeIcon filled={false} color={C.navIdle} /></Animated.View>
          <Animated.View style={[styles.icon, {opacity: homeOn}]}><HomeIcon filled color={onColor} /></Animated.View>
        </Pressable>
        <Pressable onPress={() => onChange('profile')} style={styles.slot} accessibilityRole="tab" accessibilityLabel="Profile" accessibilityState={{selected: active === 'profile'}}>
          <Animated.View style={[styles.icon, {opacity: profOff}]}><ProfileIcon filled={false} color={C.navIdle} /></Animated.View>
          <Animated.View style={[styles.icon, {opacity: profOn}]}><ProfileIcon filled color={onColor} /></Animated.View>
        </Pressable>
      </View>
    </>
  );

  return (
    <View style={[styles.wrap, {bottom}]} accessibilityRole="tablist">
      {glass ? (
        <BlurView intensity={70} tint="light" style={[styles.pill, styles.pillGlass]}>
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.pillGlassFill]} />
          <View pointerEvents="none" style={styles.pillHighlight} />
          {slots}
        </BlurView>
      ) : (
        <View style={[styles.pill, styles.pillFlat]}>{slots}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {position: 'absolute', left: '50%', marginLeft: -WIDTH / 2, zIndex: 5},
  pill: {width: WIDTH, height: 58, borderRadius: 29, padding: 7},
  pillGlass: {overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)'},
  pillGlassFill: {backgroundColor: 'rgba(255,255,255,0.38)'},
  pillHighlight: {position: 'absolute', top: 0, left: 18, right: 18, height: 1, backgroundColor: 'rgba(255,255,255,0.95)'},
  pillFlat: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.line,
    elevation: 8,
    shadowColor: '#3C288C',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
  },

  indicator: {position: 'absolute', top: 6, left: 6, width: SLOT, height: 44, borderRadius: 22},
  indicatorShadow: {elevation: 4, shadowColor: '#7D3BFF', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: {width: 0, height: 8}},
  indicatorFill: {flex: 1, borderRadius: 22, overflow: 'hidden'},
  // clear glass: near-transparent fill, bright rim, top highlight
  indicatorGlass: {backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)'},
  indicatorHighlight: {position: 'absolute', top: 0, left: 10, right: 10, height: 1, backgroundColor: '#FFFFFF'},

  slots: {flex: 1, flexDirection: 'row', columnGap: SLOT_GAP},
  slot: {width: SLOT, height: 44, alignItems: 'center', justifyContent: 'center'},
  icon: {position: 'absolute'},
});
