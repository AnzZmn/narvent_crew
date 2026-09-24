# Narvent Log in — React Native (iOS glass / Android flat)

```
login/
  index.ts          platform switch (default export)
  LoginIOS.tsx      frosted glass surfaces (BlurView)
  LoginAndroid.tsx  opaque Material surfaces (elevation + ripple)
  LoginShared.tsx   texture ground, badge mark, phone row, fluid metrics
../assets/
  arrow-texture.svg
  login-illustration.png
```

## Install

```sh
npm i nativewind react-native-svg react-native-safe-area-context expo-blur
npm i -D react-native-svg-transformer tailwindcss@3
cd ios && pod install
```

Not on Expo? Swap `expo-blur` for `@react-native-community/blur` and change the import in `LoginIOS.tsx` (`BlurView` with `blurType="light" blurAmount={22}`).

`metro.config.js` must route SVG through the transformer:

```js
const {getDefaultConfig} = require('metro-config');
module.exports = (async () => {
  const {resolver, transformer} = await getDefaultConfig();
  return {
    transformer: {babelTransformerPath: require.resolve('react-native-svg-transformer')},
    resolver: {
      assetExts: resolver.assetExts.filter(e => e !== 'svg'),
      sourceExts: [...resolver.sourceExts, 'svg'],
    },
  };
})();
```

Add `declare module '*.svg'` to your `.d.ts` if TypeScript complains.

## Use

```tsx
import Login from './login';

<Login onRequestOtp={phone => navigation.navigate('Otp', {phone})} />
```

`onRequestOtp` receives the full number including the country code. Force a variant with `import {LoginIOS} from './login'`.

## What differs between the two

| | iPhone | Android |
|---|---|---|
| card | BlurView, translucent white, hairline border | opaque white, elevation 6 |
| phone field | frosted, inner highlight | white, 1px `#E4E1F5` border |
| OTP button | translucent gradient-toned purple, press state | solid `#7D69FF`, ripple |
| badge | frosted, 24% radius | white, 22% radius, elevation 8 |
| ground wash | white radial + purple tint, texture at 0.9 | white radial only, texture at 0.55 |
| bottom bar | dark home indicator | grey gesture bar |

Layout, type scale, spacing and the illustration are identical.

## Device compatibility

All spacing comes from `useLoginMetrics()`, which reads `useWindowDimensions()` each render: title offset 7% of height, card insets 3.4% width / 6.6% height, badge `clamp(72, 23% width, 96)`. The arrow texture tiles from its 360×800 artboard to cover any screen without stretching. Content sits inside `useSafeAreaInsets()`; requires a `SafeAreaProvider` ancestor.
