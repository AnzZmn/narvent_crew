import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import JobMarker from "./JobMarker";
import UserLocationMarker from "./UserLocationMarker";
import { useGlass } from "./theme";
import { MAP_STYLE } from "../mapStyle";
import { regionWithOffset } from "../utils/geo";
import type { Job, LatLng } from "../types";

export type JobMapHandle = {
  /** Animate so `c` sits `offsetY` px above the visual centre (default: the prop). */
  focus: (c: LatLng, offsetY?: number) => void;
};

type Props = {
  jobs: Job[];
  selectedId?: string;
  user: LatLng | null;
  initialRegion: Region;
  /** px the focused pin should sit above centre, so it clears the card carousel */
  focusOffset: number;
  onSelect: (job: Job) => void;
};

/**
 * Full-screen react-native-maps view.
 * iOS: Apple Maps (no key), muted standard + a faint lavender wash.
 * Android: Google Maps (needs an API key — see README) with MAP_STYLE.
 */
const JobMap = forwardRef<JobMapHandle, Props>(function JobMap(
  { jobs, selectedId, user, initialRegion, focusOffset, onSelect },
  ref,
) {
  const glass = useGlass();
  const map = useRef<MapView>(null);
  const region = useRef<Region>(initialRegion);
  const height = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      focus: (c, offsetY = focusOffset) => {
        map.current?.animateToRegion(
          regionWithOffset(c, region.current, height.current, offsetY),
          500,
        );
      },
    }),
    [focusOffset],
  );

  const android = Platform.OS === "android";

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={(e) => (height.current = e.nativeEvent.layout.height)}
    >
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        provider={android ? PROVIDER_GOOGLE : undefined}
        customMapStyle={android ? MAP_STYLE : undefined}
        mapType={android ? "standard" : "mutedStandard"}
        userInterfaceStyle="light"
        initialRegion={initialRegion}
        onRegionChangeComplete={(r) => (region.current = r)}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsPointsOfInterests={false}
        showsBuildings={false}
        showsCompass={false}
        showsTraffic={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        moveOnMarkerPress={false}
      >
        {user && <UserLocationMarker coordinate={user} />}
        {jobs.map((j) => (
          <JobMarker
            key={j.id}
            job={j}
            selected={j.id === selectedId}
            onPress={onSelect}
          />
        ))}
      </MapView>
      {glass && <View pointerEvents="none" style={styles.wash} />}
    </View>
  );
});

export default JobMap;

const styles = StyleSheet.create({
  wash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(150,120,255,0.07)",
  },
});
