import { Platform } from "react-native";
import LoginAndroid from "./LoginAndroid";
import LoginIOS from "./LoginIOS";

export { LoginAndroid, LoginIOS };

const Login = Platform.OS === "ios" ? LoginIOS : LoginAndroid;
export default Login;
