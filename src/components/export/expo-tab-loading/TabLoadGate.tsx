import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

type Props = {
  /** a request is in flight */
  loading: boolean;
  /** data exists (first load finished at least once) */
  ready: boolean;
  skeleton: React.ReactNode;
  children?: React.ReactNode;
  /** refetch only: wait this long before showing the skeleton, so fast responses don't flash it */
  delay?: number;
  /** once shown, keep the skeleton at least this long so it doesn't blink */
  minDuration?: number;
};

/**
 * Skeleton ⇄ content for one tab.
 * - First load (!ready): skeleton immediately, content not mounted.
 * - Refetch (ready && loading): content stays mounted (scroll position kept); skeleton covers it.
 * The swap is instant (no crossfade), so BlurView cards never render half-transparent.
 */
export default function TabLoadGate({loading, ready, skeleton, children, delay = 120, minDuration = 450}: Props) {
  const [cover, setCover] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (!ready) return;
    if (loading) {
      const t = setTimeout(() => {
        shownAt.current = Date.now();
        setCover(true);
      }, delay);
      return () => clearTimeout(t);
    }
    if (!cover) return;
    const left = Math.max(0, minDuration - (Date.now() - shownAt.current));
    const t = setTimeout(() => setCover(false), left);
    return () => clearTimeout(t);
  }, [loading, ready, cover, delay, minDuration]);

  if (!ready) return <View style={styles.root}>{skeleton}</View>;
  return (
    <View style={styles.root}>
      {children}
      {cover && <View style={StyleSheet.absoluteFill}>{skeleton}</View>}
    </View>
  );
}

const styles = StyleSheet.create({root: {flex: 1}});
