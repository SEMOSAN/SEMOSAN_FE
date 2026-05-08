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
import "../global.css";

import Toast from "@/components/toast/toast";
import { CountdownOverlay } from "@/features/tracking/components/countdown-overlay";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useCountdownStore } from "@/store/countdown.store";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout(): React.JSX.Element | null {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
  });
  const { countdown, dismiss } = useCountdownStore();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (countdown === null) return;
    const timer = setTimeout(() => useCountdownStore.getState().tick(), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="record/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <Toast />
      <StatusBar style="auto" />
      {countdown !== null && countdown > 0 && (
        <CountdownOverlay countdown={countdown} onClose={dismiss} />
      )}
    </ThemeProvider>
  );
}
