import "dotenv/config";

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: "semosan",
  slug: "semosan",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "semosan",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.tastyhiking.semosan",
    usesAppleSignIn: true,
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
    },
  },
  locales: {
    ko: "./locales/ko.json",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [],
    package: "com.tastyhiking.semosan",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-notifications",
      {
        icon: "./assets/images/icon.png",
        color: "#ffffff",
        googleServicesFile: "./google-services.json",
      },
    ],
    [
      "@mj-studio/react-native-naver-map",
      {
        client_id: process.env.NAVER_MAP_CLIENT_ID,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: { backgroundColor: "#000000" },
      },
    ],
    "expo-apple-authentication",
    [
      "@react-native-kakao/core",
      {
        nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
