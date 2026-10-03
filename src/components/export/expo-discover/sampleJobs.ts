import type {Job, LatLng} from './types';

/** Mockup location: Ernakulam, Kochi. Used when no user location is available. */
export const SAMPLE_USER: LatLng = {latitude: 9.976, longitude: 76.2905};

export const SAMPLE_JOBS: Job[] = [
  {
    id: 'e1', trade: 'Electrical', title: 'Rewire 2BHK flat', area: 'Kadavanthra', city: 'Kochi',
    coordinate: {latitude: 9.966, longitude: 76.299}, pay: 2400, payUnit: 'fixed', when: 'Today · 2–6 PM', urgent: true,
    duration: '4 hrs',
    description: 'Full rewiring of a 2BHK apartment: replace old aluminium wiring with copper, fit a new MCB board and 14 switch points. Materials are already on site.',
    requirements: ['Licensed electrician', 'Own tools', 'MCB fitting'],
    client: {name: 'Anitha Menon', rating: 4.8, jobsPosted: 23},
  },
  {
    id: 'p1', trade: 'Plumbing', title: 'Fix leaking bathroom line', area: 'Panampilly Nagar', city: 'Kochi',
    coordinate: {latitude: 9.958, longitude: 76.295}, pay: 650, payUnit: 'fixed', when: 'Today · 4 PM',
    duration: '1–2 hrs',
    description: 'A concealed pipe behind the shower mixer is leaking. Trace and repair the leak; a few tiles may need to be opened and refixed.',
    requirements: ['Leak detection', 'Own tools', 'Tiling basics'],
    client: {name: 'Joseph Varghese', rating: 4.6, jobsPosted: 8},
  },
  {
    id: 'c1', trade: 'Carpentry', title: 'Wardrobe shutter repair', area: 'MG Road', city: 'Kochi',
    coordinate: {latitude: 9.9667, longitude: 76.2856}, pay: 900, payUnit: 'fixed', when: 'Tomorrow · 10 AM',
    duration: '2 hrs',
    description: 'Three wardrobe shutters are sagging. Replace the hinges with soft-close ones (supplied by the client) and realign the doors.',
    requirements: ['Hinge fitting', 'Own drill'],
    client: {name: 'Fathima R.', rating: 4.9, jobsPosted: 12},
  },
  {
    id: 'a1', trade: 'Painting', title: 'Repaint office cabin', area: 'Kaloor', city: 'Kochi',
    coordinate: {latitude: 9.9975, longitude: 76.2995}, pay: 1800, payUnit: 'per day', when: '2 days · from Mon',
    duration: '2 days',
    description: 'Repaint a 12×14 ft office cabin: scrape, putty touch-up, one primer coat and two coats of emulsion. Paint is supplied.',
    requirements: ['Interior painting', 'Putty work', 'Ladder'],
    client: {name: 'Bluewave Logistics', rating: 4.7, jobsPosted: 41},
  },
  {
    id: 'e2', trade: 'Electrical', title: 'Install 4 ceiling fans', area: 'Ernakulam North', city: 'Kochi',
    coordinate: {latitude: 9.99, longitude: 76.288}, pay: 1200, payUnit: 'fixed', when: 'Tomorrow · 9 AM',
    duration: '3 hrs',
    description: 'Install four ceiling fans in a new house. Hooks and wiring points are ready and the fans are boxed on site.',
    requirements: ['Fan installation', 'Own tools'],
    client: {name: 'Suresh Kumar', rating: 4.5, jobsPosted: 5},
  },
  {
    id: 'h1', trade: 'Helper', title: 'Shop shifting helper', area: 'Marine Drive', city: 'Kochi',
    coordinate: {latitude: 9.979, longitude: 76.277}, pay: 750, payUnit: 'per day', when: 'Today · 11 AM', slotsNote: '3 of 4 slots open',
    duration: '6 hrs',
    description: 'Help move stock and racks from the old shop to a new unit 200 m away. Lunch is provided.',
    requirements: ['Lifting', 'No tools needed'],
    client: {name: 'Kochi Textiles', rating: 4.4, jobsPosted: 30},
  },
  {
    id: 'p2', trade: 'Plumbing', title: 'Kitchen sink installation', area: 'Elamakkara', city: 'Kochi',
    coordinate: {latitude: 10.013, longitude: 76.293}, pay: 1100, payUnit: 'fixed', when: 'Sat · 10 AM',
    duration: '2–3 hrs',
    description: 'Install a new double-bowl kitchen sink with tap and waste fittings. The sink and fittings are on site.',
    requirements: ['Sink fitting', 'Own tools', 'Sealant work'],
    client: {name: 'Divya Thomas', rating: 4.8, jobsPosted: 3},
  },
  {
    id: 'a2', trade: 'Painting', title: 'Compound wall painting', area: 'Vyttila', city: 'Kochi',
    coordinate: {latitude: 9.9686, longitude: 76.3189}, pay: 4500, payUnit: 'fixed', when: 'From Wed · 3 days',
    duration: '3 days',
    description: 'Paint 60 m of compound wall on both sides with weatherproof exterior paint. Two painters needed.',
    requirements: ['Exterior painting', 'Own brushes & rollers'],
    client: {name: 'St. Mary’s Parish', rating: 4.9, jobsPosted: 17},
  },
];
