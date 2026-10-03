import React from 'react';
import {Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import {Icon} from './icons';
import {C, font, useGlass} from './theme';

type Props = {label: string; onPress?: () => void; icon?: string; height?: number; style?: StyleProp<ViewStyle>};

/** Secondary pill: violet text on a soft violet tint. */
export default function SoftButton({label, onPress, icon, height = 42, style}: Props) {
  const glass = useGlass();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({pressed}) => [styles.base, {height, borderRadius: height / 2, opacity: pressed ? 0.75 : 1}, glass ? styles.glass : styles.flat, style]}>
      {icon && <Icon d={icon} size={15} strokeWidth={1.8} />}
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 6, paddingHorizontal: 14},
  glass: {backgroundColor: C.glassSoft, borderWidth: 1, borderColor: 'rgba(255,255,255,0.72)'},
  flat: {backgroundColor: C.flatSoft},
  label: font('500', 13, C.violet),
});
