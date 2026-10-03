# Narvent Discover Work: Expo / React Native (StyleSheet only, no NativeWind)

This is **Discover work** from section 11 of the design file. It is a full-screen `react-native-maps` map with a price marker for each open job and a pulsing dot for the worker. On top of the map sit trade filter chips, a locate button, and a snapping card carousel that stays in sync with the map. **View job** opens a sheet with the job details and a day / start-time picker. After booking, the sheet shows a confirmation and the job's card gets a "Booked · …" chip.

It also ships the **new three-tab bar** (Home · **Discover** · Profile). It replaces the two-tab bar that currently comes from `expo-my-profile`.

- **iPhone**: Apple Maps (no API key). Liquid glass: frosted chips, cards and tab bar, gradient buttons, lavender header fade and a faint lavender wash over the map.
- **Android**: Google Maps (**API key required**, §2) with a custom lavender map style. Flat: white cards and chips, solid violet buttons.

The variant is chosen from `Platform.OS`. Force one with `<DiscoverFlow variant="glass" | "flat" />`. The map provider always follows the platform.

Every component is its own file, and every style is a plain `StyleSheet.create`. Animations use the built-in `Animated` API only.

```
expo-discover/
  index.ts                  public exports
  DiscoverFlow.tsx          drop-in screen: map + header + chips + carousel + sheet + toast + state
  types.ts                  Job, Booking, Day, TimeSlot, LatLng
  sampleJobs.ts             8 mockup jobs around Ernakulam + mockup user location
  mapStyle.ts               Google Maps style JSON (Android)
  hooks/
    useUserLocation.ts      expo-location permission + current position
  utils/
    geo.ts                  distance, region helpers, "pin above centre" maths
    slots.ts                next-N-days builder, default times, demo availability
    format.ts               ₹ with Indian grouping, initials
    directions.ts           Apple Maps / Google Maps deep link
  components/
    theme.ts  icons.tsx  GradientFill.tsx  Panel.tsx  IconTile.tsx
    PrimaryButton.tsx  SoftButton.tsx  InfoChip.tsx  Toast.tsx
    JobMap.tsx              MapView, provider/style per platform, focus() handle
    JobMarker.tsx           <Marker> wrapper (tracksViewChanges handling)
    PriceMarker.tsx         the price bubble view
    UserLocationMarker.tsx  dot + two staggered ripples
    DiscoverHeader.tsx      title, count, top fade
    TradeChips.tsx  TradeChip.tsx
    LocateButton.tsx
    JobCarousel.tsx  JobCard.tsx
    JobSheet.tsx            scrim + slide-up sheet + pinned footer
    JobDetails.tsx  StatStrip.tsx  DetailRow.tsx
    SlotPicker.tsx  DayPill.tsx  TimePill.tsx
    BookingConfirmed.tsx
  tabbar/
    TabBar.tsx              3-tab pill (Home · Discover · Profile)
    TabIcons.tsx            Home / Discover (compass) / Profile, outline + filled
  app-files/                reference copies; NOT routes until you move them into app/
    (tabs)/discover.tsx     the new tab screen
    (tabs)/_layout.tsx      layout with 3 tabs + new TabBar
    SwipeTabs.tsx           ORDER updated to index · discover · profile
```

---

## 1. Install

```sh
npx expo install react-native-maps expo-location
# already in the project from the Profile/Home exports; run anyway to be sure
npx expo install expo-blur react-native-svg react-native-safe-area-context
```

`react-native-maps` contains native code. **On Android, Google Maps only renders your own API key in a development or production build**, not with a plain JS reload of an old binary. After §2, rebuild:

```sh
npx expo prebuild --clean          # if you use local native folders
npx expo run:android               # or: eas build --profile development --platform android
npx expo run:ios
```

Expo Go can be used for a quick look, but it doesn't use your key or your app's package name. Test the real setup in a dev build.

---

## 2. Configure the Maps API

### iOS: Apple Maps (nothing to configure)

`JobMap` uses the default provider on iOS, which is Apple Maps (MapKit). It needs **no API key and no billing**. You only need the location-permission text (step 2.3).

