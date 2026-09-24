# Narvent Setup Profile — Expo, Android (StyleSheet)

```
SetupProfileAndroid.tsx
assets/arrow-texture.png
```

## Install

```sh
npx expo install react-native-svg react-native-safe-area-context \
  expo-image-picker @react-native-community/datetimepicker
```

Wrap the app root in `SafeAreaProvider`. `expo-image-picker` asks for photo library access on first use.

## Use

```tsx
import SetupProfileAndroid, {ProfileData} from './SetupProfileAndroid';

<SetupProfileAndroid
  onBack={() => router.back()}
  onSubmit={async (data: ProfileData) => {
    await api.saveProfile(data);
    router.replace('/home');
  }}
/>
```

`onSubmit` receives `{photoUri, firstName, dob /* yyyy-mm-dd */, aadhar /* 12 digits */, aadharCardUri}`.

## Steps

1. **Photo + First Name.** Tap the avatar to pick a square-cropped photo. The pencil badge sits on the avatar as in the mockup. The name needs at least 2 characters.
2. **DOB.** Type it and it formats as `DD/MM/YYYY`. The calendar icon opens the native Android date dialog. The date must exist and the person must be 18–100.
3. **Aadhar Number.** Groups as `0000 0000 0000` while you type. It must be 12 digits and can't start with 0 or 1.
4. **Upload Aadhar card.** The dashed drop zone opens the image picker with an ID-card crop. It then shows a preview with "Tap to replace".

- **Next:** stays disabled until the current step is valid.
- **Submit:** replaces Next on the last step and shows "Saving…" while `onSubmit` runs.
- **Back:** steps backwards, and calls `onBack` from step 1.
- **Progress bar:** animates on the mockup's curve, `cubic-bezier(.2,.8,.2,1)` over 300 ms.

## Android S (360×800) / Android L (412×915)

The screen doesn't scroll on either size. Offsets follow the mockup's rules and come from `useWindowDimensions()`:

- header offset: 6.4% of height
- side insets: 3.4% of width
- card gap: 2.4% of height
- card padding: 4.6% / 3.4% of height
- block gap: 2.4% of height
- avatar: 33% of width, max 124
- drop zone: at least 22% of height

Inputs stay 52 pt tall and the button 48 pt.
