import {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import type {LatLng} from '../types';

type State = {location: LatLng | null; status: 'loading' | 'granted' | 'denied' | 'error'};

/**
 * Asks for while-in-use location once and returns the current position.
 * Falls back to `fallback` (e.g. the worker's saved address) when denied.
 */
export function useUserLocation(fallback: LatLng | null = null, enabled = true): State {
  const [state, setState] = useState<State>({location: null, status: 'loading'});

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    (async () => {
      try {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (alive) setState({location: fallback, status: 'denied'});
          return;
        }
        const last = await Location.getLastKnownPositionAsync();
        if (last && alive) setState({location: {latitude: last.coords.latitude, longitude: last.coords.longitude}, status: 'granted'});
        const pos = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
        if (alive) setState({location: {latitude: pos.coords.latitude, longitude: pos.coords.longitude}, status: 'granted'});
      } catch {
        if (alive) setState({location: fallback, status: 'error'});
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return state;
}
