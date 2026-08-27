import Toast from "@/components/toast/toast";
import { isExpoGo } from "@/constants/platform";
import { useAuthState } from "@/features/auth/hooks/use-auth-state";
import { useAppState } from "@/hooks/use-app-state";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { AppUpdateGate } from "@/features/app-update/components/app-update-gate";
import { usePushNotification } from "@/hooks/use-push-notification";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { Lexend_700Bold, useFonts } from "@expo-google-fonts/lexend";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider, focusManager } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

// 포어그라운드에서도 알림 배너 표시
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const data = notification.request.content.data as { type?: string } | null;
    const type = data?.type;

    // 트래킹 푸시: 포어그라운드에서 시스템 배너 차단 (in-app banner 만 노출)
    // mixed payload 로 백엔드가 notification + data 둘 다 보내므로 중복 방지
    if (
      type === "TRACKING_PHOTO_MILESTONE" ||
      type === "TRACKING_SUMMIT_REACHED"
    ) {
      return {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    }

    // 그 외 (커뮤니티/세모피드 등): 시스템 배너 그대로 표시
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

SplashScreen.preventAutoHideAsync();
if (!isExpoGo)
  initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY!);

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  tracesSampleRate: 1.0,
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
});

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}
export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayout(): React.JSX.Element | null {
  const { status: authStatus } = useAuthState();

  usePushNotification(authStatus === "authenticated");
  const [fontsLoaded] = useFonts({
    "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    Lexend_700Bold,
  });

  useReactQueryDevTools(queryClient);

  useOnlineManager();

  useAppState(onAppStateChange);

  useEffect(() => {
    if (fontsLoaded && authStatus !== "loading") {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authStatus]);

  if (!fontsLoaded || authStatus === "loading") return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen
              name="onboarding/hiking"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="onboarding/exercise"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="onboarding/exercise-detail"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="record/[id]" options={{ headerShown: false }} />
            <Stack.Screen
              name="mountains/search"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="mountains/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="mountains/courses/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="record/photo-report-edit"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="mountain-info"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="community/write"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="community/free-board/write"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="community/free-board/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="community/free-board/search"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="community/post-complete"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="mypage/info" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen
              name="mypage/saved-mountains"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="mypage/permissions"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="mypage/terms"
              options={{ headerShown: false }}
            />
          </Stack>
          {authStatus === "unauthenticated" && <Redirect href="/login" />}
          <Toast />
          <AppUpdateGate />
          <StatusBar style="dark" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(RootLayout);