> You _can_ run Google Maps on iOS too (`provider={PROVIDER_GOOGLE}` plus `ios.config.googleMapsApiKey`). The design is built around Apple Maps on iPhone, so this is not set up by default.

### Android: Google Maps API key

**2.1 Create the key (Google Cloud Console)**

1. Open <https://console.cloud.google.com/> and create or select a project, e.g. `narvent-maps`.
2. **Billing → Link a billing account.** Google Maps won't serve tiles to a project without billing, even inside the free usage. Check Google's current Maps pricing for the "Maps SDK for Android" SKU.
3. **APIs & Services → Library →** search **"Maps SDK for Android" → Enable**.
4. **APIs & Services → Credentials → Create credentials → API key.** Copy the key (`AIza…`).
5. AIzaSyDDGitYfHV5tRzDI2lllgBr-syk2SFhSc4

**2.2 Restrict the key**

On the key's page:

- **Application restrictions → Android apps → Add**
  - **Package name**: your `android.package` from `app.json`, e.g. `com.narvent.worker`.
  - **SHA-1 certificate fingerprint**: add one entry per signing key that will run the app.
    - _EAS builds_: `eas credentials -p android` → pick the build profile → copy **SHA-1**.
    - _Local debug builds_: `cd android && ./gradlew signingReport` → `Variant: debug` → `SHA1`.
    - _Play Store_: Play Console → **Setup → App integrity → App signing key certificate → SHA-1**. Google re-signs uploads with this key, so without it the store build shows a blank map.
- **API restrictions → Restrict key →** tick only **Maps SDK for Android**.

Restriction changes can take a few minutes to apply.

**2.3 Add the key and permissions to the app config**

`app.json`:

```jsonc
{
  "expo": {
    "android": {
      "package": "com.narvent.worker",
      "config": {
        "googleMaps": { "apiKey": "AIzaSy…your-key…" },
      },
      "permissions": ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
    },
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Narvent uses your location to show work near you.",
      },
    },
    "plugins": [
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Narvent uses your location to show work near you.",
        },
      ],
    ],
  },
}
```

**Keep the key out of git** by switching to `app.config.ts` and reading it from the environment:

```ts
// app.config.ts
import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name!,
  slug: config.slug!,
  android: {
    ...config.android,
    config: { googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_KEY } },
  },
});
```

```sh
# .env (git-ignored)  —  or: eas secret:create --name GOOGLE_MAPS_ANDROID_KEY --value AIza…
GOOGLE_MAPS_ANDROID_KEY=AIzaSy…
```

⚠️ Don't write `"process.env.GOOGLE_MAPS_API_KEY"` inside **app.json**. JSON isn't evaluated, so that literal string ends up in `AndroidManifest.xml` and you get a blank map. Environment variables only work in `app.config.ts` / `app.config.js`.

Rebuild after any key change (§1). The key is baked into the native manifest.

**2.4 Check it works**

- Android shows lavender land, white roads and no POI icons: the key and `MAP_STYLE` are working.
- A **grey or blank map with a Google logo** usually means one of these, in order of likelihood:
  1. the SHA-1 or package name in the restriction doesn't match the build you're running;
  2. Maps SDK for Android isn't enabled;
  3. there's no billing account;
  4. you're running an old binary built before the key was added.

  Run `adb logcat | grep -i "Google Maps"`. "Authorization failure" points to the restriction.

---

## 3. Put the folder in place

```
your-app/
  app/
    (tabs)/
      _layout.tsx        ← replace (step 5)
      index.tsx
      discover.tsx       ← new (step 4)
      profile.tsx
  expo-discover/         ← new: copy this folder (you can leave app-files/ out)
  expo-my-profile/
  expo-profile-v2/
  expo-worker-home/
  TabOverlay.tsx
  tabTransition.ts
  SwipeTabs.tsx          ← replace (step 6)
```

`expo-discover` is self-contained: it has its own theme, icons and gradient, and doesn't import from the other export folders. The imports in `app-files/` assume the layout above. Fix the relative paths if your folders live elsewhere.

