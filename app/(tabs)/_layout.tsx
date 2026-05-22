import { Tabs } from "expo-router";
import React from "react";

import { BottomTabBar } from "@/components/bottom-tab-bar";
import { HomeStateProvider } from "@/contexts/home-state-context";

export default function TabLayout() {
  return (
    <HomeStateProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tabs.Screen name="index" options={{ title: "홈" }} />
        <Tabs.Screen name="mountains" options={{ title: "산목록" }} />
        {/* <Tabs.Screen name="tracking" options={{ title: '기록' }} /> */}
        {/* <Tabs.Screen name="community" options={{ title: '커뮤니티' }} /> */}
        <Tabs.Screen name="mypage" options={{ title: "MY" }} />
      </Tabs>
    </HomeStateProvider>
  );
}
