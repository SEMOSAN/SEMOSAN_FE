import "dotenv/config";

const isLiveActivityEnabled =
  process.env.EXPO_PUBLIC_LIVE_ACTIVITY_ENABLED === "true";

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: "semosan",
  slug: "semosan",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/app-icon.png",
  scheme: "semosan",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.tastyhiking.semosanapp",
    appleTeamId: "M8D59WC33R",
    usesAppleSignIn: true,
    googleServicesFile: "./GoogleService-Info.plist",
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      NSCameraUsageDescription:
        "프로필 사진 촬영을 위해 카메라 접근이 필요합니다.",
      NSPhotoLibraryUsageDescription:
        "프로필 사진 선택을 위해 사진 라이브러리 접근이 필요합니다.",

      UIBackgroundModes: ["remote-notification"],

      ITSAppUsesNonExemptEncryption: false,

    },
  },
  locales: {
    ko: "./locales/ko.json",
  },
  android: {
    googleServicesFile: "./google-services.json",

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
    favicon: "./assets/images/app-icon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    "@react-native-firebase/app",
    "./plugins/withModularHeaders",


    ...(isLiveActivityEnabled ? ["./plugins/withLiveActivity"] : []),
    [
      "expo-notifications",
      {
        icon: "./assets/images/app-icon.png",
        color: "#ffffff",
        googleServicesFile: "./google-services.json",
        enableBackgroundRemoteNotifications: true,
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
        image: "./assets/images/app-icon.png",
        imageWidth: 120,
        resizeMode: "contain",
        backgroundColor: "#1a1b1f",
        dark: { backgroundColor: "#1a1b1f" },
      },
    ],
    "expo-apple-authentication",
    "expo-image-picker",
    "expo-web-browser",
    [
      "expo-image-picker",
      {
        photosPermission:
          "사진첩에 접근하여 포토 리포트에 사용할 사진을 가져옵니다.",
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
