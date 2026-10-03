# Narvent Profile v2: Expo / React Native (StyleSheet only, no NativeWind)

This is the reimagined **My Profile** from section 10 of the design file. It includes the identity card with the work-completion ring, the profile-completion dropdown, four tabs (Personal · Address · Education · ID & Bank), and the Skills & experience section. It also has three pages that open from the profile: **Skills & experience**, **Bank details** and **Documents**.

- **iPhone**: liquid glass, with blur cards, a frosted sticky header, gradient buttons and the Worker Home lavender background.
- **Android**: flat, with white cards on `#F6F5FC` and solid violet buttons.

The variant is chosen from `Platform.OS`. You can force one with `variant="glass" | "flat"`.

Every component is its own file, and every style is a plain `StyleSheet.create`.

```
expo-profile-v2/
  index.ts                 public exports
  ProfileFlow.tsx          drop-in: profile + 3 pages + QR sheet + toast + state
  ProfileScreen.tsx        the scrolling profile (stateless)
  profileRows.ts           data → rows for each tab (labels, order, half/full width)
  types.ts                 ProfileData and friends
  sampleData.ts            mockup data
  catalog.ts               trades, skill suggestions, languages, tools
  services/
    profileServices.ts     IFSC lookup, UPI verify, photo picker (+ validators)
  pages/
    SkillsPage.tsx  BankPage.tsx  DocumentsPage.tsx
  components/
    theme.ts  icons.tsx  GradientFill.tsx  ScreenBackground.tsx
    Card.tsx  SoftPill.tsx  PrimaryButton.tsx  OutlineButton.tsx  HeaderAction.tsx
    PageHeader.tsx  SectionTitle.tsx  InfoNote.tsx  IconTile.tsx
    TextField.tsx  Toggle.tsx  Segmented.tsx  SelectChip.tsx  SkillTag.tsx  DashedChip.tsx
    PhotoRing.tsx  IdentityCard.tsx  CompletionCard.tsx
    FieldGrid.tsx  FieldCell.tsx  ManageRow.tsx
    SkillsSection.tsx  SkillsSummary.tsx  SkillsEmpty.tsx  WorkTimeline.tsx
    Stepper.tsx  WorkCard.tsx  WorkForm.tsx
    DocProgress.tsx  DocumentRow.tsx  PhotoSlot.tsx
    SlidePage.tsx  BottomSheet.tsx  QrSheet.tsx  UploadSheet.tsx  Toast.tsx
  assets/qr-purple.png     placeholder QR (won't scan)
```

---

## 1. Install

```sh
npx expo install expo-blur react-native-svg react-native-safe-area-context expo-clipboard
# for real document photos (step 5)
npx expo install expo-image-picker
```

The app root must already be wrapped in `SafeAreaProvider`, which the existing tabs setup does. No other native setup is needed: animations use the built-in `Animated` API, not Reanimated.

## 2. Put the folder in place

Copy `expo-profile-v2/` next to the folders you already have:

```
your-app/
  app/
    (tabs)/
      _layout.tsx
      index.tsx
      profile.tsx        ← the only file you must change
  expo-my-profile/       ← keep it: the shared TabBar still lives here
  expo-profile-v2/       ← new
  expo-tab-loading/
  expo-worker-home/
  TabOverlay.tsx
  tabTransition.ts
  SwipeTabs.tsx
```

`ProfileFlow.tsx` and `index.ts` import the tab bar from `../expo-my-profile/components/TabBar`. If you move the folders, fix that one path.

## 3. Swap the Profile tab: `app/(tabs)/profile.tsx`

Before:

```tsx
import {MyProfileFlow, sampleProfile, ProfileData} from '../../expo-my-profile';
…
{data && <MyProfileFlow data={data} hideTabBar onOverlayChange={setOverlay} />}
```

After:

```tsx
import React from 'react';
import {ProfileFlow, ProfileData, sampleProfile} from '../../expo-profile-v2';
import {ProfileSkeleton, TabLoadGate, useTabData} from '../../expo-tab-loading';
import {useTabOverlay} from '../../TabOverlay';
import {SwipeTabs} from '../../SwipeTabs';
import {api} from '../../lib/api';            // your client
import {services} from '../../lib/profileServices'; // step 5

const fetchProfile = (): Promise<ProfileData> => api.getProfile().then(toProfileData); // step 4

export default function ProfileTab() {
  const setOverlay = useTabOverlay();
  const {data, loading, ready} = useTabData(fetchProfile, {refetchOnFocus: true});
  return (
    <SwipeTabs tab="profile">
      <TabLoadGate loading={loading} ready={ready} skeleton={<ProfileSkeleton />}>
        {data && (
          <ProfileFlow
            data={data}
            hideTabBar                       // the layout draws the bar
            onOverlayChange={setOverlay}     // hides it while a page / sheet is open
            services={services}
            onSaveProfile={d => api.updateProfile(d)}
            onSaveSkills={s => api.updateSkills(s)}
            onSaveBank={b => api.updatePayout(b)}
            onUploadDocument={u => api.uploadDocument(u)}
            onEditPhoto={pickProfilePhoto}
            onAddMissing={id => id === 'emergency' && router.push('/emergency-contact')}
          />
        )}
      </TabLoadGate>
    </SwipeTabs>
  );
}
```

