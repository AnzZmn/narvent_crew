/**
 * Narvent — Worker Home. Expo + StyleSheet.create, no NativeWind.
 * Android S 360×800 / L 412×915 (flat) and iPhone SE 375×667 / 15·16 393×852 (glass).
 *
 *   npx expo install expo-blur react-native-svg react-native-safe-area-context
 *
 * Wrap the app root in <SafeAreaProvider>. Each piece lives in ./components.
 * The platform picks the look (iOS glass, Android flat); pass `variant` to force one.
 */
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Variant, VariantContext } from "./components/theme";
import Background from "./components/Background";
import HeaderPill from "./components/HeaderPill";
import SummaryRow from "./components/SummaryRow";
import StatisticsCard from "./components/StatisticsCard";
import OngoingWorkCard from "./components/OngoingWorkCard";
import PaymentsCard from "./components/PaymentsCard";
import CompletedWorksCard from "./components/CompletedWorksCard";
import TabBar, { Tab } from "./components/TabBar";
import { WorkerHomeData, sampleWorkerHome } from "./types";

export type WorkerHomeProps = {
  data?: WorkerHomeData;
  variant?: Variant;
  /** controlled tab; omit to let the bar manage itself */
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  /** true when a navigator renders the tab bar once for all tabs (see expo-tabs/) */
  hideTabBar?: boolean;
  onMenu?: () => void;
  onOpenPerformance?: () => void;
  onOpenEarnings?: () => void;
  onOpenRating?: () => void;
  onOpenOngoing?: () => void;
  onUploadProof?: () => void;
  onOpenPayments?: () => void;
  onOpenCompleted?: () => void;
  onOpenChat?: () => void;
};

const TAB_H = 58;

export default function WorkerHome({
  data = sampleWorkerHome,
  variant,
  activeTab,
  onTabChange,
  hideTabBar = false,
  ...on
}: WorkerHomeProps) {
  const insets = useSafeAreaInsets();
  const [localTab, setLocalTab] = useState<Tab>("home");
  const tab = activeTab ?? localTab;
  const look: Variant = variant ?? (Platform.OS === "ios" ? "glass" : "flat");

  // 24px above the bottom edge in the mockup; sit above the home indicator / nav bar
  const tabBottom = Math.max(insets.bottom, 10) + 14;

  const changeTab = (t: Tab) => {
    setLocalTab(t);
    onTabChange?.(t);
  };

  return (
    <VariantContext.Provider value={look}>
      <View style={styles.root}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <Background />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: insets.top + 10,
            paddingBottom: tabBottom + TAB_H + 26,
          }}
        >
          <HeaderPill name={data.name} onMenu={on.onMenu} />
          <SummaryRow
            data={data}
            onOpenPerformance={on.onOpenPerformance}
            onOpenEarnings={on.onOpenEarnings}
            onOpenRating={on.onOpenRating}
          />
          <StatisticsCard stats={data.stats} />
          <OngoingWorkCard
            work={data.ongoing}
            onExpand={on.onOpenOngoing}
            onUploadProof={on.onUploadProof}
          />
          <PaymentsCard payments={data.payments} onExpand={on.onOpenPayments} />
          <CompletedWorksCard
            work={data.completed}
            onExpand={on.onOpenCompleted}
          />
        </ScrollView>

        {!hideTabBar && (
          <TabBar active={tab} onChange={changeTab} bottom={tabBottom} />
        )}
      </View>
    </VariantContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
});
