import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "NarventCrew",
  slug: "NarventCrew",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "narventcrew",
  userInterfaceStyle: "automatic",

  ios: {
    ...config.ios,
    icon: "./assets/expo.icon",
    bundleIdentifier: "com.narvent.narventcrew",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Narvent uses your location to show work near you",
    },
  },

  android: {
    ...config.android,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    package: "com.narvent.narventcrew",
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
  },

  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/Splash.png",
        resizeMode: "contain",
        backgroundColor: "#7D69FF",
      },
    ],
    "@react-native-community/datetimepicker",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "Narvent uses your location to show work near you",
      },
    ],
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.MAPS_ANDROID_API_KEY,
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          enableSceneSupport: true,
        },
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
