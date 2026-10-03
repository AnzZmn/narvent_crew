# Carousel tab transition

Home ⇄ Profile switch: the incoming tab slides in from its side while the outgoing tab slides out the other side, both moving together. Raw `StyleSheet`, no NativeWind. Transform only, on the native driver.

## Requirements

- `expo-router` with `@react-navigation/bottom-tabs` v7+ (needs `animation`, `transitionSpec`, `sceneStyleInterpolator`).
- Nothing else to install.

## Install

Copy `CarouselTabTransition.tsx` to `components/tabs/CarouselTabTransition.tsx` (outside `app/`, so expo-router doesn't treat it as a route).

## Plug into `(tabs)/_layout.tsx`

This replaces the old `tabTransition` import, which was never applied.

```tsx
import {Tabs} from 'expo-router';
import {useCarouselTabTransition} from '@/components/tabs/CarouselTabTransition';

export default function TabsLayout() {
  const transition = useCarouselTabTransition(); // 380 ms by default

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,          // both tabs mounted, so the first switch slides instead of popping in
        ...transition,
      }}
      // keep your existing tabBar={...} / overlay providers as they are
    >
      <Tabs.Screen name="index" />    {/* Home: left */}
      <Tabs.Screen name="profile" />  {/* Profile: right */}
    </Tabs>
  );
}
```

Direction comes from screen order. Home must be declared before Profile, so Profile enters from the right and Home exits to the left. Switching back runs in reverse.

The Switch Tab button doesn't need to change. Any `router.navigate('/profile')`, `navigation.navigate('profile')` or tab-bar press runs the carousel.

Custom duration: `useCarouselTabTransition(320)`.

## Optional: `index.tsx` / `profile.tsx`

If either screen has a transparent root, the seam between the two scenes shows mid-slide. Wrap the content:

```tsx
import {CarouselScene} from '@/components/tabs/CarouselTabTransition';

export default function HomeTab() {
  return (
    <CarouselScene background="#F4F4F2">
      {/* existing SettingsCarousel / TabLoadGate tree */}
    </CarouselScene>
  );
}
```

`CarouselScene` only adds an opaque `flex: 1` background, so it doesn't affect `SettingsCarousel`.

## Notes

- **Reduce Motion:** the hook switches to a 180 ms cross-fade automatically.
- **Rotation / split view:** slide distance follows `useWindowDimensions().width`.
- **Settings carousel:** `SettingsCarousel` animates inside the Home scene and doesn't conflict. Keep tab switching blocked while Settings is open, as `SwipeTabs` already does via `useTabOverlayOpen()`.
- **Non-hook use:** `carouselTabTransition(width, duration)` returns the same options object.
