# Narvent My Profile: Expo (StyleSheet, no NativeWind)

One file per component. iOS renders frosted glass. Android renders flat. Card, photo and QR sizes scale from iPhone SE (375) and Android S (360) up to iPhone 15/16 (393) and Android L (412).

```
index.ts
MyProfile.tsx              the scrolling profile screen
MyProfileFlow.tsx          profile + Settings + tab bar (no nav library needed)
types.ts                   data shapes + mockup sample data
details/
  PaymentSettings.tsx      "Settings": editable Account No, IFSC, Account Name, UPI ID
components/
  theme.ts  icons.tsx  ProfileIcons.tsx  GradientFill.tsx
  ProfileBackground.tsx  Panel.tsx  DetailHeader.tsx  TabBar.tsx
  IdCard.tsx  Avatar.tsx  CompletionBar.tsx
  RateQrCard.tsx
  Field.tsx  FieldPair.tsx  SectionPill.tsx  PersonalFields.tsx  AddressSection.tsx
  PaymentDetailsCard.tsx  EditButton.tsx
  DocumentsCard.tsx  DocumentRow.tsx
  ReferEarn.tsx  ArchBackground.tsx  ReferButton.tsx
assets/
  qr-purple.png  qr-yellow.png  narvent-mark.png
```

## Install

```sh
npx expo install expo-blur react-native-svg react-native-safe-area-context
```

Wrap the app root in `SafeAreaProvider`.

## Use

```tsx
import {MyProfileFlow} from './expo-my-profile';

<MyProfileFlow
  data={profile}                             // optional, defaults to mockup data
  rateQr={{uri: profile.rateQrUrl}}
  referQr={{uri: profile.referQrUrl}}
  onEditPhoto={pickPhoto}
  onSelectCity={which => openCityPicker(which)}
  onUploadDocument={doc => pickDocument(doc.id)}
  onSaveBank={bank => api.updateBank(bank)}
  onShareLink={() => Share.share({message: referUrl})}
  onCopyLink={() => Clipboard.setStringAsync(referUrl)}
  onKnowMore={openReferInfo}
  onTabChange={t => t === 'home' && router.push('/')}
/>
```

With a router, render `MyProfile` and `PaymentSettings` as separate routes. `MyProfile` takes `onEditPayment`, and `PaymentSettings` returns the edited values through `onBack(bank)`. Pass `variant="glass" | "flat"` to force a look.

## Notes

- **Fields** show read-only text on the profile. They become `TextInput`s when `onChangeText` is passed, as in Settings. City is a pressable select that calls `onSelectCity`.
- **Arch**: RN can't draw CSS elliptical corners, so `ArchBackground` draws the Refer & Earn top curve as an SVG path.
- **QR codes** are the mockup placeholders rasterised to PNG. They won't scan. Pass the real codes as `rateQr` / `referQr`.
- **Tab bar** is the same component as Worker Home. On profile, `ReferEarn` pads its bottom so the bar doesn't cover the buttons.
- The mockup's spellings ("Nasar" / "Nazar", "Aadhar") are kept in `types.ts`.
