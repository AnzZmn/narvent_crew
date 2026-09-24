import LoginAndroid from "@/components/export/expo-android-login/LoginAndroid";
import Login from "@/components/export/expo-login";
import { useRouter } from "expo-router";

export default function Phone() {
  const router = useRouter();
  return (
    <Login
      onRequestOtp={async (phone) => {
        // "+919876543210"
        router.push({ pathname: "/otp", params: { phone } });
      }}
      onCountryPress={() => {}}
    />
  );
}
