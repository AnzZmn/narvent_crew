# Narvent tabs: expo-router

The Home ↔ Profile tab bar, rendered once for both tabs.

```
app/(tabs)/_layout.tsx   Tabs navigator + shared TabBar
app/(tabs)/index.tsx     Home tab    → WorkerHomeFlow
app/(tabs)/profile.tsx   Profile tab → MyProfileFlow
TabOverlay.tsx           hides the bar while a detail screen is open
tabTransition.ts         Home ⇄ Profile fade-through slide
SwipeTabs.tsx            swipe left/right to switch tabs
```

Each tab loads its data through `expo-tab-loading` (`useTabData` + `TabLoadGate`) and shows `HomeSkeleton` / `ProfileSkeleton` until it arrives. See `expo-tab-loading/README.md`.

Put `TabOverlay.tsx`, `tabTransition.ts`, `expo-tab-loading/`, `expo-worker-home/` and `expo-my-profile/` next to `app/` (or fix the import paths).

## Why `router.push` in `onTabChange` lagged

- Every `push` added a new screen to the stack. It mounted a whole new page (blur views, SVGs, QR images) on every tap, and the stack kept growing.
- Each screen had its own tab bar. The highlight spring started on the old screen, then the new screen replaced it mid-animation and showed a new bar that started from scratch.

## What this setup changes

- Both tabs stay mounted (`lazy: false`), so switching only toggles visibility.
- One `TabBar` lives in the layout, so its spring runs uninterrupted.
- `hideTabBar` stops the flows drawing their own bar.
- `onOverlayChange` hides the shared bar while a detail screen or Settings is open.

If you keep your own stack instead, use `router.navigate('/profile')` rather than `push`. It reuses the existing screen instead of stacking a new one.

## Swipe between tabs

`SwipeTabs` wraps each tab screen. Swipe left on Home → Profile, swipe right on Profile → Home. A swipe counts at 60px of travel or a quick flick (500px/s), and it runs the same transition as tapping the bar.

- Only horizontal drags are claimed (`activeOffsetX ±20`, `failOffsetY ±14`), so vertical scrolling is unaffected.
- Swiping is off while a detail or Settings screen is open.
- Needs `react-native-gesture-handler` and `react-native-reanimated` (`npx expo install` both), and the root layout wrapped in `<GestureHandlerRootView style={{flex: 1}}>`.
- Horizontal scroll views inside a tab still scroll; the swipe only fires where nothing else claims the drag.
