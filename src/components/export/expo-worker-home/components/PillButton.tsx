import React from 'react';
import {Pressable, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {C} from './theme';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  height?: number;
  color?: string;
  pressedColor?: string;
  icon?: React.ReactNode;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/**
 * Solid pill button. The colour sits on an outer shell (overflow hidden) and
 * the Pressable fills it, so ripple, shadow and disabled state render the
 * same on Android and iOS.
 */
export default function PillButton({
  label,
  onPress,
  disabled,
  height = 46,
  color = C.purple,
  pressedColor = '#6C58F5',
  icon,
  fontSize = 13.5,
  style,
  accessibilityLabel,
}: Props) {
  return (
    <View style={[styles.shell, {height, borderRadius: height / 2, backgroundColor: disabled ? '#C4BBFF' : color}, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        android_ripple={{color: 'rgba(255,255,255,0.25)'}}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{disabled: !!disabled}}
        style={styles.fill}>
        {({pressed}) => (
          <View style={[styles.inner, pressed && !disabled && {backgroundColor: pressedColor}]}>
            {icon}
            <Text style={[styles.text, {fontSize}]}>{label}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {overflow: 'hidden', elevation: 3},
  fill: {flex: 1},
  inner: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 8, paddingHorizontal: 22},
  text: {fontWeight: '500', color: '#FFFFFF', includeFontPadding: false},
});
