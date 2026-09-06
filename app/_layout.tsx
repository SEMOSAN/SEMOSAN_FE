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
  handleNotification: async () => {
    // 모든 타입에 대해 시스템 배너를 그대로 표시한다.
    // (이전에는 트래킹 타입을 분기했지만 두 갈래가 같은 값을 반환해 동작이 동일했다)
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
              name="notifications"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="semofeed/[id]"
              options={{ headerShown: false, presentation: "transparentModal" }}
            />
            <Stack.Screen
              name="mypage/terms"
              options={{ headerShown: false }}
            />
          </Stack>
          {authStatus === "unauthenticated" && <Redirect href="/login" />}
          {authStatus === "needsOnboarding" && (
            <Redirect href="/onboarding" />
          )}
          <Toast />
          <AppUpdateGate />
          <StatusBar style="dark" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(RootLayout);
