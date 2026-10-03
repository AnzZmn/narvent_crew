# Narvent Oval Tab Bar: Expo / React Native (StyleSheet only, no NativeWind)

This is the oval three-tab bar from section 11 of the design file: **Home · Discover · Profile**.

- **The bar is a true ellipse.** It is tallest in the middle and thins toward both ends.
- **The focused tab gets bigger.** An oval highlight sits behind it (66×54 in the middle, shrinking to 54×40 at the thinner ends), and its icon scales to 1.2×. The other icons drop to 0.9×.
- The highlight **springs** between tabs. Icons **cross-fade** from outline to filled as it passes.
- **iPhone (glass)**: translucent white oval, bright rim, clear-glass highlight, ink icon.
- **Android (flat)**: white oval with a hairline border, violet gradient highlight, white icon.

It's a single file, `TabBar.tsx`, with no imports from other Narvent folders. It contains the icons, gradients and styles, and every style is a plain `StyleSheet.create`. Animations use the built-in `Animated` API on the native driver, so there's no Reanimated dependency.

```
expo-oval-tabbar/
  TabBar.tsx    the component (default export) + Tab, TABS, TAB_BAR_WIDTH, TAB_BAR_HEIGHT
  README.md
```

---

## 1. Install

The only native dependency is `react-native-svg`, which is already in the project from the earlier exports:

```sh
npx expo install react-native-svg react-native-safe-area-context
```

Nothing else is needed, and it works in Expo Go.

## 2. API

```ts
import TabBar, {Tab, TABS, TAB_BAR_WIDTH, TAB_BAR_HEIGHT} from './TabBar';

type Tab = 'home' | 'discover' | 'profile';

<TabBar
  active="discover"                  // which tab is focused
  onChange={(tab: Tab) => …}         // tap handler
  bottom={insets.bottom + 14}        // px from the screen bottom
  variant="glass" | "flat"           // optional; default glass on iOS, flat on Android
  labels={{discover: 'Find work'}}   // optional screen-reader labels
/>
```

| Export | Value | Use |
|---|---|---|
| `TAB_BAR_WIDTH` | `224` | visible oval width |
| `TAB_BAR_HEIGHT` | `66` | visible oval height. Use it to keep content clear of the bar |
| `TABS` | `['home','discover','profile']` | slot order, left to right |

The component positions itself (`position: 'absolute'`, horizontally centred, `zIndex: 5`). It draws its own shadow, so it adds 24 px of invisible padding around the oval. The padding doesn't catch touches (`pointerEvents="box-none"`), and `bottom` refers to the **visible** oval's bottom edge.

---

## 3. Plug it in

Pick **one** of the two options.

### Option A: replace the bar inside `expo-discover` (recommended)

If you've added the Discover export, this is a one-file swap:

```
your-app/
  expo-discover/
    tabbar/
      TabBar.tsx      ← overwrite with expo-oval-tabbar/TabBar.tsx
      TabIcons.tsx    ← no longer used; delete it or leave it
```

That's all. The new file keeps the same export names (`default`, `Tab`, `TABS`, `TAB_BAR_WIDTH`, `TAB_BAR_HEIGHT`), so:

- `expo-discover/index.ts` keeps re-exporting `TabBar`, `Tab`, `TABS`, `TAB_BAR_HEIGHT` and `TAB_BAR_WIDTH`.
- `app/(tabs)/_layout.tsx` keeps `import {TabBar, Tab} from '../../expo-discover'`, with no change.
- `DiscoverFlow` places the job-card carousel `TAB_BAR_HEIGHT + 6` above the bar, so it moves up 8 px automatically for the taller oval.

**One edit is needed:** `index.ts` also re-exports the icons. Remove this line, or keep `TabIcons.tsx` in the folder:

```diff
- export {HomeIcon, DiscoverIcon, ProfileIcon} from './tabbar/TabIcons';
```

### Option B: standalone, without `expo-discover`

