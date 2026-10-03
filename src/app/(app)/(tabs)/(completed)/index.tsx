import {
  CompletedWorksDetail,
  sampleWorkerDetails,
} from "@/components/export/expo-worker-home";
import { CompletedWorksDetailProps } from "@/components/export/expo-worker-home/details/CompletedWorksDetail";
import { useRouter } from "expo-router";

export default function CompletedWorksDetailedSection() {
  const router = useRouter();

  const props: CompletedWorksDetailProps = {
    onBack: () => router.back(),
    works: sampleWorkerDetails.completed,
  };

  return <CompletedWorksDetail {...props} />;
}
