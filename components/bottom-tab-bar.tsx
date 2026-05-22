import { HomeIcon } from "@/components/icons/home-icon";
import { MountainIcon } from "@/components/icons/mountain-icon";
import { MyIcon } from "@/components/icons/my-icon";
import {
  useHomeStateContext,
  type TabBarVariant,
} from "@/contexts/home-state-context";
import { Colors } from "@/types/colors.generated";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ReactNode, useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TRANSITION_DURATION = 300;

const BG_LIGHT = "#ffffff";
const BG_DARK = "#000000";
const BORDER_LIGHT = "#e5e7eb";
const BORDER_DARK = "#464a57";

type TabItem = {
  name: string;
  label: string | null;
  renderIcon: (color: string) => ReactNode;
  isCenter?: boolean;
};

type VariantConfig = {
  iconColor: (isFocused: boolean) => string;
  labelClass: (isFocused: boolean) => string;
};

const VARIANT_CONFIG: Record<TabBarVariant, VariantConfig> = {
  light: {
    iconColor: (f) =>
      f ? Colors["global-neutral-900"] : Colors["global-neutral-100"],
    labelClass: (f) => (f ? "text-label-normal" : "text-neutral-100"),
  },
  dark: {
    iconColor: (f) =>
      f ? Colors["color-label-normal-inverse"] : Colors["global-neutral-700"],
    labelClass: (f) => (f ? "text-label-normal-inverse" : "text-neutral-700"),
  },
};

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
  // {
  //   name: "tracking",
  //   label: null,
  //   renderIcon: (color) => <NavigationIcon size={24} color={color} />,
  //   isCenter: true,
  // },
  // {
  //   name: "community",
  //   label: "커뮤니티",
  //   renderIcon: (color) => <CommunityIcon size={24} color={color} />,
  // },
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
  const { toggleHasRecords, tabBarVariant } = useHomeStateContext();
  const variant = VARIANT_CONFIG[tabBarVariant];

  const progress = useSharedValue(tabBarVariant === "dark" ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(tabBarVariant === "dark" ? 1 : 0, {
      duration: TRANSITION_DURATION,
    });
  }, [tabBarVariant, progress]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [BG_LIGHT, BG_DARK],
    ),
    borderTopColor: interpolateColor(
      progress.value,
      [0, 1],
      [BORDER_LIGHT, BORDER_DARK],
    ),
  }));

  // 현재 활성 라우트의 tabBarStyle이 hidden이면 탭바 숨기기
  const currentRoute = state.routes[state.index];
  const { tabBarStyle } = descriptors[currentRoute.key].options;
  if (tabBarStyle && (tabBarStyle as { display?: string }).display === "none") {
    return null;
  }

  return (
    <Animated.View
      className="flex-row items-center justify-between border-t px-5"
      style={[
        animatedContainerStyle,
        { paddingBottom: Math.max(insets.bottom, 4), paddingTop: 4 },
      ]}
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
              {item.renderIcon(Colors["color-label-normal-inverse"])}
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
            {item.renderIcon(variant.iconColor(isFocused))}
            <Text
              className={`text-center typo-caption-1-medium ${variant.labelClass(isFocused)}`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}
