# Narvent — Settings (Expo)

Settings screen with Account, Preferences and About Us groups, and the Home ⇄ Settings carousel. Tapping **Menu** in `HeaderPill` slides Settings in from the left while Home slides out to the right. Back (header arrow or Android hardware back) reverses the slide.

- `StyleSheet.create` only, no NativeWind.
- iOS uses frosted glass (`expo-blur`). Android uses flat white cards on `#F6F5FC`. Pick a look with `variant="glass" | "flat"`.
- Uses safe-area insets. Edit pages use `KeyboardAvoidingView`. Width comes from `useWindowDimensions`, so it fits iPhone SE, 15/16, Pro Max and Android S/L.
- Animations use the native driver: 500 ms `bezier(.22,.8,.26,1)` for the carousel, 280 ms for detail pages.

## Dependencies

```bash
npx expo install expo-blur react-native-svg react-native-safe-area-context
```

## Files

```
expo-settings/
  index.ts
  SettingsCarousel.tsx   Home ⇄ Settings sliding track
  Settings.tsx           list screen + detail push
  SettingsDetail.tsx     renders a page from blocks
  pages.ts               rows + sample page content (replace the placeholders)
  types.ts
  theme.ts
  components/            Surface, SectionPill, SettingsRow, Toggle, IconTile,
                         DetailHeader, BlockView, ScreenBackground, GradientFill, icons
```

Copy the folder to `src/features/settings/` (or anywhere) and import from `index.ts`.

## Plugging into the HeaderPill Menu

`HeaderPill` already has an `onMenu` prop, and `WorkerHome` / `WorkerHomeFlow` pass it through. Wrap the Home tab's content in `SettingsCarousel` and connect `onMenu` to `open`.

### 1. Home tab screen — `app/(tabs)/index.tsx`

```tsx
import React, {useState} from 'react';
import {WorkerHomeFlow} from '@/features/worker-home';
import {SettingsCarousel} from '@/features/settings';
import {useOverlay} from '@/features/tabs/OverlayController'; // the controller that hides the tab bar

export default function HomeTab() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const overlay = useOverlay();

  const openSettings = () => {
    setSettingsOpen(true);
    overlay.setHidden('settings', true);   // tab bar slides away with Home
  };
  const closeSettings = () => setSettingsOpen(false);

  return (
    <SettingsCarousel
      open={settingsOpen}
      onClose={closeSettings}
      onTransitionEnd={open => !open && overlay.setHidden('settings', false)} // bring tab bar back after the slide
      settings={{
        onLogout: () => {/* sign out */},
        onSave: (id, values) => {/* PATCH /me or /me/payout with values */},
      }}>
      <WorkerHomeFlow hideTabBar onMenu={openSettings} onOverlayChange={o => overlay.setHidden('home', o)} />
    </SettingsCarousel>
  );
}
```

Your overlay controller may use different method names. The rules are:

- Hide the tab bar as soon as Settings starts opening.
- Show it again only after the closing slide finishes (`onTransitionEnd(false)`), so it doesn't appear on top of a half-closed Settings screen.

### 2. Using `HeaderPill` directly

```tsx
<HeaderPill name={user.firstName} onMenu={() => setSettingsOpen(true)} />
```

The carousel only reads its `open` prop, so whatever owns the `open` state controls the slide.

### 3. Routing rows to existing screens (optional)

To open the full **My Profile** or **PaymentSettings** screens from `expo-my-profile` instead of the built-in edit pages, handle those rows yourself in `onOpenPage`. Return `true` to skip the built-in page:

```tsx
settings={{
  onOpenPage: id => {
    if (id === 'profile') { closeSettings(); router.navigate('/(tabs)/profile'); return true; }
    if (id === 'payment') { setPaymentEditOpen(true); return true; }
  },
}}
```

## Props

**SettingsCarousel**

| prop | type | |
|---|---|---|
| `open` | `boolean` | required |
| `onClose` | `() => void` | header back + Android back |
| `children` | `ReactNode` | the Home screen |
| `settings` | `SettingsProps` (minus `onBack`/`active`) | forwarded to `Settings` |
| `duration` | `number` | default 500 |
| `onTransitionEnd` | `(open) => void` | after the slide settles |

**Settings**: `user`, `pages` (partial override of `samplePages`), `onOpenPage`, `onSave`, `notificationsOn` + `onToggleNotifications` (controlled; leave both out to let Settings manage the toggle itself), `onLogout`, `version`, `logo` (`{mark, wordmark}` image sources for the About hero), `variant`, `onPageChange`.

## Content

The page text lives in `pages.ts` as typed blocks: `hero`, `meta`, `text`, `row`, `field`, `note`, `button`. **The Terms, Privacy, phone number, email and office address are placeholders. Replace them before release.** You can also load pages from your CMS and pass them as `pages`.

## Notes

- Settings mounts the first time it opens and then stays mounted, so later opens don't re-render it from scratch.
- While Settings is open, Home ignores touches and is hidden from screen readers. The reverse applies while it is closed.
- Android back works in this order: detail page → Settings list → Home.
