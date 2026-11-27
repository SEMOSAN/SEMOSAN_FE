import "dotenv/config";
import fs from "node:fs";

const hasIosGoogleServiceFile = fs.existsSync("./GoogleService-Info.plist");
const hasAndroidGoogleServiceFile = fs.existsSync("./google-services.json");
const hasNaverMapClientId = !!process.env.NAVER_MAP_CLIENT_ID;
const hasKakaoNativeAppKey = !!process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

// 디자인 토큰(typography-plugin.cjs)이 쓰는 weight만 넣는다 — 400/500/600/700
const PRETENDARD_WEIGHTS = [
  { path: "./assets/fonts/pretendard/Pretendard-Regular.ttf", weight: 400 },
  { path: "./assets/fonts/pretendard/Pretendard-Medium.ttf", weight: 500 },
  { path: "./assets/fonts/pretendard/Pretendard-SemiBold.ttf", weight: 600 },
  { path: "./assets/fonts/pretendard/Pretendard-Bold.ttf", weight: 700 },
];

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: "semosan",
  slug: "semosan",
  version: "1.3.0",
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
    ...(hasIosGoogleServiceFile
      ? { googleServicesFile: "./GoogleService-Info.plist" }
      : {}),
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      NSCameraUsageDescription:
        "프로필 사진 촬영을 위해 카메라 접근이 필요합니다.",
      NSPhotoLibraryUsageDescription:
        "프로필 사진 선택을 위해 사진 라이브러리 접근이 필요합니다.",

      UIBackgroundModes: ["remote-notification", "location"],

      ITSAppUsesNonExemptEncryption: false,
    },
  },
  locales: {
    ko: "./locales/ko.json",
    en: "./locales/en.json",
  },
  android: {
    ...(hasAndroidGoogleServiceFile
      ? { googleServicesFile: "./google-services.json" }
      : {}),


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
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        note: "Use SENTRY_AUTH_TOKEN env to authenticate with Sentry.",
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
      },
    ],
    "expo-router",
    [
      "expo-font",
      {
        // 안드로이드는 weight별 파일을 묶은 font family를 네이티브로 등록해야
        // fontWeight(500/600)가 가짜 볼드로 합성되지 않고 실제 굵기로 나온다.
        // 디자인 토큰이 'Pretendard'와 'Pretendard Variable' 두 이름을 섞어 쓰므로
        // (tokens 자동 생성물이라 수정 불가) 양쪽 다 같은 파일에 매핑한다.
        android: {
          fonts: [
            {
              fontFamily: "Pretendard",
              fontDefinitions: PRETENDARD_WEIGHTS,
            },
            {
              fontFamily: "Pretendard Variable",
              fontDefinitions: PRETENDARD_WEIGHTS,
            },
          ],
        },
        ios: {
          fonts: PRETENDARD_WEIGHTS.map((f) => f.path),
        },
      },
    ],
    "@react-native-firebase/app",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "현재 위치를 사용해 주변 산을 찾고, 지도에서 내 위치와 등산 경로를 안내합니다. 예: 가까운 산 추천 및 트래킹 중 현재 위치 표시",
        locationAlwaysAndWhenInUsePermission:
          "코스 추적 중 앱이 백그라운드에 있어도 위치를 기록하기 위해 항상 위치 접근 권한이 필요합니다.",
        locationAlwaysPermission:
          "코스 추적 중 앱이 백그라운드에 있어도 위치를 기록하기 위해 항상 위치 접근 권한이 필요합니다.",
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
      },
    ],
    [
      "expo-media-library",
      {
        savePhotosPermission:
          "포토 리포트 이미지를 사진첩에 저장하기 위해 접근 권한이 필요합니다.",
      },
    ],
    "./plugins/withModularHeaders",
    "./plugins/withAndroidMavenRepos",
    "./plugins/withNotificationColorFix",
    "./plugins/withAndroidLintFix",
    "./plugins/withLiveActivity",
    [
      "expo-notifications",
      {
        icon: "./assets/images/app-icon.png",
        color: "#ffffff",
        ...(hasAndroidGoogleServiceFile
          ? { googleServicesFile: "./google-services.json" }
          : {}),
        enableBackgroundRemoteNotifications: true,
      },
    ],
    ...(hasNaverMapClientId
      ? [
          [
            "@mj-studio/react-native-naver-map",
            {
              client_id: process.env.NAVER_MAP_CLIENT_ID,
            },
          ],
        ]
      : []),
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-app-icon.png",
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
        photosPermission:
          "사진첩에 접근하여 포토 리포트에 사용할 사진을 가져옵니다.",
        microphonePermission: false,
      },
    ],
    ...(hasKakaoNativeAppKey
      ? [
          [
            "@react-native-kakao/core",
            {
              nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
              ios: { handleKakaoOpenUrl: true },
              android: { authCodeHandlerActivity: true },
            },
          ],
        ]
      : []),
    "react-native-compressor",
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
