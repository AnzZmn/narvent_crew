import type {Region} from 'react-native-maps';
import type {LatLng} from '../types';

const R = 6371;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in km */
export function distanceKm(a: LatLng, b: LatLng): number {
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const formatKm = (km: number) => (km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km');

/** Square-ish region around a point. 0.045° ≈ 5 km tall — about the mockup's zoom. */
export function regionAround(c: LatLng, latitudeDelta = 0.045, aspect = 0.5): Region {
  return {latitude: c.latitude, longitude: c.longitude, latitudeDelta, longitudeDelta: latitudeDelta * aspect};
}

/**
 * Region that puts `c` `offsetY` px ABOVE the map's visual centre, so a pin
 * stays clear of the card carousel at the bottom.
 */
export function regionWithOffset(c: LatLng, current: Region, mapHeight: number, offsetY: number): Region {
  const shift = mapHeight > 0 ? (current.latitudeDelta * offsetY) / mapHeight : 0;
  return {...current, latitude: c.latitude - shift, longitude: c.longitude};
}
