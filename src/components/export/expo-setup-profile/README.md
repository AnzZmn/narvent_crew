# Narvent Setup Profile — Expo (StyleSheet, no NativeWind)

```
index.ts                 Platform switch (iOS → glass, Android → flat)
SetupProfileAndroid.tsx  Android S 360×800 / Android L 412×915
SetupProfileIOS.tsx      iPhone SE 375×667 / iPhone 15·16 393×852, glass UI
assets/arrow-texture.png
```

## Install

```sh
npx expo install expo-blur react-native-svg react-native-safe-area-context \
  expo-image-picker @react-native-community/datetimepicker
```

Wrap the app root in `SafeAreaProvider`.

## Use

```tsx
import SetupProfile, {ProfileData} from './expo-setup-profile';

<SetupProfile
  onBack={() => router.back()}
  onSubmit={async (data: ProfileData) => {
    await api.saveProfile(data);
    router.replace('/home');
  }}
/>
```

Both files share the same props, steps and validation (name ≥ 2 chars, DOB real and 18–100, Aadhar 12 digits not starting 0/1, card image required).

## iOS glass

- Card, back button, inputs and drop zone are `BlurView`s with a translucent white fill, a white hairline border and a 1 px top highlight. Lavender glow blobs sit behind them so the blur has colour to pick up.
- The calendar icon opens a frosted bottom sheet with the native spinner (Cancel / Done). Date bounds match the typed validation.
- Inputs use 16 pt text so iOS doesn't zoom, and SF sizes throughout (17 pt title/button).
- No drawn home indicator; iOS draws its own.

## Sizing

Offsets are computed from the height left after safe-area insets:

- **iPhone SE** (usable < 640): tighter padding, avatar max 104, drop zone 20% of usable height.
- **iPhone 15/16**: mockup proportions, avatar max 124, drop zone 22%.
- **Keyboard up**: `KeyboardAvoidingView` lifts the card, the avatar drops to 76 and gaps tighten, so Next stays visible on the SE.

Android sizing is unchanged from the earlier export (see comments in `SetupProfileAndroid.tsx`).