1. Copy `TabBar.tsx` to `components/TabBar.tsx` (or anywhere outside `app/`, so expo-router doesn't treat it as a route).
2. Make sure `app/(tabs)/discover.tsx` exists. Even a placeholder screen is enough.
3. Replace `app/(tabs)/_layout.tsx` with:

```tsx
import React, {useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';
import {Tabs} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TabBar, {Tab} from '../../components/TabBar';
import {TabOverlayContext, TabOverlayOpenContext} from '../../TabOverlay';
import {tabFade, tabTransition} from '../../tabTransition';

/** route name ⇄ tab id */
const ROUTE: Record<Tab, string> = {home: 'index', discover: 'discover', profile: 'profile'};
const TAB: Record<string, Tab> = {index: 'home', discover: 'discover', profile: 'profile'};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [overlay, setOverlay] = useState(false);
  const bottom = Math.max(insets.bottom, 10) + 14;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  return (
    <TabOverlayContext.Provider value={setOverlay}>
      <TabOverlayOpenContext.Provider value={overlay}>
        <Tabs
          backBehavior="history"
          screenOptions={{
            headerShown: false,
            lazy: false,
            ...(reduceMotion ? tabFade : tabTransition),
            sceneStyle: {backgroundColor: 'transparent'},
          }}
          tabBar={({state, navigation}) =>
            overlay ? null : (
              <TabBar
                active={TAB[state.routes[state.index].name] ?? 'home'}
                bottom={bottom}
                onChange={t => {
                  const name = ROUTE[t];
                  if (state.routes[state.index].name !== name) navigation.navigate(name);
                }}
              />
            )
          }>
          {/* order must match the bar: Home · Discover · Profile */}
          <Tabs.Screen name="index" />
          <Tabs.Screen name="discover" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </TabOverlayOpenContext.Provider>
    </TabOverlayContext.Provider>
  );
}
```

4. In `SwipeTabs.tsx`, add Discover to the swipe order:

```diff
- const ORDER = ['index', 'profile'] as const;
+ const ORDER = ['index', 'discover', 'profile'] as const;
```

Everything else stays the same: `lazy: false`, the overlay-hiding pattern (`onOverlayChange` → `setOverlay`), `tabTransition.ts` and reduce-motion handling. `tabTransition` is progress-based, so three tabs need no change.

## 4. Things that touch the bar

**Keeping content clear of the bar.** Anything pinned above it should sit at least `bottom + TAB_BAR_HEIGHT` from the screen bottom. The old bar was 58 px tall and this one is **66 px**, so check:

| Screen | What to check |
|---|---|
| Worker Home (`expo-worker-home`) | bottom padding of the scroll content and the chat FAB position. If they hard-code `58`, change it to `TAB_BAR_HEIGHT` |
| Profile v2 (`expo-profile-v2`) | `ScrollView` bottom padding (currently about 110 px, which is enough) |
| Discover (`expo-discover`) | automatic, via `TAB_BAR_HEIGHT` (Option A) |

**Screens that draw their own bar.** `ProfileFlow`, `WorkerHomeFlow` and `DiscoverFlow` are all rendered with `hideTabBar` in the tabs layout, so only the layout's bar is on screen. If you render any of them on its own (outside the tabs), replace its internal `TabBar` import with this file.

**Hiding while a page or sheet is open.** This is unchanged. The layout returns `null` while `overlay` is true.

## 5. Customising

All values are constants at the top of `TabBar.tsx`:

| Constant | Default | Effect |
|---|---|---|
| `TAB_BAR_WIDTH` / `TAB_BAR_HEIGHT` | 224 / 66 | oval size. Keep the width ≥ `3 × SLOT_W + 2 × SLOT_GAP + 20` |
| `SLOT_W`, `SLOT_GAP` | 60, 8 | touch-target width and spacing. `STEP` (the highlight's travel) follows from them |
| `IND_W`, `IND_H` | 66, 54 | highlight size on the middle tab |
| `END_SX`, `END_SY` | 54/66, 40/54 | highlight size on the end tabs, as a ratio of the middle size |
| `ICON_ON`, `ICON_OFF` | 1.2, 0.9 | focused and unfocused icon scale |
| `COLORS` | Narvent violet / ink | brand colours |
| spring `friction` / `tension` | 7 / 90 | highlight bounce |

**Reduce motion:** to drop the bounce for users who have it on, pass a flag and use `Animated.timing(x, {toValue: idx, duration: 1, useNativeDriver: true})` in place of the spring.

## 6. Optional: real blur on iOS

The glass oval is a translucent SVG fill, because React Native can't clip a `BlurView` to an ellipse on its own. For true background blur, install the masked-view package and wrap a `BlurView` in an ellipse mask:

```sh
npx expo install expo-blur @react-native-masked-view/masked-view
```

```tsx
import MaskedView from '@react-native-masked-view/masked-view';
import {BlurView} from 'expo-blur';
import Svg, {Ellipse} from 'react-native-svg';

// inside TabBar, as the first child of styles.bar:
{glass && (
  <MaskedView
    style={StyleSheet.absoluteFill}
    maskElement={<Svg width={W} height={H}><Ellipse cx={W / 2} cy={H / 2} rx={W / 2} ry={H / 2} fill="#000" /></Svg>}>
    <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
  </MaskedView>
)}
```

Then lower the oval's fill opacity (the `bd` gradient: `0.72 → 0.48`) to about `0.45 → 0.25`, so the blur shows through.

## 7. Notes

- **Touch targets:** each slot is 60×48 with a 4 px `hitSlop`, which is above the 44 px minimum.
- **Accessibility:** the container has `accessibilityRole="tablist"`. Each slot is a `tab` with `accessibilityState.selected`, labelled "Home", "Discover work" and "Profile" (override with `labels`).
- **Android shadow:** `elevation` can't follow an SVG shape, so the shadow is drawn as a soft radial-gradient ellipse inside the component. It looks the same on both platforms and needs no `elevation`.
