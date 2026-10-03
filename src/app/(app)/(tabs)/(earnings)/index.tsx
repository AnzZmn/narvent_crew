import { sampleWorkerDetails } from "@/components/export/expo-worker-home";
import EarningsDetail, {
  EarningsDetailProps,
} from "@/components/export/expo-worker-home/details/EarningsDetail";
import { useRouter } from "expo-router";

export default function EarningsDetailSection() {
  const router = useRouter();

  const sampleEarningsDetail: EarningsDetailProps = {
    earnings: sampleWorkerDetails["earnings"],
    onBack: () => router.back(),
  };

  return <EarningsDetail {...sampleEarningsDetail} />;
}
