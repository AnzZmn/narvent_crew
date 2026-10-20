# DiscoverHeader + TabBar (Expo, raw StyleSheet)

Two drop-in files. No NativeWind, no shared theme imports.

## Install

```
npx expo install react-native-svg expo-blur react-native-safe-area-context
npx expo install @expo-google-fonts/dm-sans @expo-google-fonts/dm-mono
```

Load fonts once at the root: `DMSans_400Regular`, `DMSans_500Medium`, `DMSans_700Bold`, `DMMono_500Medium`. Wrap the app in `SafeAreaProvider`.

## DiscoverHeader.tsx

```tsx
<DiscoverHeader
  subtitle="12 jobs near you"
  trades={[{label: 'All', count: 12}, {label: 'Plumbing', count: 4}]}
  activeTrade={trade}
  onTradeChange={setTrade}
  onLayoutHeight={h => setMapTopPadding(h)}
/>
```

- Android (`dark`): solid `#22134F` panel, rounded bottom corners, white title, lilac count, light status bar. Selected chip is white with violet text; others are translucent with white text.
- iOS (`fade`): light gradient over the map with dark text and frosted chips.
- Force either look with `variant="dark" | "fade"`.

## TabBar.tsx

```tsx
<TabBar active={tab} onChange={setTab} bottom={insets.bottom + 14} />
```

- Pill 210 × 58, same height end to end. Highlight is a fixed 60 × 44 pill that springs between tabs.
- Android (`dark`): `#22134F` pill, violet gradient highlight, white selected icon, `#C9BFFF` idle icons.
- iOS (`glass`): frosted pill, clear-glass highlight, ink icon.
- Exports `TAB_BAR_WIDTH`, `TAB_BAR_HEIGHT`, `TABS`, `Tab`.

Replaces `expo-discover/components/DiscoverHeader.tsx` and `expo-discover/tabbar/TabBar.tsx`. The new header renders its own chips, so drop `<TradeChips>` as its child.
