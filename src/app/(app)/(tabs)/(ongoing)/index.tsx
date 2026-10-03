import {
  OngoingWork,
  OngoingWorkDetail,
} from "@/components/export/expo-worker-home";
import { OngoingWorkDetailProps } from "@/components/export/expo-worker-home/details/OngoingWorkDetail";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function OnGoing() {
  const sampleOngoingWork: OngoingWork = {
    id: "w1",
    title: "Painting Work",
    amount: "₹ 700",
    date: "March 15",
    reportingTime: "7:00 am",
    location: "Thrissur",
  };

  const router = useRouter();

  const sampleOngoingWorkDetailProps: OngoingWorkDetailProps = {
    work: sampleOngoingWork,
    onBack: () => router.back(),
    onUploadProof: () =>
      Alert.alert("Upload proof", "Open camera / image picker"),
    onCurrentLocation: () => Alert.alert("Location", "Fetch current location"),
    onSubmit: () => Alert.alert("Submitted", "Work marked for review"),
    // map: <MapView ... />,
    // variant: 'ios',
  };

  return <OngoingWorkDetail {...sampleOngoingWorkDetailProps} />;
}
