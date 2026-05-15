import { useFonts } from "@expo-google-fonts/lexend";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

import Toast from "@/components/toast/toast";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePushNotification } from "@/hooks/use-push-notification";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout(): React.JSX.Element | null {
  const colorScheme = useColorScheme();
  usePushNotification();
  const [fontsLoaded] = useFonts({
    "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="record/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="mountain-info" options={{ headerShown: false }} />
          <Stack.Screen name="community/write" options={{ headerShown: false }} />
          <Stack.Screen name="community/post-complete" options={{ headerShown: false }} />
          <Stack.Screen name="mypage/info" options={{ headerShown: false }} />
          <Stack.Screen name="mypage/saved-mountains" options={{ headerShown: false }} />
          <Stack.Screen name="mypage/permissions" options={{ headerShown: false }} />
          <Stack.Screen name="mypage/terms" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <Toast />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
