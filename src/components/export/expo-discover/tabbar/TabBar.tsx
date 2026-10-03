import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import {BlurView} from 'expo-blur';
import GradientFill from '../components/GradientFill';
import {C, useGlass} from '../components/theme';
import {DiscoverIcon, HomeIcon, ProfileIcon} from './TabIcons';

export type Tab = 'home' | 'discover' | 'profile';
export const TABS: Tab[] = ['home', 'discover', 'profile'];

const LABELS: Record<Tab, string> = {home: 'Home', discover: 'Discover work', profile: 'Profile'};

type Props = {active: Tab; onChange: (tab: Tab) => void; bottom: number};

const SLOT = 58;
const GAP = 6;
const PAD = 7;
export const TAB_BAR_WIDTH = PAD * 2 + SLOT * 3 + GAP * 2; // 200
export const TAB_BAR_HEIGHT = 58;

/**
 * Three-tab pill: Home · Discover (centre) · Profile. Replaces the two-tab bar
 * from expo-my-profile. The highlight springs between slots; each icon
 * cross-fades outline → filled as the highlight passes over it.
 * iOS: frosted pill, clear-glass highlight, ink icon. Android: white pill, violet highlight, white icon.
 */
export default function TabBar({active, onChange, bottom}: Props) {
  const glass = useGlass();
  const idx = TABS.indexOf(active);
  const x = useRef(new Animated.Value(idx)).current;

  useEffect(() => {
    Animated.spring(x, {toValue: idx, friction: 7, tension: 90, useNativeDriver: true}).start();
  }, [idx, x]);

  const translateX = x.interpolate({inputRange: [0, 1, 2], outputRange: [0, SLOT + GAP, (SLOT + GAP) * 2]});
  const onColor = glass ? C.ink : C.white;
  const cut = glass ? C.white : C.violet;

  const icon = (t: Tab, filled: boolean, color: string) =>
    t === 'home' ? <HomeIcon filled={filled} color={color} /> : t === 'discover' ? <DiscoverIcon filled={filled} color={color} cut={cut} /> : <ProfileIcon filled={filled} color={color} />;

  const indicator = glass ? (
    <View style={[styles.indicatorFill, styles.indicatorGlass]}>
      <View style={styles.indicatorHighlight} />
    </View>
  ) : (
    <View style={styles.indicatorFill}>
      <GradientFill colors={[C.violetTop, C.violet]} stops={[0, 1]} radius={22} />
    </View>
  );

  const slots = (
    <>
      <Animated.View pointerEvents="none" style={[styles.indicator, !glass && styles.indicatorShadow, {transform: [{translateX}]}]}>
        {indicator}
      </Animated.View>
      <View style={styles.slots}>
        {TABS.map((t, i) => {
          const on = x.interpolate({inputRange: [i - 1, i, i + 1], outputRange: [0, 1, 0], extrapolate: 'clamp'});
          const off = Animated.subtract(1, on);
          return (
            <Pressable
              key={t}
              onPress={() => onChange(t)}
              style={styles.slot}
              accessibilityRole="tab"
              accessibilityLabel={LABELS[t]}
              accessibilityState={{selected: active === t}}>
              <Animated.View style={[styles.icon, {opacity: off}]}>{icon(t, false, C.navIdle)}</Animated.View>
              <Animated.View style={[styles.icon, {opacity: on, transform: [{scale: on.interpolate({inputRange: [0, 1], outputRange: [1, 1.1]})}]}]}>
                {icon(t, true, onColor)}
              </Animated.View>
            </Pressable>
          );
        })}
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
  wrap: {position: 'absolute', left: '50%', marginLeft: -TAB_BAR_WIDTH / 2, zIndex: 5},
  pill: {width: TAB_BAR_WIDTH, height: TAB_BAR_HEIGHT, borderRadius: 29, padding: PAD},
  pillGlass: {overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)'},
  pillGlassFill: {backgroundColor: 'rgba(255,255,255,0.38)'},
  pillHighlight: {position: 'absolute', top: 0, left: 18, right: 18, height: 1, backgroundColor: 'rgba(255,255,255,0.95)'},
  pillFlat: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.flatLine,
    elevation: 8,
    shadowColor: '#3C288C',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
  },
  // border is 1px, so the highlight sits at 6 to line up with the 7px padding
  indicator: {position: 'absolute', top: PAD - 1, left: PAD - 1, width: SLOT, height: 44, borderRadius: 22},
  indicatorShadow: {elevation: 4, shadowColor: C.violet, shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: {width: 0, height: 8}},
  indicatorFill: {flex: 1, borderRadius: 22, overflow: 'hidden'},
  indicatorGlass: {backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)'},
  indicatorHighlight: {position: 'absolute', top: 0, left: 10, right: 10, height: 1, backgroundColor: C.white},
  slots: {flex: 1, flexDirection: 'row', columnGap: GAP},
  slot: {width: SLOT, height: 44, alignItems: 'center', justifyContent: 'center'},
  icon: {position: 'absolute'},
});
