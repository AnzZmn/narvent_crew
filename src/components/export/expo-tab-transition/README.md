# Tab Transition (Worker Home ⇄ My Profile)

Smooth tab change for an expo-router `Tabs` layout. Fade-through: the outgoing screen drifts 36px toward its tab and is fully faded by 40% of the transition; only then does the incoming screen fade and slide in from the other side. The two never overlap half-transparent, which avoids glass/BlurView cards flashing as empty frames. 320ms, `cubic-bezier(.22,.8,.26,1)`, native driver.

## What changed (v2)

**Bug fixed:** switching Profile → Home left a ghost "skeleton" of the previous screen on screen during, and briefly after, the transition.

**Cause:** v1 was a crossfade — both screens were half-transparent at the same time. Glass cards (`BlurView` / backdrop blur) don't render correctly inside a translucent parent, so the outgoing screen's cards showed as empty outlined frames on top of the incoming screen.

**Fix:** fade-through instead of crossfade.

- Opacity curve changed from `[-1, 0, 1] → [0, 1, 0]` to `[-1, -0.6, 0, 0.6, 1] → [0, 0, 1, 0, 0]` with `extrapolate: 'clamp'`. The outgoing screen is fully invisible by 40% of the transition; the incoming screen only begins after that. They never overlap.
- `fade` mode now uses the same fade-through curve (v1 used the built-in crossfade, which had the same ghosting).
- Usage example now sets an opaque `sceneStyle.backgroundColor` (v1 used `transparent`), since that colour is visible during the handoff.
- Unchanged: 320ms duration, `cubic-bezier(.22,.8,.26,1)`, 36px drift, 0.985 scale, Reduce Motion fallback, API (`useTabTransition`, `makeTabTransition`).

## Requirements

- Expo SDK 52+ (expo-router 4+, `@react-navigation/bottom-tabs` 7+ — `animation`, `transitionSpec` and `sceneStyleInterpolator` were added in v7)
- No extra packages

## Install

Copy `TabTransition.tsx` anywhere **outside** `app/` (files in `app/` become routes), e.g. the project root.

## Usage

`app/(tabs)/_layout.tsx`:

```tsx
import {Tabs} from 'expo-router';
import {useTabTransition} from '../../TabTransition';

export default function TabsLayout() {
  const transition = useTabTransition('slide'); // 'slide' | 'fade' | 'none'

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false, // keep both tabs mounted so the first switch is instant
        sceneStyle: {backgroundColor: '#F3F0FF'}, // shown between the two screens
        ...transition,
      }}>
      <Tabs.Screen name="index" />   {/* Home — must be first (left) */}
      <Tabs.Screen name="profile" /> {/* Profile — second (right) */}
    </Tabs>
  );
}
```

Works with a custom `tabBar` (e.g. the Narvent `TabBar`) — the animation is on the scenes, not the bar. Call `navigation.navigate(name)` from the bar as usual.

## Options

```tsx
useTabTransition('slide', {duration: 320, drift: 36, scale: 0.985});
```

- `duration` — ms. Fade uses 70% of this.
- `drift` — horizontal offset in px of the off-screen tab.
- `scale` — scale of the off-screen tab.

Non-hook version (no Reduce Motion check): `makeTabTransition(mode, opts)`.

## Accessibility

`useTabTransition` listens to the OS Reduce Motion setting and swaps `slide` for a short fade while it's on.

## Notes

- Direction follows tab order: screens to the left of the focused tab sit at `-drift`, screens to the right at `+drift`. Adding more tabs keeps working.
- `sceneStyle.backgroundColor` is what shows for a split second between the two screens — match it to your screen background (Android flat: `#F6F5FC`).
- If the tab bar hides for detail screens (`onOverlayChange`), nothing changes here — the transition only runs between tabs.
