# Narvent Log in — Expo, Android (StyleSheet)

```
LoginAndroid.tsx
assets/arrow-texture.png        360×800 tile rendered at 3x
assets/login-illustration.png
```

## Install

```sh
npx expo install react-native-svg react-native-safe-area-context
```

Wrap the app root in `SafeAreaProvider`. You don't need an SVG transformer because the arrow texture ships as a PNG.

## Use

```tsx
import LoginAndroid from './LoginAndroid';

<LoginAndroid onRequestOtp={phone => router.push({pathname: '/otp', params: {phone}})} />
```

## Android S (360×800) / Android L (412×915)

The component has no fixed artboard. Offsets come from `useWindowDimensions()` using the mockup's rules:

- title 7% of height from the top
- card insets 3.4% of width and 6.6% of height
- badge 23% of width, capped at 96

The texture repeats at its 360×800 size. Content sits inside the safe-area insets. At 412×915 the card grows, and the field and button stay at 46pt tall.
