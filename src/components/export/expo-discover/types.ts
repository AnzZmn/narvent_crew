export type Trade = 'Electrical' | 'Plumbing' | 'Carpentry' | 'Painting' | 'Helper';

export type LatLng = {latitude: number; longitude: number};

export type PayUnit = 'fixed' | 'per day' | 'per hour';

export type Job = {
  id: string;
  trade: Trade;
  title: string;
  /** Neighbourhood shown on the card, e.g. "Kadavanthra" */
  area: string;
  /** Shown after the area in the sheet, e.g. "Kochi" */
  city?: string;
  /** Approximate pin. The exact address is shared only after the client confirms. */
  coordinate: LatLng;
  /** Rupees, whole number */
  pay: number;
  payUnit: PayUnit;
  /** Short schedule line for the card, e.g. "Today · 2–6 PM" */
  when: string;
  urgent?: boolean;
  /** e.g. "3 of 4 slots open" */
  slotsNote?: string;
  duration: string;
  description: string;
  requirements: string[];
  client: {name: string; rating: number; jobsPosted: number};
};

/** One selectable day in the slot picker */
export type Day = {
  date: Date;
  /** YYYY-MM-DD, local time. Send this to your API. */
  key: string;
  /** "Today", "Tmrw", "Mon"… */
  short: string;
  dayNum: number;
  /** "Sat, 3 Oct" */
  long: string;
};

export type TimeSlot = {
  /** Display + API value, e.g. "10:00 AM" */
  time: string;
  full: boolean;
};

export type Booking = {
  jobId: string;
  /** YYYY-MM-DD */
  date: string;
  time: string;
  /** Human label used on the card chip and confirmation, e.g. "Tmrw, 10:00 AM" */
  label: string;
};
