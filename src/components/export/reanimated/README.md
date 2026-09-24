# LoginIllustration — Reanimated

This is a React Native version of the animated OTP illustration on the Log in card.

## Install (Expo)

```sh
npx expo install react-native-reanimated react-native-svg
```

In `babel.config.js`, add `'react-native-reanimated/plugin'` as the **last** plugin, then restart Metro with `-c`.

## Use

In `LoginAndroid.tsx` / `LoginIOS.tsx`, replace the `<Image source={ILLUSTRATION} … />` inside the illustration box with:

```tsx
import LoginIllustration from './LoginIllustration';

<LoginIllustration />
```

The illustration keeps its 300:230 ratio and fills the width of its container. Its height is capped by the parent.

## How it's built

- A single shared value runs linearly from 0 to 144 s and repeats. 144 s is the least common multiple of every loop, so the loops stay in phase indefinitely:
  - hill: 16 s
  - phone float: 8 s
  - OTP sequence, minute hand, trend arrow: 6 s
  - sparkles: 3 s
  - bulb: 2.4 s
  - typing dots: 1.2 s
  - hour hand: 72 s
- Every animation reads that value on the UI thread through `useAnimatedProps`. Nothing re-renders in JS.
- Only plain SVG attributes are animated: `r`, `cy`, `x2/y2`, `d`, `opacity`, `fill` and `strokeDashoffset`. These scale and pop without animated SVG transforms, which are unreliable in react-native-svg.
- The phone float is the one transform. It's applied to a native `Animated.View` that holds the phone layer.
- Delayed loops hold their first keyframe until they start, which matches CSS `animation-fill-mode: both`.
- `useReducedMotion()` freezes the scene on a fully revealed frame: all four dots, the check and the drawn arrow.
