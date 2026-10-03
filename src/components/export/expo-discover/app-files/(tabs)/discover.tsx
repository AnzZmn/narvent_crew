// Copy to: app/(tabs)/discover.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {DiscoverFlow, Job, Booking, Day, TimeSlot} from '../../expo-discover';
import {useTabOverlay} from '../../TabOverlay';
import {api} from '../../lib/api'; // your client — see README §7

/**
 * Not wrapped in <SwipeTabs>: horizontal drags belong to the map and the
 * card carousel here. Use the tab bar to leave this tab.
 */
export default function DiscoverTab() {
  const setOverlay = useTabOverlay();
  const [jobs, setJobs] = useState<Job[] | undefined>(undefined);
  const [bookings, setBookings] = useState<Record<string, Booking>>();

  useEffect(() => {
    api.getNearbyJobs().then(rows => setJobs(rows.map(toJob)));
    api.getMyBookings().then(rows => setBookings(Object.fromEntries(rows.map(b => [b.jobId, b]))));
  }, []);

  const getAvailability = useCallback(
    (job: Job, day: Day): Promise<TimeSlot[]> => api.getSlots(job.id, day.key),
    [],
  );

  return (
    <DiscoverFlow
      jobs={jobs ?? []}
      loading={jobs === undefined}
      areaLabel="near you"
      hideTabBar // the layout draws the shared bar
      onOverlayChange={setOverlay} // hides it while the job sheet is open
      initialBookings={bookings}
      getAvailability={getAvailability}
      onBook={b => api.bookSlot(b)}
    />
  );
}

// Map your API shape → Job (README §7)
function toJob(r: any): Job {
  return {
    id: String(r.id),
    trade: r.trade,
    title: r.title,
    area: r.locality,
    city: r.city,
    coordinate: {latitude: r.lat, longitude: r.lng},
    pay: r.pay_amount,
    payUnit: r.pay_type === 'daily' ? 'per day' : r.pay_type === 'hourly' ? 'per hour' : 'fixed',
    when: r.schedule_label,
    urgent: !!r.urgent,
    slotsNote: r.openings > 1 ? r.openings_left + ' of ' + r.openings + ' slots open' : undefined,
    duration: r.duration_label,
    description: r.description,
    requirements: r.requirements ?? [],
    client: {name: r.client.name, rating: r.client.rating, jobsPosted: r.client.jobs_posted},
  };
}
