import { Platform } from "react-native";
import SetupProfileAndroid from "./SetupProfileAndroid";
import SetupProfileIOS from "./SetupProfileIOS";

export type { ProfileData } from "./SetupProfileIOS";
export { SetupProfileAndroid, SetupProfileIOS };

const SetupProfile =
  Platform.OS === "ios" ? SetupProfileIOS : SetupProfileAndroid;
export default SetupProfile;
