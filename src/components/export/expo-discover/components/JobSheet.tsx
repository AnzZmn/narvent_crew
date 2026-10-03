import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GradientFill from './GradientFill';
import {Icon, PATHS} from './icons';
import {C, EASE, SHEET_BG, SLIDE_MS, useGlass} from './theme';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Pinned under the scroll area (e.g. the Book button). */
  footer?: React.ReactNode;
};

/** Bottom sheet over the map: scrim + slide-up panel, 90% max height, scrolling body, pinned footer. */
export default function JobSheet({open, onClose, children, footer}: Props) {
  const glass = useGlass();
  const insets = useSafeAreaInsets();
  const a = useRef(new Animated.Value(0)).current;
  const [h, setH] = useState(900);
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
    Animated.timing(a, {toValue: open ? 1 : 0, duration: SLIDE_MS, easing: EASE, useNativeDriver: true}).start(({finished}) => {
      if (finished && !open) setMounted(false);
    });
  }, [open, a]);

  if (!mounted) return null;

  const translateY = a.interpolate({inputRange: [0, 1], outputRange: [h + 40, 0]});

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={open ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, {opacity: a}]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close job details" />
      </Animated.View>
      <Animated.View
        onLayout={e => setH(e.nativeEvent.layout.height)}
        style={[styles.sheet, !glass && styles.flat, {transform: [{translateY}]}]}
        accessibilityViewIsModal>
        {glass && <GradientFill colors={SHEET_BG.colors} stops={SHEET_BG.stops} />}
        <View style={styles.top}>
          <View style={styles.handle} />
          <Pressable onPress={onClose} style={[styles.close, {backgroundColor: glass ? C.glassSoft : C.flatSoft}]} accessibilityRole="button" accessibilityLabel="Close">
            <Icon d={PATHS.close} size={13} color={C.body} strokeWidth={2} />
          </Pressable>
        </View>
        <ScrollView style={styles.body} contentContainerStyle={[styles.bodyContent, !footer && {paddingBottom: insets.bottom + 18}]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
        {footer && (
          <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12) + 12, backgroundColor: glass ? 'rgba(248,246,255,0.94)' : C.white}]}>{footer}</View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {backgroundColor: C.scrim},
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '90%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#F4F0FF',
  },
  flat: {backgroundColor: C.white},
  top: {height: 44, alignItems: 'center', paddingTop: 8},
  handle: {width: 38, height: 5, borderRadius: 3, backgroundColor: 'rgba(14,14,20,0.16)'},
  close: {position: 'absolute', right: 12, top: 10, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center'},
  body: {flexGrow: 0},
  bodyContent: {paddingHorizontal: 18, paddingBottom: 18},
  footer: {paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.hair},
});
