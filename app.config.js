import "dotenv/config";

const isLiveActivityEnabled = process.env.EXPO_PUBLIC_LIVE_ACTIVITY_ENABLED === "true";

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
    bundleIdentifier: "com.tastyhiking.semosanapp",
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
    package: "com.tastyhiking.semosanapp",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    ...(isLiveActivityEnabled ? ["./plugins/withLiveActivity"] : []),
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
        image: "./assets/logo.png",
        imageWidth: 120,
        resizeMode: "contain",
        backgroundColor: "#1a1b1f",
        dark: { backgroundColor: "#1a1b1f" },
      },
    ],
    "expo-apple-authentication",
    "expo-web-browser",
    [
      "expo-image-picker",
      {
        photosPermission: "사진첩에 접근하여 포토 리포트에 사용할 사진을 가져옵니다.",
      },
    ],
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
  extra: {
    eas: {
      projectId: "df38234e-8a6e-42ca-8c16-21eed97912bc",
    },
  },
};

export default config;
