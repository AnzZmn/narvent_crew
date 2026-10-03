import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import JobCard from './JobCard';
import type {Booking, Job} from '../types';

export type JobCarouselHandle = {scrollToIndex: (i: number, animated?: boolean) => void};

type Props = {
  jobs: Job[];
  width: number;
  bottom: number;
  distances: Record<string, string>;
  bookings: Record<string, Booking>;
  onIndexChange: (i: number) => void;
  onDirections: (job: Job) => void;
  onView: (job: Job) => void;
  onLayoutHeight?: (h: number) => void;
};

const SIDE = 24;
const GAP = 10;

/** Snapping card row. Swiping settles on a card → onIndexChange → the map pans to that pin. */
const JobCarousel = forwardRef<JobCarouselHandle, Props>(function JobCarousel(
  {jobs, width, bottom, distances, bookings, onIndexChange, onDirections, onView, onLayoutHeight},
  ref,
) {
  const list = useRef<FlatList<Job>>(null);
  const cardW = width - SIDE * 2;
  const stride = cardW + GAP;

  useImperativeHandle(
    ref,
    () => ({scrollToIndex: (i, animated = true) => list.current?.scrollToOffset({offset: Math.max(0, i) * stride, animated})}),
    [stride],
  );

  const renderItem = useCallback(
    ({item}: {item: Job}) => (
      <JobCard job={item} width={cardW} distance={distances[item.id]} booking={bookings[item.id]} onDirections={onDirections} onView={onView} />
    ),
    [cardW, distances, bookings, onDirections, onView],
  );

  return (
    <View pointerEvents="box-none" style={[styles.wrap, {bottom}]} onLayout={e => onLayoutHeight?.(e.nativeEvent.layout.height)}>
      <FlatList
        ref={list}
        horizontal
        data={jobs}
        keyExtractor={j => j.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        snapToInterval={stride}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={Sep}
        getItemLayout={(_, i) => ({length: stride, offset: stride * i, index: i})}
        onMomentumScrollEnd={e => onIndexChange(Math.round(e.nativeEvent.contentOffset.x / stride))}
        // room for the card shadow
        style={styles.list}
      />
    </View>
  );
});

const Sep = () => <View style={{width: GAP}} />;

export default JobCarousel;

const styles = StyleSheet.create({
  wrap: {position: 'absolute', left: 0, right: 0, zIndex: 4},
  list: {overflow: 'visible'},
  content: {paddingHorizontal: SIDE, paddingVertical: 8},
});
