import type {Day, Job, TimeSlot} from '../types';

export const DEFAULT_TIMES = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n: number) => (n < 10 ? '0' + n : '' + n);

/** Next `count` days starting today (local time). */
export function buildDays(count = 6, from = new Date()): Day[] {
  return Array.from({length: count}, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    return {
      date: d,
      key: d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()),
      short: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : WEEK[d.getDay()],
      dayNum: d.getDate(),
      long: WEEK[d.getDay()] + ', ' + d.getDate() + ' ' + MONTH[d.getMonth()],
    };
  });
}

/**
 * Mockup availability: a fixed pattern of "Full" slots so the picker has
 * something to show. Replace with `getAvailability` on <DiscoverFlow />.
 * Also marks past times today as full.
 */
export function demoAvailability(job: Job, day: Day, dayIndex: number): TimeSlot[] {
  const seed = job.id.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const now = new Date();
  return DEFAULT_TIMES.map((time, i) => {
    let full = (seed + dayIndex * 2 + i) % 4 === 1;
    if (dayIndex === 0) {
      const [hm, ap] = time.split(' ');
      const h = (parseInt(hm, 10) % 12) + (ap === 'PM' ? 12 : 0);
      if (h <= now.getHours()) full = true;
    }
    return {time, full};
  });
}
