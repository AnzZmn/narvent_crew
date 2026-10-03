import {Linking, Platform} from 'react-native';
import type {LatLng} from '../types';

/** Opens turn-by-turn directions in Apple Maps (iOS) or Google Maps (Android), falling back to the web. */
export async function openDirections(to: LatLng, label?: string) {
  const ll = to.latitude + ',' + to.longitude;
  const q = label ? encodeURIComponent(label) : '';
  const native = Platform.select({
    ios: 'maps://?daddr=' + ll + (q ? '&q=' + q : ''),
    android: 'google.navigation:q=' + ll,
  });
  const web = 'https://www.google.com/maps/dir/?api=1&destination=' + ll;
  try {
    if (native && (await Linking.canOpenURL(native))) return Linking.openURL(native);
  } catch {}
  return Linking.openURL(web);
}
