import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from './icons';
import {C, font} from './theme';

type Tone = 'violet' | 'danger' | 'solid';
type Props = {label: string; tone?: Tone; icon?: string; iconViewBox?: string};

const TONES: Record<Tone, {bg: string; fg: string}> = {
  violet: {bg: C.chipBg, fg: C.tagText},
  danger: {bg: C.dangerBg, fg: C.dangerText},
  solid: {bg: C.violet, fg: C.white},
};

/** 24px meta chip: schedule, "Urgent", slots left, "Booked · …" */
export default function InfoChip({label, tone = 'violet', icon, iconViewBox}: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.chip, {backgroundColor: t.bg}]}>
      {icon && <Icon d={icon} size={11} color={t.fg} strokeWidth={2.2} viewBox={iconViewBox} />}
      <Text style={[styles.text, {color: t.fg}]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {height: 24, paddingHorizontal: 9, borderRadius: 12, flexDirection: 'row', alignItems: 'center', columnGap: 5},
  text: font('500', 10.5),
});
