import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {AccessibilityInfo, Animated, Easing, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';

type Ctx = {progress: Animated.Value; still: boolean; glass: boolean};
const ShimmerCtx = createContext<Ctx | null>(null);

/**
 * One loop drives every bone inside it, so the highlight reads as a single sweep.
 * Native driver (translateX only). Static when Reduce Motion is on.
 */
export function ShimmerProvider({glass, duration = 1500, children}: {glass: boolean; duration?: number; children: React.ReactNode}) {
  const progress = useRef(new Animated.Value(0)).current;
  const [still, setStill] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setStill);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setStill);
    return () => sub.remove();
  }, []);
  useEffect(() => {
    if (still) return;
    const loop = Animated.loop(
      Animated.timing(progress, {toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
    );
    loop.start();
    return () => loop.stop();
  }, [still, duration, progress]);
  return <ShimmerCtx.Provider value={{progress, still, glass}}>{children}</ShimmerCtx.Provider>;
}

const TONE = {
  glass: {base: 'rgba(125,105,255,0.13)', hi: 'rgba(255,255,255,0.75)'},
  flat: {base: '#ECE9F7', hi: '#F8F7FD'},
};

type BoneProps = {
  width?: ViewStyle['width'];
  height?: number;
  radius?: number;
  /** square/aspect bones (avatar, QR, KPI art) */
  aspectRatio?: number;
  style?: StyleProp<ViewStyle>;
};

/** A placeholder block. Must sit inside <ShimmerProvider>. */
export function Bone({width = '100%', height, radius = 6, aspectRatio, style}: BoneProps) {
  const ctx = useContext(ShimmerCtx);
  const [w, setW] = useState(0);
  const tone = TONE[ctx?.glass ? 'glass' : 'flat'];
  const band = Math.max(w * 0.6, 80);
  return (
    <View
      onLayout={e => setW(e.nativeEvent.layout.width)}
      style={[{width, height, aspectRatio, borderRadius: radius, backgroundColor: tone.base, overflow: 'hidden'}, style]}>
      {ctx && !ctx.still && w > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.band,
            {width: band, transform: [{translateX: ctx.progress.interpolate({inputRange: [0, 1], outputRange: [w, -band]})}]},
          ]}>
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="nvBone" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={tone.hi} stopOpacity="0" />
                <Stop offset="0.5" stopColor={tone.hi} stopOpacity="1" />
                <Stop offset="1" stopColor={tone.hi} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#nvBone)" />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({band: {position: 'absolute', top: 0, bottom: 0, left: 0}});
