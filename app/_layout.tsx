import Toast from "@/components/toast/toast";
import { isExpoGo } from "@/constants/platform";
import { useAuthState } from "@/features/auth/hooks/use-auth-state";
import { useAppState } from "@/hooks/use-app-state";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { usePushNotification } from "@/hooks/use-push-notification";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { Lexend_700Bold, useFonts } from "@expo-google-fonts/lexend";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

SplashScreen.preventAutoHideAsync();
if (!isExpoGo)
  initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY!);

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 1000 * 60 * 5 } },
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout(): React.JSX.Element | null {
  const colorScheme = useColorScheme();
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
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="record/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="mountains/search" options={{ headerShown: false }} />
            <Stack.Screen name="mountains/[id]" options={{ headerShown: false }} />
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
          <StatusBar style="dark" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
