import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import JobMap, {JobMapHandle} from './components/JobMap';
import DiscoverHeader from './components/DiscoverHeader';
import TradeChips, {TradeFilter} from './components/TradeChips';
import LocateButton from './components/LocateButton';
import JobCarousel, {JobCarouselHandle} from './components/JobCarousel';
import JobSheet from './components/JobSheet';
import JobDetails from './components/JobDetails';
import BookingConfirmed from './components/BookingConfirmed';
import PrimaryButton from './components/PrimaryButton';
import Toast from './components/Toast';
import TabBar, {Tab, TAB_BAR_HEIGHT} from './tabbar/TabBar';
import {C, Variant, VariantContext} from './components/theme';
import {SAMPLE_JOBS, SAMPLE_USER} from './sampleJobs';
import {distanceKm, formatKm, regionAround} from './utils/geo';
import {buildDays, demoAvailability} from './utils/slots';
import {openDirections} from './utils/directions';
import {useUserLocation} from './hooks/useUserLocation';
import type {Booking, Day, Job, LatLng, TimeSlot} from './types';

export type DiscoverFlowProps = {
  /** Open jobs to show. Omit for the mockup data. */
  jobs?: Job[];
  /** True while your first fetch is running (header reads "Finding work near you…"). */
  loading?: boolean;
  /** Fixed worker location. Omit to use the device's location (expo-location). */
  userLocation?: LatLng;
  /** Used when location permission is denied, e.g. the worker's saved address. */
  fallbackLocation?: LatLng;
  /** Header line after the count, e.g. "near Ernakulam". */
  areaLabel?: string;
  /** Force a look. Default: glass on iOS, flat on Android. */
  variant?: Variant;
  /** The tabs layout draws the shared bar — pass true there. */
  hideTabBar?: boolean;
  /** Distance from screen bottom to the tab bar. Default: safe-area + 14 (matches the layout). */
  tabBarBottom?: number;
  /** Only used when this component draws its own bar (hideTabBar false). */
  onTabChange?: (tab: Tab) => void;
  /** Fires true while the job sheet is open, so the layout can hide the tab bar. */
  onOverlayChange?: (open: boolean) => void;
  /** Bookings the worker already has (jobId → booking), e.g. from your API. */
  initialBookings?: Record<string, Booking>;
  /** Return the start times for a job on a day. Sync or async. Default: demo pattern. */
  getAvailability?: (job: Job, day: Day) => TimeSlot[] | Promise<TimeSlot[]>;
  /** Persist the booking. Throw to show an error toast and keep the sheet open. */
  onBook?: (booking: Booking, job: Job) => void | Promise<void>;
  /** Override the Directions button. Default: Apple Maps / Google Maps deep link. */
  onDirections?: (job: Job) => void;
};

const SHEET_DAYS = 6;

export default function DiscoverFlow({variant, ...props}: DiscoverFlowProps) {
  const inner = <DiscoverInner {...props} />;
  return variant ? <VariantContext.Provider value={variant}>{inner}</VariantContext.Provider> : inner;
}

