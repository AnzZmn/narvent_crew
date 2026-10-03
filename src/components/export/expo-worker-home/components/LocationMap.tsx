import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import PillButton from './PillButton';
import {LayersIcon, MapPin, NavigateIcon, PinSmall, SearchIcon} from './icons';

type Props = {
  onCurrentLocation?: () => void;
  onSearch?: () => void;
  onLayers?: () => void;
  onRecenter?: () => void;
  /** pass a real map (e.g. react-native-maps <MapView>) to replace the drawn placeholder */
  map?: React.ReactNode;
};

function MapButton({icon, onPress, label}: {icon: React.ReactNode; onPress?: () => void; label: string}) {
  return (
    <Pressable onPress={onPress} hitSlop={11} style={styles.mapBtn} accessibilityRole="button" accessibilityLabel={label}>
      {icon}
    </Pressable>
  );
}

/** 296:180 map card: street placeholder, pin, zoom/layer/recenter controls, Current location button. */
export default function LocationMap({onCurrentLocation, onSearch, onLayers, onRecenter, map}: Props) {
  return (
    <View style={styles.frame}>
      {map ?? (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 296 180" preserveAspectRatio="xMidYMid slice">
          <Rect width={296} height={180} fill="#E4E3E5" />
          <Path d="M96 0h74v56H96z" fill="#DDE7C4" />
          <Path d="M188 92h58v42h-58z" fill="#F2E9D8" />
          <Path d="M-4 62h304M-4 128h304M78 -4v188M186 -4v188" stroke="#FBFBFB" strokeWidth={7} />
          <Path d="M-4 30h304M126 -4v188M244 -4v188" stroke="#FBFBFB" strokeWidth={4} />
          <Path d="M0 150 120 96l70 30 106-54" stroke="#FBFBFB" strokeWidth={6} fill="none" />
          <Path d="M96 8h70M96 20h70M96 32h70M96 44h70" stroke="#CFDCAE" strokeWidth={2} />
        </Svg>
      )}
      {!map && (
        <View style={styles.pin} pointerEvents="none">
          <MapPin />
        </View>
      )}
      <View style={styles.controls}>
        <MapButton icon={<SearchIcon />} onPress={onSearch} label="Search map" />
        <MapButton icon={<LayersIcon />} onPress={onLayers} label="Map layers" />
        <MapButton icon={<NavigateIcon />} onPress={onRecenter} label="Recenter" />
      </View>
      <PillButton label="Current location" icon={<PinSmall />} height={34} fontSize={13} onPress={onCurrentLocation} style={styles.locate} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: 296 / 180,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(109,92,224,0.45)',
    backgroundColor: '#E6E6E6',
  },
  pin: {position: 'absolute', left: '41%', top: '52%', marginLeft: -11, marginTop: -28},
  controls: {position: 'absolute', right: 8, top: '24%', rowGap: 7},
  mapBtn: {width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(125,105,255,0.85)', alignItems: 'center', justifyContent: 'center'},
  locate: {position: 'absolute', left: '8%', right: '8%', bottom: '11%'},
});
