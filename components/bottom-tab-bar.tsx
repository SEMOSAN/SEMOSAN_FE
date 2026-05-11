import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CommunityIcon } from "@/components/icons/community-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { MountainIcon } from "@/components/icons/mountain-icon";
import { MyIcon } from "@/components/icons/my-icon";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { useHomeStateContext } from "@/contexts/home-state-context";

type TabItem = {
  name: string;
  label: string | null;
  renderIcon: (color: string) => ReactNode;
  isCenter?: boolean;
};

const ACTIVE_COLOR = "#1a1b1f";
const INACTIVE_COLOR = "#d1d5db";

const TAB_ITEMS: TabItem[] = [
  {
    name: "index",
    label: "홈",
    renderIcon: (color) => <HomeIcon size={24} color={color} />,
  },
  {
    name: "mountains",
    label: "산목록",
    renderIcon: (color) => <MountainIcon size={24} color={color} />,
  },
  {
    name: "tracking",
    label: null,
    renderIcon: (color) => <NavigationIcon size={24} color={color} />,
    isCenter: true,
  },
  {
    name: "community",
    label: "커뮤니티",
    renderIcon: (color) => <CommunityIcon size={24} color={color} />,
  },
  {
    name: "mypage",
    label: "MY",
    renderIcon: (color) => <MyIcon size={24} color={color} />,
  },
];

export function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { hasRecords, toggleHasRecords } = useHomeStateContext();

  // 현재 활성 라우트의 tabBarStyle이 hidden이면 탭바 숨기기
  const currentRoute = state.routes[state.index];
  const { tabBarStyle } = descriptors[currentRoute.key].options;
  if (tabBarStyle && (tabBarStyle as { display?: string }).display === "none") {
    return null;
  }

  return (
    <View
      className="flex-row items-center justify-between border-t border-line-subtle bg-fill-normal px-5"
      style={{ paddingBottom: Math.max(insets.bottom, 4), paddingTop: 4 }}
    >
      {state.routes.map((route, index) => {
        const item = TAB_ITEMS[index];
        if (!item) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (item.isCenter) {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={toggleHasRecords}
              delayLongPress={500}
              className="items-center justify-center rounded-full bg-primary-normal"
              style={{ width: 68, height: 42 }}
            >
              {item.renderIcon("#ffffff")}
            </Pressable>
          );
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className="items-center justify-center gap-0.5 rounded"
            style={{ width: 48, height: 48 }}
          >
            {item.renderIcon(isFocused ? ACTIVE_COLOR : INACTIVE_COLOR)}
            <Text
              className={`text-center typo-caption-1-medium ${isFocused ? "text-label-normal" : "text-neutral-100"}`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