function DiscoverInner({
  jobs: jobsProp,
  loading,
  userLocation,
  fallbackLocation,
  areaLabel = 'near you',
  hideTabBar,
  tabBarBottom,
  onTabChange,
  onOverlayChange,
  initialBookings,
  getAvailability,
  onBook,
  onDirections,
}: Omit<DiscoverFlowProps, 'variant'>) {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const demo = jobsProp === undefined;
  const allJobs = jobsProp ?? SAMPLE_JOBS;

  // location: explicit prop → device → fallback → mockup point
  const device = useUserLocation(fallbackLocation ?? null, !userLocation && !demo);
  const user = userLocation ?? (demo ? SAMPLE_USER : device.location);
  const center = user ?? fallbackLocation ?? allJobs[0]?.coordinate ?? SAMPLE_USER;
  const initialRegion = useMemo(() => regionAround(center), [center.latitude, center.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  // jobs sorted by distance from the worker
  const sorted = useMemo(() => {
    if (!user) return allJobs;
    return [...allJobs].sort((a, b) => distanceKm(user, a.coordinate) - distanceKm(user, b.coordinate));
  }, [allJobs, user]);
  const distances = useMemo(() => {
    const m: Record<string, string> = {};
    sorted.forEach(j => (m[j.id] = user ? formatKm(distanceKm(user, j.coordinate)) : '—'));
    return m;
  }, [sorted, user]);

  const [filter, setFilter] = useState<TradeFilter>('All');
  const visible = useMemo(() => sorted.filter(j => filter === 'All' || j.trade === filter), [sorted, filter]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const selected = visible.find(j => j.id === selectedId) ?? visible[0];

  // layout: tab bar → carousel → locate button, stacked from the bottom
  const barBottom = tabBarBottom ?? Math.max(insets.bottom, 10) + 14;
  const carouselBottom = barBottom + TAB_BAR_HEIGHT + 6;
  const [carouselH, setCarouselH] = useState(200);
  const [headerH, setHeaderH] = useState(insets.top + 120);
  const locateBottom = carouselBottom + carouselH + 4;
  const focusOffset = Math.max(0, (carouselBottom + carouselH - headerH) / 2);

  const map = useRef<JobMapHandle>(null);
  const carousel = useRef<JobCarouselHandle>(null);

  // toast
  const [toast, setToast] = useState<string | null>(null);
  const toastT = useRef<ReturnType<typeof setTimeout>>();
  const flash = useCallback((m: string) => {
    setToast(m);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 1800);
  }, []);
  useEffect(() => () => clearTimeout(toastT.current), []);

  const select = useCallback(
    (job: Job, scrollCards: boolean) => {
      setSelectedId(job.id);
      map.current?.focus(job.coordinate, focusOffset);
      if (scrollCards) carousel.current?.scrollToIndex(visible.indexOf(job));
    },
    [visible, focusOffset],
  );

  const onFilter = (t: TradeFilter) => {
    setFilter(t);
    const first = sorted.find(j => t === 'All' || j.trade === t);
    setSelectedId(first?.id);
    carousel.current?.scrollToIndex(0, false);
    if (first) map.current?.focus(first.coordinate, focusOffset);
  };

  // sheet + booking
  const days = useMemo(() => buildDays(SHEET_DAYS), []);
  const [sheetJob, setSheetJob] = useState<Job | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dayIndex, setDayIndex] = useState(0);
  const [timeIndex, setTimeIndex] = useState<number | null>(null);
  const [times, setTimes] = useState<TimeSlot[] | null>(null);
  const [bookings, setBookings] = useState<Record<string, Booking>>(initialBookings ?? {});
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialBookings) setBookings(b => ({...initialBookings, ...b}));
  }, [initialBookings]);

  useEffect(() => onOverlayChange?.(sheetOpen), [sheetOpen, onOverlayChange]);

  useEffect(() => {
    if (!sheetJob || confirmed) return;
    let alive = true;
    setTimes(null);
    const day = days[dayIndex];
    Promise.resolve(getAvailability ? getAvailability(sheetJob, day) : demoAvailability(sheetJob, day, dayIndex))
      .then(t => alive && setTimes(t))
      .catch(() => alive && setTimes([]));
    return () => {
      alive = false;
    };
  }, [sheetJob, dayIndex, confirmed, days, getAvailability]);

  const openJob = useCallback(
    (job: Job) => {
      setSheetJob(job);
      setDayIndex(0);
      setTimeIndex(null);
      setConfirmed(!!bookings[job.id]);
      setSheetOpen(true);
    },
    [bookings],
  );

  const book = async () => {
    if (!sheetJob || timeIndex == null || !times) return;
    const day = days[dayIndex];
    const b: Booking = {jobId: sheetJob.id, date: day.key, time: times[timeIndex].time, label: day.short + ', ' + times[timeIndex].time};
    setBusy(true);
    try {
      await onBook?.(b, sheetJob);
      setBookings(prev => ({...prev, [sheetJob.id]: b}));
      setConfirmed(true);
    } catch {
      flash('Couldn’t book that slot. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const directions = useCallback(
    (job: Job) => (onDirections ? onDirections(job) : openDirections(job.coordinate, job.title)),
    [onDirections],
  );

  const count = visible.length;
  const subtitle = loading ? 'Finding work near you…' : count + (count === 1 ? ' job ' : ' jobs ') + areaLabel;
  const canBook = timeIndex != null && !!times && !times[timeIndex]?.full;

  return (
    <View style={styles.root}>
      <JobMap
        ref={map}
        jobs={visible}
        selectedId={selected?.id}
        user={user}
        initialRegion={initialRegion}
        focusOffset={focusOffset}
        onSelect={j => select(j, true)}
      />

      <DiscoverHeader subtitle={subtitle} onLayoutHeight={setHeaderH}>
        <TradeChips jobs={sorted} value={filter} onChange={onFilter} />
      </DiscoverHeader>

      {user && <LocateButton bottom={locateBottom} onPress={() => map.current?.focus(user, focusOffset)} />}

      <JobCarousel
        ref={carousel}
        jobs={visible}
        width={width}
        bottom={carouselBottom}
        distances={distances}
        bookings={bookings}
        onIndexChange={i => visible[i] && visible[i].id !== selected?.id && select(visible[i], false)}
        onDirections={directions}
        onView={openJob}
        onLayoutHeight={setCarouselH}
      />

      {!hideTabBar && !sheetOpen && <TabBar active="discover" bottom={barBottom} onChange={t => t !== 'discover' && onTabChange?.(t)} />}

      <JobSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        footer={
          sheetJob && !confirmed ? (
            <PrimaryButton
              height={50}
              disabled={!canBook}
              busy={busy}
              onPress={book}
              label={canBook && times ? 'Book slot · ' + days[dayIndex].short + ', ' + times[timeIndex!].time : 'Pick a start time'}
            />
          ) : undefined
        }>
        {sheetJob &&
          (confirmed && bookings[sheetJob.id] ? (
            <BookingConfirmed
              job={sheetJob}
              booking={bookings[sheetJob.id]}
              onChange={() => {
                setConfirmed(false);
                setTimeIndex(null);
              }}
              onDone={() => setSheetOpen(false)}
            />
          ) : (
            <JobDetails
              job={sheetJob}
              distance={distances[sheetJob.id]}
              days={days}
              dayIndex={dayIndex}
              onDay={i => {
                setDayIndex(i);
                setTimeIndex(null);
              }}
              times={times}
              timeIndex={timeIndex}
              onTime={setTimeIndex}
            />
          ))}
      </JobSheet>

      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.flatBg},
});
