import React from 'react';
import {ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import GradientFill from './GradientFill';
import {C, font, useGlass} from './theme';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  busy?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/** Violet pill. Glass: #9A7BFF → #7D3BFF gradient with a top sheen. Flat: solid violet. */
export default function PrimaryButton({label, onPress, disabled, busy, height = 42, style}: Props) {
  const glass = useGlass();
  const r = height / 2;
  return (
    <Pressable
      onPress={disabled || busy ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{disabled: !!disabled, busy: !!busy}}
      style={({pressed}) => [styles.base, {height, borderRadius: r, opacity: disabled ? 0.5 : pressed ? 0.85 : 1}, !glass && styles.flat, style]}>
      {glass && (
        <>
          <GradientFill colors={[C.violetTop, C.violet]} stops={[0, 1]} radius={r} />
          <View pointerEvents="none" style={[styles.sheen, {left: r, right: r}]} />
        </>
      )}
      {busy ? <ActivityIndicator color={C.white} /> : <Text style={styles.label} numberOfLines={1}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: C.violet,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 10},
    elevation: 4,
  },
  flat: {backgroundColor: C.violet},
  sheen: {position: 'absolute', top: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.4)'},
  label: font('500', 13.5, C.white),
});
