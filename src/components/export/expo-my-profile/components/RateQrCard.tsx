import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, Text, useWindowDimensions} from 'react-native';
import Panel from './Panel';
import {P} from './theme';

const DEFAULT_QR = require('../assets/qr-purple.png');

/** "Scan to rate" card. QR is 68% of the card, max 200. Pass the worker's real code as `qr`. */
export default function RateQrCard({qr = DEFAULT_QR}: {qr?: ImageSourcePropType}) {
  const {width} = useWindowDimensions();
  const size = Math.min(200, Math.round((width - 28 - 36) * 0.68));
  return (
    <Panel kind="qr" style={styles.card}>
      <Image source={qr} style={{width: size, height: size}} resizeMode="contain" accessibilityLabel="Rating QR code" />
      <Text style={styles.caption}>Scan to rate</Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 14, marginTop: 14, padding: 18, alignItems: 'center', rowGap: 12},
  caption: {fontSize: 13, fontWeight: '700', color: P.violet},
});
