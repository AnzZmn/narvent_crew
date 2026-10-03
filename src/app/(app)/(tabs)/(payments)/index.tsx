import {
  PaymentEntry,
  PaymentsDetail,
} from "@/components/export/expo-worker-home";
import { PaymentsDetailProps } from "@/components/export/expo-worker-home/details/PaymentsDetail";
import { useRouter } from "expo-router";

export default function Payments() {
  const samplePayments: PaymentEntry[] = [
    {
      id: "p1",
      title: "Painting Work",
      amount: "₹ 700",
      meta: "March 15",
      status: "paid",
    },
    {
      id: "p2",
      title: "Delivery Work",
      amount: "₹ 500",
      meta: "Thrissur",
      status: "paid",
    },
    {
      id: "p3",
      title: "Electrical Maintenance",
      amount: "₹ 1500",
      meta: "April 2",
      status: "pending",
    },
    {
      id: "p4",
      title: "Installation Work",
      amount: "₹ 1200",
      meta: "Kochi",
      status: "paid",
    },
    {
      id: "p5",
      title: "Carpentry",
      amount: "₹ 1100",
      meta: "April 10",
      status: "pending",
    },
    {
      id: "p6",
      title: "Furniture Assembly",
      amount: "₹ 800",
      meta: "Calicut",
      status: "cancelled",
    },
    { id: "p7", title: "Plumbing Repair", amount: "₹ 950", meta: "April 14" },
    {
      id: "p8",
      title: "Lulu Work",
      amount: "₹ 650",
      meta: "Ernakulam",
      status: "paid",
    },
    {
      id: "p9",
      title: "Tile Fixing",
      amount: "₹ 1350",
      meta: "April 18",
      status: "pending",
    },
    {
      id: "p10",
      title: "Warehouse Loading",
      amount: "₹ 600",
      meta: "Palakkad",
      status: "cancelled",
    },
  ];

  const router = useRouter();

  const samplePaymentsDetailProps: PaymentsDetailProps = {
    payments: samplePayments,
    onBack: () => router.back(),
    onPressPayment: () => router.push("/(app)/(tabs)/(payments)/(details)"),
    // variant: 'ios',
  };

  const emptyPaymentsDetailProps: PaymentsDetailProps = {
    ...samplePaymentsDetailProps,
    payments: [],
  };
  return <PaymentsDetail {...samplePaymentsDetailProps} />;
}
