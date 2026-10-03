import { PaymentBreakdownDetail } from "@/components/export/expo-worker-home";
import { PaymentBreakdownDetailProps } from "@/components/export/expo-worker-home/details/PaymentBreakdownDetail";
import { samplePayments } from "@/components/export/expo-worker-home/details/PaymentsDetail.sample";
import { useRouter } from "expo-router";

export default function DetailedBreakdown() {
  const router = useRouter();

  const samplePaymentsDetailProps: PaymentBreakdownDetailProps = {
    payment: samplePayments[0],
    onBack: () => router.back(),
  };

  return <PaymentBreakdownDetail {...samplePaymentsDetailProps} />;
}
