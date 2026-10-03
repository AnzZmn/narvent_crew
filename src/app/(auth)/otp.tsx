import VerifyNumberAndroid from "@/components/export/expo-android-verify/VerifyNumberAndroid";
import Verify from "@/components/export/expo-verify";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function OTP() {
  const router = useRouter();
  return (
    <Verify
      onBack={() => router.back()}
      onSubmit={async (code) => {
        router.replace("/(onboarding)/profile_setup");
      }}
      onResend={() => {}}
    />
  );
}
