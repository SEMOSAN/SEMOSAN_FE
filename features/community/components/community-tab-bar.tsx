import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const TABS = [
  { path: "/community/record-share", label: "기록 공유" },
  { path: "/community/free-board", label: "자유 게시판" },
] as const;

export function CommunityTabBar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="flex-row border-b border-line-subtle px-2">
      {TABS.map(({ path, label }) => {
        const isActive = pathname === path;
        return (
          <Pressable
            key={path}
            onPress={() => router.replace(path as Href)}
            className={`px-3 py-2 ${isActive ? "border-b-2 border-line-primary" : ""}`}
          >
            <Text
              className={
                isActive
                  ? "text-label-normal typo-body-1-normal-semi-bold"
                  : "text-label-subtler typo-body-1-normal-regular"
              }
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
