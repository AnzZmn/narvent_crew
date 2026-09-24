/**
 * Platform switch. Import this and you get the frosted screen on iOS and the
 * flat Material screen on Android; import the concrete files directly if you
 * want to force one (e.g. previewing the glass variant on an Android tablet).
 */
import {Platform} from 'react-native';
import LoginIOS from './LoginIOS';
import LoginAndroid from './LoginAndroid';

export {LoginIOS, LoginAndroid};
export * from './LoginShared';

const Login = Platform.OS === 'ios' ? LoginIOS : LoginAndroid;
export default Login;
