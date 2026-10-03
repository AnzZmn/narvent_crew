# Narvent Worker Home + Detail Screens — Expo (StyleSheet, no NativeWind)

One file per component. iOS renders frosted glass. Android renders flat Material. Sizes adapt from Android S 360 to iPhone 15/16 393 and Android L 412.

```
index.ts
WorkerHome.tsx                 home screen
WorkerHomeFlow.tsx             home + details wired together (no nav library needed)
types.ts                       data shapes + mockup sample data (home + details)
details/
  OngoingWorkDetail.tsx        job, Upload Work Proof, location map, Submit
  PaymentsDetail.tsx           grouped payment list with status badge
  CompletedWorksDetail.tsx     all completed jobs
  PerformanceDetail.tsx        big gauge + activity report   ("Perfomance score")
  EarningsDetail.tsx           Day vs Payout: total, month, bar chart, activity
  ChatbotDetail.tsx            thread, quick replies, composer
components/
  theme.ts  icons.tsx  GradientFill.tsx  Background.tsx
  Surface.tsx  InnerSurface.tsx  PillButton.tsx
  DetailScreen.tsx  DetailHeader.tsx
  HeaderPill.tsx  SummaryRow.tsx  SummaryTile.tsx
  PerformanceCard.tsx  PerformanceGauge.tsx  PerformanceSummary.tsx
  EarningsCard.tsx  RatingCard.tsx  StatisticsCard.tsx  SectionHeader.tsx
  OngoingWorkCard.tsx  OngoingWorkItem.tsx
  PaymentsCard.tsx  PaymentList.tsx
  CompletedWorksCard.tsx  CompletedWorkItem.tsx
  LocationMap.tsx  TotalEarnings.tsx  MonthPicker.tsx  PayoutChart.tsx  ActivityReport.tsx
  ChatBubble.tsx  QuickReplies.tsx  ChatComposer.tsx
  ChatFab.tsx  TabBar.tsx
```

## Install

```sh
npx expo install expo-blur react-native-svg react-native-safe-area-context
```

Wrap the app root in `SafeAreaProvider`.

## Quickest use: everything wired

```tsx
import { WorkerHomeFlow } from "./expo-worker-home";

<WorkerHomeFlow
  home={homeData} // optional, defaults to mockup data
  details={detailsData}
  onUploadProof={pickProofPhoto}
  onCurrentLocation={locateMe}
  onSubmitWork={submitWork}
  onMonthPress={openMonthSheet}
  onChatSend={async (text) => (await api.chat(text)).reply} // returned string shows as a bot reply
  onTabChange={(t) => t === "profile" && router.push("/profile")}
/>;
```

The home screen stays mounted underneath, so its scroll position is kept. Android hardware back closes the open detail.

## With expo-router / react-navigation

Skip `WorkerHomeFlow` and render each file in `details/` as its own route. Every screen takes `onBack` plus its data, e.g.

```tsx
<PaymentsDetail payments={data.payments} onBack={router.back} />
<ChatbotDetail initial={data.chat} onBack={router.back} onSend={sendToBot} />
```

`variant="glass" | "flat"` forces a look on any screen.

## Notes

- **Shared rows**: `OngoingWorkItem` and `CompletedWorkItem` are used on Home and in the details, so edits apply to both.
- **Buttons** (Upload Work Proof, Current location, Submit) use `PillButton`, the same build as the fixed Next/OTP buttons.
- **Map**: `LocationMap` draws the mockup's street placeholder. Pass `map={<MapView … />}` (react-native-maps) to use a real map. The controls and Current location button stay on top.
- **Chart**: bar height is `value / max`. The y-axis ticks read `max`, `max/2` and `₹0`. Day labels come from `days[].day`.
- **Chat**: the send button is dimmed until there's text. Quick-reply chips send their label. The thread auto-scrolls to the newest message and lifts with the keyboard on iOS (Android uses Expo's default resize).
- **Small labels** use Menlo (iOS) / monospace (Android) in place of DM Mono.
- The mockup's "map placeholder" tag isn't exported. The spellings "Perfomance score" and "Painting workp" are kept from the mockup. Change them in `PerformanceDetail.tsx` and `types.ts`.
