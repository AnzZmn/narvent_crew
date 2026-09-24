import VerifyNumberAndroid from "@/components/export/expo-android-verify/VerifyNumberAndroid";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function OTP() {
  const router = useRouter();
  return (
    <VerifyNumberAndroid
      onBack={() => router.back()}
      onSubmit={async (code) => {
        router.replace("/(onboarding)/profile_setup");
      }}
      onResend={() => {}}
    />
  );
}