## 4. Add the tab: `app/(tabs)/discover.tsx`

Copy `app-files/(tabs)/discover.tsx`. The important props:

```tsx
<DiscoverFlow
  jobs={jobs ?? []}
  loading={jobs === undefined}
  hideTabBar // the layout draws the shared bar
  onOverlayChange={setOverlay} // hides the bar while the job sheet is open
  initialBookings={bookings}
  getAvailability={(job, day) => api.getSlots(job.id, day.key)}
  onBook={(b) => api.bookSlot(b)}
/>
```

To see the design with mock data first, render `<DiscoverFlow hideTabBar onOverlayChange={setOverlay} />` with no `jobs`. It then uses `SAMPLE_JOBS` and a fixed Ernakulam location, and doesn't ask for location permission.

The screen is **not** wrapped in `<SwipeTabs>`. Horizontal drags belong to the map and the carousel here.

## 5. Replace the layout: `app/(tabs)/_layout.tsx`

Copy `app-files/(tabs)/_layout.tsx`. Compared with the current two-tab file, it changes three things:

| Change                                                                 | Why                                                                                      |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `import {TabBar, Tab} from '../../expo-discover'`                      | the three-tab bar replaces `expo-my-profile`'s two-tab one                               |
| `ROUTE` / `TAB` maps (`home ⇄ index`, `discover`, `profile`)           | translate between tab ids and route names, instead of the old `profile ? … : home` check |
| `<Tabs.Screen name="discover" />` placed between `index` and `profile` | route order matches bar order, so `tabTransition` slides the right way                   |

Nothing else changes: `lazy: false`, the transparent `sceneStyle`, the overlay hiding and reduce-motion handling are the same. `tabTransition.ts` is progress-based and works with three tabs as-is.

`ProfileFlow` and `WorkerHomeFlow` keep using `hideTabBar`, so the shared bar is the only one on screen. Only change their imports if they render the old `TabBar` themselves outside the layout.

## 6. Replace `SwipeTabs.tsx`

Copy `app-files/SwipeTabs.tsx`. The only change is:

```diff
- const ORDER = ['index', 'profile'] as const;
+ const ORDER = ['index', 'discover', 'profile'] as const;
```

A swipe on Home or Profile now lands on Discover. Leaving Discover is done with the tab bar.

---

## 7. Data: your API → `Job`

```ts
type Job = {
  id: string;
  trade: "Electrical" | "Plumbing" | "Carpentry" | "Painting" | "Helper";
  title: string; // "Rewire 2BHK flat"
  area: string; // "Kadavanthra"  (card + sheet)
  city?: string; // "Kochi"        (sheet)
  coordinate: { latitude: number; longitude: number }; // approximate — see note
  pay: number; // rupees, 2400 → "₹2,400"
  payUnit: "fixed" | "per day" | "per hour";
  when: string; // "Today · 2–6 PM"  (card chip)
  urgent?: boolean; // red dot on marker + "Urgent" chip
  slotsNote?: string; // "3 of 4 slots open"
  duration: string; // "4 hrs"
  description: string;
  requirements: string[]; // chips under the description
  client: { name: string; rating: number; jobsPosted: number };
};
```

`toJob()` in `app-files/(tabs)/discover.tsx` shows the mapping for a typical snake_case API.

**Privacy:** the sheet says "Exact address shared after the client confirms". Send a **rounded or offset coordinate** for unconfirmed jobs (for example, rounded to 3 decimals ≈ 100 m) and only reveal the precise address after confirmation.

**Trades:** to add one, extend `Trade` in `types.ts`, add an icon path to `TRADE_ICON` in `components/icons.tsx`, and add it to `TRADE_FILTERS` in `components/TradeChips.tsx`.

**Loading area:** jobs are passed in all at once. To load by visible area, add `onRegionChangeComplete` to `JobMap` and refetch with the region's bounds (see §11).

## 8. Booking and availability

| Prop              | Signature                                         | Default                                                           |
| ----------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `getAvailability` | `(job, day) => TimeSlot[] \| Promise<TimeSlot[]>` | `demoAvailability`: a fixed "Full" pattern, plus past times today |
| `onBook`          | `(booking, job) => void \| Promise<void>`         | none (local state only)                                           |
| `initialBookings` | `Record<jobId, Booking>`                          | `{}`                                                              |

