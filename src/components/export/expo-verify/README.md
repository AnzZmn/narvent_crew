# Narvent Verify Number — Expo iOS glass (StyleSheet, no NativeWind)

```
VerifyNumberIOS.tsx   iPhone SE 375×667 / iPhone 15·16 393×852
assets/arrow-texture.png
```

## Install

```sh
npx expo install expo-blur react-native-svg react-native-safe-area-context
```

Wrap the app root in `SafeAreaProvider`.

## Use

```tsx
import VerifyNumberIOS from './expo-verify/VerifyNumberIOS';

<VerifyNumberIOS
  phone="+91 91234 56789"
  onBack={() => router.back()}
  onSubmit={async code => { await api.verifyOtp(code); router.replace('/setup-profile'); }}
  onResend={() => api.sendOtp()}
/>
```

To switch by platform alongside the Android export:

```tsx
const VerifyNumber = Platform.OS === 'ios' ? VerifyNumberIOS : VerifyNumberAndroid;
```

## Behaviour

- One hidden input drives six frosted cells. `textContentType="oneTimeCode"` lets the "From Messages" keyboard suggestion fill all six.
- **Submit** is solid light purple and disabled until six digits are in. It shows "Verifying…" while `onSubmit` runs.
- Resend has a 30-second cooldown. Resending clears the code and refocuses the input.
- Sizing comes from the height left after safe-area insets. The SE (usable < 640) gets tighter gaps. With the keyboard up, the gaps shrink further so Submit and Resend stay visible.
- The Submit button uses the same build as the Login and Setup Profile fixes.
