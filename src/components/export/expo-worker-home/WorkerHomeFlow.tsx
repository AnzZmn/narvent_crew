/**
 * Worker Home + its six detail screens, wired together without a navigation
 * library. Home stays mounted underneath so its scroll position survives;
 * a detail screen covers it. Android hardware back closes the detail.
 *
 * Using expo-router / react-navigation instead? Skip this file and render the
 * screens in ./details directly as routes.
 */
import React, { useCallback, useState, useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import WorkerHome, { WorkerHomeProps } from "./WorkerHome";
import OngoingWorkDetail from "./details/OngoingWorkDetail";
import PaymentsDetail from "./details/PaymentsDetail";
import PaymentBreakdownDetail from "./details/PaymentBreakdownDetail";
import CompletedWorksDetail from "./details/CompletedWorksDetail";
import PerformanceDetail from "./details/PerformanceDetail";
import EarningsDetail from "./details/EarningsDetail";
import ChatbotDetail from "./details/ChatbotDetail";
import { Variant, VariantContext } from "./components/theme";
import {
  sampleWorkerDetails,
  sampleWorkerHome,
  WorkerDetailsData,
  WorkerHomeData,
  PaymentEntry,
} from "./types";

export type DetailRoute =
  | "ongoing"
  | "payments"
  | "completed"
  | "performance"
  | "earnings"
  | "chat";

type Props = Pick<
  WorkerHomeProps,
  "activeTab" | "onTabChange" | "hideTabBar" | "onMenu" | "onOpenRating"
> & {
  home?: WorkerHomeData;
  details?: WorkerDetailsData;
  variant?: Variant;
  onUploadProof?: () => void;
  onCurrentLocation?: () => void;
  onSubmitWork?: () => void;
  onPressPayment?: (p: PaymentEntry) => void;
  onMonthPress?: () => void;
  onChatSend?: (text: string) => Promise<string | void> | string | void;
  /** real map for the Ongoing Work detail */
  map?: React.ReactNode;
  /** fires true when a detail screen opens, false when it closes (hide a navigator tab bar) */
  onOverlayChange?: (open: boolean) => void;
};

export default function WorkerHomeFlow({
  home = sampleWorkerHome,
  details = sampleWorkerDetails,
  variant,
  onUploadProof,
  onCurrentLocation,
  onSubmitWork,
  onPressPayment,
  onMonthPress,
  onChatSend,
  map,
  onOverlayChange,
  ...homeProps
}: Props) {
  const [route, setRoute] = useState<DetailRoute | null>(null);
  const [payment, setPayment] = useState<PaymentEntry | null>(null);
  const close = useCallback(() => {
    setRoute(null);
    setPayment(null);
  }, []);
  const closePayment = useCallback(() => setPayment(null), []);
  const openPayment = useCallback(
    (p: PaymentEntry) => {
      onPressPayment?.(p);
      setPayment(p);
    },
    [onPressPayment],
  );
  useEffect(() => {
    onOverlayChange?.(route !== null);
  }, [route, onOverlayChange]);
  const look: Variant = variant ?? (Platform.OS === "ios" ? "glass" : "flat");

  const detail = (() => {
    switch (route) {
      case "ongoing":
        return (
          <OngoingWorkDetail
            work={home.ongoing}
            onBack={close}
            onUploadProof={onUploadProof}
            onCurrentLocation={onCurrentLocation}
            onSubmit={() => {
              onSubmitWork?.();
              close();
            }}
            map={map}
          />
        );
      case "payments":
        return (
          <PaymentsDetail
            payments={details.payments}
            onBack={close}
            onPressPayment={openPayment}
          />
        );
      case "completed":
        return (
          <CompletedWorksDetail works={details.completed} onBack={close} />
        );
      case "performance":
        return (
          <PerformanceDetail
            score={home.performance.score}
            label={home.performance.label}
            description={details.performance.description}
            activity={details.performance.activity}
            onBack={close}
          />
        );
      case "earnings":
        return (
          <EarningsDetail
            earnings={details.earnings}
            onBack={close}
            onMonthPress={onMonthPress}
          />
        );
      case "chat":
        return (
          <ChatbotDetail
            initial={details.chat}
            onBack={close}
            onSend={onChatSend}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <VariantContext.Provider value={look}>
      <View style={styles.root}>
        <WorkerHome
          {...homeProps}
          data={home}
          variant={look}
          onUploadProof={onUploadProof}
          onOpenOngoing={() => setRoute("ongoing")}
          onOpenPayments={() => setRoute("payments")}
          onOpenCompleted={() => setRoute("completed")}
          onOpenPerformance={() => setRoute("performance")}
          onOpenEarnings={() => setRoute("earnings")}
          onOpenChat={() => setRoute("chat")}
        />
        {detail && <View style={StyleSheet.absoluteFill}>{detail}</View>}
        {route === "payments" && payment && (
          <View style={StyleSheet.absoluteFill}>
            <PaymentBreakdownDetail payment={payment} onBack={closePayment} />
          </View>
        )}
      </View>
    </VariantContext.Provider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