To try it with mock data first, render `<ProfileFlow hideTabBar onOverlayChange={setOverlay} />` with no props.

## 4. `app/(tabs)/_layout.tsx`: what changes

**Nothing is required.** The layout already does what Profile v2 expects:

| Layout already… | Profile v2 relies on it because… |
|---|---|
| renders one `TabBar` for both tabs | `hideTabBar` stops `ProfileFlow` drawing a second one |
| hides that bar when `overlay` is true | `onOverlayChange(true)` fires while Skills, Bank, Documents or the QR sheet is open, so the bar never sits on top of a page |
| keeps both tabs mounted (`lazy: false`) | profile state (active tab, edit mode, open page) survives Home ⇄ Profile switches |
| sets `sceneStyle: {backgroundColor: 'transparent'}` | the new screen paints its own gradient (iOS) or `#F6F5FC` (Android) |

There are two optional tidy-ups.

**a. Import the bar from the new package**, so the layout only references one profile package:

```diff
- import {TabBar} from '../../expo-my-profile';
+ import {TabBar} from '../../expo-profile-v2';
```

This is the same component, re-exported.

**b. Turn off tab-swipe while editing.** `SwipeTabs` already stops while `overlay` is true. If you also want it off in Edit mode, add an `onEditChange` prop that calls `setOverlay` without hiding the bar. Edit mode is plain state inside `ProfileFlow` (`draft !== null`).

Full layout for reference. Only the import line differs from the current file:

```tsx
import React, {useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';
import {Tabs} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TabBar} from '../../expo-profile-v2';
import {TabOverlayContext, TabOverlayOpenContext} from '../../TabOverlay';
import {tabFade, tabTransition} from '../../tabTransition';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [overlay, setOverlay] = useState(false);
  const bottom = Math.max(insets.bottom, 10) + 14;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  return (
    <TabOverlayContext.Provider value={setOverlay}>
      <TabOverlayOpenContext.Provider value={overlay}>
        <Tabs
          backBehavior="history"
          screenOptions={{
            headerShown: false,
            lazy: false,
            ...(reduceMotion ? tabFade : tabTransition),
            sceneStyle: {backgroundColor: 'transparent'},
          }}
          tabBar={({state, navigation}) =>
            overlay ? null : (
              <TabBar
                active={state.routes[state.index].name === 'profile' ? 'profile' : 'home'}
                bottom={bottom}
                onChange={t => {
                  const name = t === 'profile' ? 'profile' : 'index';
                  if (state.routes[state.index].name !== name) navigation.navigate(name);
                }}
              />
            )
          }>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </TabOverlayOpenContext.Provider>
    </TabOverlayContext.Provider>
  );
}
```

The bottom padding matches: `ProfileFlow` reserves `58 + max(insets.bottom, 10) + 14 + 24`, which is the same `bottom` formula the layout uses for the bar.

## 5. Replace the placeholder data and services

### Map your API onto `ProfileData`

Every field is typed in `types.ts`. A typical mapper:

```ts
import {ProfileData} from '../expo-profile-v2';

export function toProfileData(r: ApiProfile): ProfileData {
  return {
    name: r.full_name,
    initials: r.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
    photoUri: r.photo_url ?? undefined,
    nuId: r.nu_id,
    verified: r.kyc_status === 'verified',
    workDone: r.completed_jobs / Math.max(1, r.assigned_jobs), // 0–1 → photo ring
    rating: r.rating,
    jobs: r.completed_jobs,
    personal: {fullName: r.full_name, dob: r.dob, gender: r.gender, phone: r.phone, email: r.email},
    address: {line: r.address_line, city: r.city, pin: r.pin, district: r.district, state: r.state},
    education: {/* … */ studying: r.edu_in_progress, /* … */},
    bank: {
      mode: r.payout_mode,                 // 'bank' | 'upi'
      holder: r.account_holder,
      accountNumber: r.account_number,     // send masked if you prefer: only the last 4 are shown
      ifsc: r.ifsc, bankName: r.bank_name, branch: r.branch,
      accountType: r.account_type,
      upi: r.vpa ?? '', upiVerified: !!r.vpa_verified, upiName: r.vpa_name,
    },
    documents: r.documents.map(d => ({...DOC_META[d.type], id: d.type, number: d.masked_number, status: d.status, expiry: d.expiry})),
    skills: r.skills ? {trade: r.skills.trade, years: r.skills.years, skills: r.skills.tags, languages: r.skills.languages, tools: r.skills.tools, history: r.skills.history} : null,
    completion: {total: r.completion.total, missing: r.completion.missing}, // [{id, label, sub}]
  };
}
```

