import { Platform } from "react-native";
import VerifyNumberIOS from "./VerifyNumberIOS";
import VerifyNumberAndroid from "../expo-android-verify/VerifyNumberAndroid";

export { VerifyNumberAndroid, VerifyNumberIOS };

const Verify = Platform.OS == "ios" ? VerifyNumberIOS : VerifyNumberAndroid;

export default Verify;
