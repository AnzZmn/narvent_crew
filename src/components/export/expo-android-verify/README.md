# Narvent Verify Number — Expo, Android (StyleSheet)

```
VerifyNumberAndroid.tsx
assets/arrow-texture.png
```

## Install

```sh
npx expo install react-native-svg react-native-safe-area-context
```

Wrap the app root in `SafeAreaProvider`.

## Use

```tsx
import VerifyNumberAndroid from './VerifyNumberAndroid';

<VerifyNumberAndroid
  phone={params.phone}
  onBack={() => router.back()}
  onSubmit={async code => { await api.verify(params.phone, code); router.replace('/home'); }}
  onResend={() => api.sendOtp(params.phone)}
/>
```

## Behaviour

- One hidden numeric `TextInput` drives all six cells. `autoComplete="sms-otp"` lets Android fill the code from the SMS suggestion. Non-digits are stripped, and entry stops at 6 digits.
- Empty cells show the mockup's dot. The next cell to type into gets a purple outline. Tapping the row reopens the keyboard.
- Submit stays disabled until all six digits are in. While `onSubmit` runs, the button shows "Verifying…". A rejected promise is logged and the button re-enables.
- Resend has a 30 s cooldown with a live countdown. Pressing it clears the code.

## Android S (360×800) / Android L (412×915)

Offsets follow the mockup's rules and come from `useWindowDimensions()`:

- header: 6.4% of height
- side insets: 3.4% of width
- card gap: 3.2% of height
- card top padding: 5.6% of height
- cell row gap: 6.2% of height

The six cells use `flex: 1` + `aspectRatio: 1` with a 2.4% gap, so they stay square: about 38 pt on S and 44 pt on L. The button stays 46 pt tall.
