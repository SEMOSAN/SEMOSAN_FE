import { CommunityIcon } from "@/components/icons/community-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { MountainIcon } from "@/components/icons/mountain-icon";
import { MyIcon } from "@/components/icons/my-icon";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { useHomeStateContext } from "@/contexts/home-state-context";
import { HOME_TAB_TRANSITION_DURATION } from "@/features/home/constants";
import { Colors } from "@/types/colors.generated";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ReactNode, useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BG_LIGHT = "#ffffff";
const BG_DARK = "#000000";
const BORDER_LIGHT = "#e5e7eb";
const BORDER_DARK = "#464a57";

const FOCUSED_LIGHT = Colors["global-neutral-900"];
const FOCUSED_DARK = Colors["color-label-normal-inverse"];
const UNFOCUSED_LIGHT = Colors["global-neutral-100"];
const UNFOCUSED_DARK = Colors["global-neutral-700"];

type TabItem = {
  name: string;
  label: string;
  renderIcon: (color: string) => ReactNode;
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
  {
    name: "tracking",
    label: "트래킹",
    renderIcon: (color) => <NavigationIcon size={24} color={color} />,
  },
  {
    name: "community",
    label: "커뮤니티",
    renderIcon: (color) => <CommunityIcon size={24} color={color} />,
  },
  {
    name: "mypage",
    label: "마이페이지",
    renderIcon: (color) => <MyIcon size={24} color={color} />,
  },
];

export function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { tabProgress } = useHomeStateContext();

  const homeTabIndex = state.routes.findIndex((r) => r.name === "index");

  // 1 = 홈 탭, 0 = 나머지 탭
  const isHome = useSharedValue(state.index === homeTabIndex ? 1 : 0);

  useEffect(() => {
    isHome.value = withTiming(state.index === homeTabIndex ? 1 : 0, {
      duration: HOME_TAB_TRANSITION_DURATION,
    });
  }, [state.index]);

  // 홈이면 tabProgress 적용, 아니면 0으로 자연스럽게 전환
  const effectiveProgress = useDerivedValue(() => {
    return tabProgress.value * isHome.value;
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      effectiveProgress.value,
      [0, 1],
      [BG_LIGHT, BG_DARK],
    ),
    borderTopColor: interpolateColor(
      effectiveProgress.value,
      [0, 1],
      [BORDER_LIGHT, BORDER_DARK],
    ),
  }));

  const lightLayerStyle = useAnimatedStyle(() => ({
    opacity: 1 - effectiveProgress.value,
  }));

  const darkLayerStyle = useAnimatedStyle(() => ({
    opacity: effectiveProgress.value,
  }));

  const focusedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      effectiveProgress.value,
      [0, 1],
      [FOCUSED_LIGHT, FOCUSED_DARK],
    ),
  }));

  const unfocusedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      effectiveProgress.value,
      [0, 1],
      [UNFOCUSED_LIGHT, UNFOCUSED_DARK],
    ),
  }));

  const currentRoute = state.routes[state.index];
  const { tabBarStyle } = descriptors[currentRoute.key].options;

  if (tabBarStyle && (tabBarStyle as { display?: string }).display === "none") {
    return null;
  }

  return (
    <Animated.View
      className="flex-row border-t"
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

        const lightColor = isFocused ? FOCUSED_LIGHT : UNFOCUSED_LIGHT;
        const darkColor = isFocused ? FOCUSED_DARK : UNFOCUSED_DARK;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center gap-0.5"
            style={{ height: 48 }}
          >
            <View style={{ width: 24, height: 24 }}>
              <Animated.View style={lightLayerStyle}>
                {item.renderIcon(lightColor)}
              </Animated.View>

              <Animated.View
                className="absolute left-0 top-0"
                style={darkLayerStyle}
              >
                {item.renderIcon(darkColor)}
              </Animated.View>
            </View>

            <Animated.Text
              className="text-center typo-caption-1-medium"
              style={isFocused ? focusedTextStyle : unfocusedTextStyle}
            >
              {item.label}
            </Animated.Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}
