# Tab Loading (Worker Home & My Profile)

Loading layouts for the two tabs plus the logic that shows them while each tab's data loads. Built to sit on top of `expo-tab-transition`: the tab slides in, shows its skeleton, then swaps to content.

```
expo-tab-loading/
  Shimmer.tsx          ShimmerProvider (one shared loop) + <Bone>
  HomeSkeleton.tsx     Worker Home loading layout
  ProfileSkeleton.tsx  My Profile loading layout
  TabLoadGate.tsx      skeleton ⇄ content switch for one tab
  useTabData.ts        fetch + loading state, focus-aware
  index.ts
```

## What's in the loading layouts

Anything that doesn't depend on data renders right away: status bar, header pill and menu icon, screen title and back arrow, section titles (Statistics, Ongoing Work, Payments), form labels, field boxes, and the tab bar from the layout. Only data is shown as shimmering bones, and each bone is sized like the real content, so nothing jumps when data arrives.

- iOS: glass cards (`BlurView`) on the lavender gradient, violet-tint bones with a white sweep.
- Android: flat white cards, `#ECE9F7` bones.
- One shimmer loop per screen (1.5s, native driver), so all bones sweep together.
- Reduce Motion on → bones are static.
- Screen readers get a single "Loading home" / "Loading profile" element with `busy: true`.

## Requirements

- Expo SDK 52+, expo-router
- `expo-blur`, `react-native-svg`, `react-native-safe-area-context` (already used by Worker Home / My Profile)
- Folder layout: `expo-tab-loading/`, `expo-worker-home/`, `expo-my-profile/` and `TabOverlay.tsx` next to `app/`. The skeletons import `Surface`, `Background`, `ProfileBackground`, `DetailHeader` and theme colours from those folders.

## Usage

`app/(tabs)/index.tsx`:

```tsx
import {WorkerHomeFlow, sampleWorkerHome, WorkerHomeData} from '../../expo-worker-home';
import {HomeSkeleton, TabLoadGate, useTabData} from '../../expo-tab-loading';
import {useTabOverlay} from '../../TabOverlay';

const fetchHome = (): Promise<WorkerHomeData> => api.get('/worker/home'); // your API

export default function HomeTab() {
  const setOverlay = useTabOverlay();
  const {data, loading, ready} = useTabData(fetchHome, {refetchOnFocus: true});
  return (
    <TabLoadGate loading={loading} ready={ready} skeleton={<HomeSkeleton />}>
      {data && <WorkerHomeFlow home={data} hideTabBar onOverlayChange={setOverlay} />}
    </TabLoadGate>
  );
}
```

`app/(tabs)/profile.tsx` is the same with `ProfileSkeleton`, `MyProfileFlow data={data}` and your profile fetcher. Both files are already updated in `expo-tabs/` with a 700ms fake fetch; replace `fetchHome` / `fetchProfile` with real calls.

`_layout.tsx` doesn't change: keep `lazy: false` and the tab transition.

## Options

`useTabData(fetcher, options)`

- `load: 'mount' | 'focus'` (default `'mount'`). `'mount'` starts fetching at app start. With `lazy: false` Profile loads in the background, so it's usually ready before the first switch. `'focus'` waits until the tab is first opened, so the skeleton always shows on the first visit.
- `refetchOnFocus` (default `false`). Refetch every time the tab is opened again. Old content stays mounted underneath (scroll position is kept) and the skeleton covers it until new data arrives.
- Returns `{data, loading, ready, error, refresh}`. Responses that arrive after a newer request are dropped.

`<TabLoadGate>`

- `delay` (default 120ms): on refetch, wait this long before showing the skeleton, so fast responses don't flash it. The first load shows it immediately.
- `minDuration` (default 450ms): once the skeleton is shown, keep it at least this long so it doesn't blink.

Matching the design's "Every switch" demo: `refetchOnFocus: true`. "First visit": `load: 'focus'`, `refetchOnFocus: false`.

## Using bones elsewhere

```tsx
<ShimmerProvider glass={Platform.OS === 'ios'}>
  <Bone width="60%" height={12} />
  <Bone width={48} aspectRatio={1} radius={999} />
</ShimmerProvider>
```

## Notes

- Skeleton → content is an instant swap, with no crossfade. Fading glass cards (`BlurView`) through partial opacity is what caused the ghost "skeleton" frames during tab switches (fixed in `expo-tab-transition` v2), so this avoids it too.
- The skeletons don't draw a tab bar. The shared bar in `_layout.tsx` stays on top and keeps working while a tab loads.
- Errors: `error` is returned but not rendered. Show your own retry view when `error && !ready`.