`DOC_META` holds the static parts of each document type: name, `required`, `hasBack`, `hasExpiry`, `icon`, `numberLabel`, `numberPlaceholder` and `hint`. Copy them from `sampleData.ts`.

### Services (`services` prop)

```ts
import * as ImagePicker from 'expo-image-picker';
import {ProfileServices} from '../expo-profile-v2';

export const services: Partial<ProfileServices> = {
  // lookupIfsc: default already calls https://ifsc.razorpay.com/{IFSC} (free, no key)

  verifyUpi: async vpa => {
    const r = await api.post('/payouts/verify-vpa', {vpa}); // your server → Razorpay X / Cashfree
    return r.valid ? {ok: true, name: r.name} : {ok: false, reason: r.message ?? 'UPI ID not found'};
  },

  pickDocumentPhoto: async () => {
    const res = await ImagePicker.launchCameraAsync({quality: 0.7, allowsEditing: true});
    // or launchImageLibraryAsync; ask the user with an ActionSheet first
    return res.canceled ? null : res.assets[0].uri;
  },
};
```

- **IFSC**: the built-in default works as is. Any well-formed 11-character code is looked up after a 350 ms pause. Save stays disabled until a branch is found.
- **UPI**: the default is a **mock** that always succeeds. Real VPA name lookup needs a payout provider's secret key, so it **must** run on your server.
- **Photos**: the default returns `mock://` uris so the flow can be clicked through. A real `file://` uri shows as the photo inside the slot.
- **₹1 penny-drop**: your `onSaveBank` should start the test transfer server-side. The note on the page tells the worker it's coming.

### Save callbacks

| Prop | Called when | Payload |
|---|---|---|
| `onSaveProfile` | Done is tapped in edit mode | `EditDraft` (personal, address, education) |
| `onSaveSkills` | Save on the Skills page | `SkillsData` |
| `onSaveBank` | Save on Bank details | `BankDetails` (incl. `bankName`/`branch` from the lookup) |
| `onUploadDocument` | Submit in the upload sheet | `DocumentUpload` (`frontUri`, `backUri?`, `number`, `expiry?`) |
| `onAddMissing` | Add in Profile completion (not `skills`) | item id |
| `onEditPhoto` | camera badge on the photo | — |
| `onCopyId` | Nu.Id chip (default: `expo-clipboard`) | the id |

Each save can return a Promise:

- **Resolve**: local state updates, the page closes and a toast confirms.
- **Throw**: a "Couldn't save. Try again." toast shows, and the page or sheet stays open with the user's input intact.

After a successful upload, the document shows **Under review** until your next `data` refresh says `verified`.

## 6. Fonts (optional)

The design uses DM Sans and DM Mono. Load them with `expo-font` / `@expo-google-fonts/dm-sans`, then fill `FAMILY` in `components/theme.ts`:

```ts
export const FAMILY = {'400': 'DMSans_400Regular', '500': 'DMSans_500Medium', '600': 'DMSans_600SemiBold', '700': 'DMSans_700Bold'};
export const MONO = 'DMMono_500Medium';
```

Until then, system fonts are used.

## Notes

- **Glass scope**: only this profile section is glass. The shared `TabBar` keeps its own styling from `expo-my-profile`, and it follows the platform, not the `variant` prop.
- **Sticky header**: `PageHeader` floats over each ScrollView, so on iOS content blurs as it scrolls beneath it. Scroll content is padded by `insets.top + HEADER_H`.
- **Android back**: it closes the open sheet first, then the open page. On the profile itself it falls through to the navigator.
- **Edit mode**: only Personal, Address and Education become inputs. Verified values (the certificate) and the whole ID & Bank tab stay locked, and change only through their own pages.
- **Profile skeleton**: the existing `ProfileSkeleton` in `expo-tab-loading` was drawn for the old layout. It still works as a placeholder. Update it to the card → bar → tabs shape if you want the loading state to match.
- **Old package**: you can delete `expo-my-profile/` except `components/TabBar.tsx`, `icons.tsx`, `theme.ts` and `GradientFill.tsx`, which the tab bar uses. Or move those four into a shared folder and update the import in `ProfileFlow.tsx`, `index.ts` and the layout.
