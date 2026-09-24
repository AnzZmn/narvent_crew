# Narvent Log in — Expo (StyleSheet, no NativeWind)

```
index.ts            Platform switch (iOS → glass, Android → flat)
LoginAndroid.tsx    Android S 360×800 / Android L 412×915
LoginIOS.tsx        iPhone SE 375×667 / iPhone 15·16 393×852, glass UI
assets/arrow-texture.png
assets/login-illustration.png
```

## Install

```sh
npx expo install expo-blur react-native-svg react-native-safe-area-context
```

`expo-blur` is only used by the iOS file. Wrap the app root in `SafeAreaProvider`.

## Use

```tsx
import Login from './expo-login';

<Login
  onRequestOtp={async phone => {        // "+919876543210"
    await api.sendOtp(phone);
    router.push({pathname: '/verify', params: {phone}});
  }}
  onCountryPress={() => openCountrySheet()}
/>
```

Props: `onRequestOtp`, `onCountryPress`, `countryCode` (default `+91`), `countryLabel` (default `IN`).

## Behaviour (both)

- The number formats as `98765 43210` while typing. `+91` stays fixed before it.
- **OTP** stays disabled (solid light purple) until the number is 10 digits starting 6–9. It shows "Sending…" while `onRequestOtp` runs.
- `KeyboardAvoidingView` lifts the card. The illustration box is the flexible part, so it shrinks first and the button stays on screen.

## iOS glass

- The card, logo badge and phone field are `BlurView`s with a translucent white fill, a white hairline border and a 1 px top highlight. Lavender glows behind them give the blur colour.
- The field uses 16 pt text so iOS doesn't zoom. Title and button use SF sizes (17 pt).
- Sizing comes from the height left after safe-area insets. The **SE** (usable < 640) gets tighter gaps and a smaller badge. With the keyboard up, the badge drops to 64.
- No drawn home indicator; iOS draws its own.

## Android

- Flat white card and badge with elevation, an outlined field, and a ripple on the OTP button.
- Offsets follow the mockup rules: title at 7% of height, card gap 3.2%, side insets 3.4% of width, bottom inset 6.6%, badge 23% of width (72–96).

## Animated illustration

To use the Reanimated illustration instead of the PNG, replace the `<Image source={ILLUSTRATION} … />` with `<LoginIllustration />` from `export/reanimated/`.
