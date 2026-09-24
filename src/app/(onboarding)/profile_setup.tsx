import SetupProfile, {
  ProfileData,
} from "@/components/export/expo-setup-profile";
import { useRouter } from "expo-router";

export default function ProfileSetup() {
  const router = useRouter();
  return (
    <SetupProfile
      onBack={() => router.back()}
      onSubmit={async (data: ProfileData) => {
        router.replace("/(app)/(tabs)");
      }}
    />
  );
}
