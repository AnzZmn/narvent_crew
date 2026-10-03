export {default as DiscoverFlow} from './DiscoverFlow';
export type {DiscoverFlowProps} from './DiscoverFlow';

export {default as TabBar, TABS, TAB_BAR_HEIGHT, TAB_BAR_WIDTH} from './tabbar/TabBar';
export type {Tab} from './tabbar/TabBar';
export {HomeIcon, DiscoverIcon, ProfileIcon} from './tabbar/TabIcons';

export {default as JobMap} from './components/JobMap';
export type {JobMapHandle} from './components/JobMap';
export {default as JobCard} from './components/JobCard';
export {default as JobSheet} from './components/JobSheet';
export {default as JobDetails} from './components/JobDetails';
export {default as BookingConfirmed} from './components/BookingConfirmed';

export {VariantContext, FAMILY, C as DiscoverColors} from './components/theme';
export type {Variant} from './components/theme';
export {MAP_STYLE} from './mapStyle';
export {SAMPLE_JOBS, SAMPLE_USER} from './sampleJobs';
export {buildDays, demoAvailability, DEFAULT_TIMES} from './utils/slots';
export {distanceKm, formatKm, regionAround} from './utils/geo';
export {formatINR} from './utils/format';
export {openDirections} from './utils/directions';
export {useUserLocation} from './hooks/useUserLocation';
export type {Job, Trade, LatLng, PayUnit, Day, TimeSlot, Booking} from './types';
