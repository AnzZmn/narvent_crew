# Android docked tab bar (15b)

Full-width tab bar for Android: white surface, hairline top border, text labels, tonal indicator pill behind the active icon. It replaces the floating `#22134F` pill on Android only. iPhone keeps the existing frosted-glass pill from `expo-discover-header-tabbar/TabBar.tsx`.

Raw `StyleSheet` only, no NativeWind.

## Files

- `TabBarAndroid.tsx`: the component, plus `ANDROID_TAB_ROW_HEIGHT` and `androidTabBarHeight(inset)`.

## Dependencies

Already in the project for the other exports:

```
npx expo install react-native-svg react-native-safe-area-context
```

Fonts: labels use `DMSans_500Medium` / `DMSans_700Bold` from `@expo-google-fonts/dm-sans`. Change `styles.label` / `styles.labelOn` if you load them under other names.

The app root must be wrapped in `SafeAreaProvider` (expo-router does this already).

## Plugging it in next to the iPhone tab bar

Both components share the same `Tab` type (`'home' | 'discover' | 'profile'`) and the same `active` / `onChange` props, so you can switch on platform in one place.

```tsx
// components/AppTabBar.tsx
import React from 'react';
import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TabBar, {TAB_BAR_HEIGHT, Tab} from '../export/expo-discover-header-tabbar/TabBar';
import TabBarAndroid, {androidTabBarHeight} from '../export/expo-android-docked-tabbar/TabBarAndroid';

type Props = {active: Tab; onChange: (t: Tab) => void};

export default function AppTabBar({active, onChange}: Props) {
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'android') {
    return <TabBarAndroid active={active} onChange={onChange} />;
  }
  return <TabBar variant="glass" active={active} onChange={onChange} bottom={insets.bottom + 14} />;
}

/** Space reserved at the bottom of the screen by the tab bar on each platform. */
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'android'
    ? androidTabBarHeight(insets.bottom)       // docked: bar + system nav inset
    : insets.bottom + 14 + TAB_BAR_HEIGHT;     // floating pill + its gap
}
```

Use it on any screen:

```tsx
const [tab, setTab] = useState<Tab>('discover');
const space = useTabBarSpace();

<View style={{flex: 1}}>
  {/* screen */}
  <AppTabBar active={tab} onChange={setTab} />
</View>
```

### With expo-router `Tabs`

```tsx
<Tabs
  tabBar={({state, navigation}) => (
    <AppTabBar
      active={state.routes[state.index].name as Tab}
      onChange={t => navigation.navigate(t)}
    />
  )}
  screenOptions={{headerShown: false}}>
  <Tabs.Screen name="home" />
  <Tabs.Screen name="discover" />
  <Tabs.Screen name="profile" />
</Tabs>
```

Route names must match the `Tab` values.

## Layout changes on Android

The bar is docked, so it takes space at the bottom instead of floating over content:

- **Discover carousel:** set `bottom: space + 16` (was a fixed 96). Lift the locate button by the same amount.
- **Scroll screens (Home, Profile):** `contentContainerStyle={{paddingBottom: space + 16}}`.
- **Booking sheet:** keep it above the bar (`zIndex` > 5). It covers the bar while open, same as on iPhone.
- **Edge-to-edge:** with `edgeToEdgeEnabled` (default on SDK 52+), `insets.bottom` is the gesture/3-button nav height and the bar paints behind it. Set the nav bar buttons to dark: `expo-navigation-bar` → `NavigationBar.setButtonStyleAsync('dark')`.

## Behaviour

- Tapping a tab springs the indicator open (scaleX 0.5 → 1) and cross-fades icon outline → filled and label regular → bold. All animations use the native driver.
- Android ripple on press, bounded to the tab.
- `accessibilityRole="tab"` with `selected` state; each tab target is a third of the width × 60dp, above the 48dp minimum.

## Colours

- Surface `#FFFFFF`, top border `#E6E2F5`
- Indicator `#E3DDFB`
- Active icon `#3A2A8C`, active label `#1E1440`
- Idle icon `#6B6788`, idle label `#5E5980` (both above 4.5:1 on white)