- `day.key` is `YYYY-MM-DD` in local time. `TimeSlot.time` is the display string (`"10:00 AM"`). If your API uses 24-hour times, map both ways in `getAvailability` / `onBook`.
- `Booking` = `{jobId, date: 'YYYY-MM-DD', time: '10:00 AM', label: 'Tmrw, 10:00 AM'}`.
- While `onBook` is pending, the button shows a spinner. **If it throws**, a "Couldn’t book that slot" toast appears and the picker stays open, for example when the slot was taken in the meantime. Throw on a 409 and refresh availability.
- Opening a job that's already in `bookings` goes straight to the confirmation. **Change slot** returns to the picker.
- Days shown: today plus the next 5 (`SHEET_DAYS` in `DiscoverFlow.tsx`). Default times are in `DEFAULT_TIMES` (`utils/slots.ts`).

## 9. Directions

**Directions** opens Apple Maps on iOS (`maps://?daddr=`) or Google Maps navigation on Android (`google.navigation:q=`), with `https://www.google.com/maps/dir/` as the fallback. Pass `onDirections={job => …}` to change this, for example to show a "share address after confirmation" message for unconfirmed jobs.

If `Linking.canOpenURL('maps://')` returns false on iOS, add the scheme to `app.json` → `ios.infoPlist.LSApplicationQueriesSchemes: ["maps"]`. The web fallback works either way.

## 10. Fonts

Same as the other exports: load DM Sans with `expo-font`, then fill `FAMILY` in `components/theme.ts`, or import `FAMILY` from the package and assign at startup:

```ts
import { FAMILY } from "./expo-discover";
FAMILY["400"] = "DMSans_400Regular";
FAMILY["500"] = "DMSans_500Medium";
FAMILY["600"] = "DMSans_600SemiBold";
FAMILY["700"] = "DMSans_700Bold";
```

## 11. Customising

| What                                    | Where                                                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Starting zoom (≈5 km tall)              | `regionAround(center, 0.045)` in `DiscoverFlow.tsx`                                                                          |
| Android map colours                     | `mapStyle.ts` (Google style JSON; [styling wizard](https://mapstyle.withgoogle.com/) output pastes in directly)              |
| iOS map look                            | `mapType="mutedStandard"` + lavender wash in `JobMap.tsx`. Apple Maps can't take a style JSON                                |
| How far above centre a focused pin sits | computed `focusOffset` in `DiscoverFlow.tsx` (half of carousel height minus header height)                                   |
| Ripple speed / size                     | `DURATION`, `SIZE` in `UserLocationMarker.tsx`                                                                               |
| Card width                              | `SIDE` (24 px gutters) in `JobCarousel.tsx`                                                                                  |
| Refetch on pan                          | add `onRegionChangeComplete={r => onRegion?.(r)}` to the `MapView` in `JobMap.tsx`, then pass `onRegion` from `DiscoverFlow` |

## 12. Notes and limits

- **Marker performance (Android):** custom-view markers are bitmaps. `JobMarker` turns `tracksViewChanges` on for 600 ms after a selection change, then off. Don't leave it on for every marker.
- **User ripple on Android:** it animates because `UserLocationMarker` keeps `tracksViewChanges` on (one marker, so it's cheap). If a low-end device struggles, swap it for `showsUserLocation` on `MapView` and remove the marker.
- **Many jobs:** past roughly 50–80 markers, add clustering (e.g. `react-native-map-clustering` wrapping `MapView`) or fetch by region.
- **Location denied:** pass `fallbackLocation` (e.g. the worker's saved address). The map centres there, distances are measured from it, and the locate button jumps back to it. With no location at all, distances show "—" and the locate button is hidden.
- **Tab bar during the sheet:** `onOverlayChange(true)` hides the layout's bar while the job sheet is open, the same pattern Profile v2 uses.
- **Swipe between tabs:** this is turned off on Discover on purpose (§4, §6).
