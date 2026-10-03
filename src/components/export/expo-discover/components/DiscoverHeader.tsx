import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GradientFill from './GradientFill';
import {C, HEADER_FADE, font, useGlass} from './theme';

type Props = {title?: string; subtitle: string; children?: React.ReactNode; onLayoutHeight?: (h: number) => void};

/** Title + count over a top fade, so the status bar and chips stay legible over any map tiles. */
export default function DiscoverHeader({title = 'Discover work', subtitle, children, onLayoutHeight}: Props) {
  const insets = useSafeAreaInsets();
  const glass = useGlass();
  const fade = glass ? HEADER_FADE.glass : HEADER_FADE.flat;
  return (
    <View pointerEvents="box-none" style={styles.wrap} onLayout={e => onLayoutHeight?.(e.nativeEvent.layout.height)}>
      <View pointerEvents="none" style={[styles.fade, {height: insets.top + 160}]}>
        <GradientFill colors={fade.colors} stops={fade.stops} />
      </View>
      <View pointerEvents="none" style={[styles.text, {paddingTop: insets.top + 10}]}>
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
      <View pointerEvents="box-none" style={styles.chips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3},
  fade: {position: 'absolute', top: 0, left: 0, right: 0},
  text: {paddingHorizontal: 18},
  title: {...font('700', 22, C.ink), letterSpacing: -0.4},
  sub: {...font('400', 12, C.sub), marginTop: 3},
  chips: {marginTop: 12},
});
