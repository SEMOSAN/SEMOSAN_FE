import { useLogout } from "@/features/auth/hooks/use-logout";
import { useWithdraw } from "@/features/auth/hooks/use-withdraw";
import { MenuChevronIcon } from "@/features/mypage/components/menu-chevron-icon";
import { MenuRow } from "@/features/mypage/components/menu-row";
import { ProfileAvatar } from "@/features/mypage/components/profile-avatar";
import { SectionDivider } from "@/features/mypage/components/section-divider";
import { APP_VERSION } from "@/features/mypage/constants";
import {
  HIKING_LEVEL_LABEL,
  useProfile,
} from "@/features/mypage/hooks/use-profile";
import { usePrefetchSavedMountains } from "@/features/mountains/hooks/use-saved-mountains";
import { useFocusEffect } from "expo-router";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyPageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: profile } = useProfile();
  const prefetchSavedMountains = usePrefetchSavedMountains();

  useFocusEffect(
    useCallback(() => {
      prefetchSavedMountains();
    }, [prefetchSavedMountains]),
  );
  const { mutate: logout } = useLogout();
  const { mutate: withdraw } = useWithdraw();

  const activityItems = [
    {
      label: "저장한 산 목록",
      onPress: () => router.push("/mypage/saved-mountains"),
    },
    // { label: "내 게시글", onPress: () => {} },
    // { label: "내 반응", onPress: () => {} },
    // { label: "차단 목록", onPress: () => {} },
  ];

  const serviceItems = [
    { label: "권한 관리", onPress: () => router.push("/mypage/permissions") },
    { label: "이용약관", onPress: () => router.push("/mypage/terms") },
    {
      label: "버전 정보",
      value: `v ${APP_VERSION}`,
      onPress: () => {},
      hideChevron: true,
    },
  ];

  const accountItems = [
    {
      label: "로그아웃",
      onPress: () =>
        Alert.alert("로그아웃", "로그아웃 하시겠어요?", [
          { text: "취소", style: "cancel" },
          {
            text: "로그아웃",
            style: "destructive",
            onPress: () =>
              logout(undefined, { onSuccess: () => router.replace("/login") }),
          },
        ]),
    },
    {
      label: "탈퇴하기",
      danger: true,
      onPress: () =>
        Alert.alert("탈퇴하기", "정말 탈퇴하시겠어요?", [
          { text: "취소", style: "cancel" },
          {
            text: "탈퇴",
            style: "destructive",
            onPress: () =>
              withdraw(undefined, {
                onSuccess: () => router.replace("/login"),
              }),
          },
        ]),
    },
  ];

  const nickname = profile?.nickname ?? "-";

  return (
    <View className="flex-1 bg-fill-normal">
      {/* 헤더 */}
      <View
        className="flex-row items-center bg-fill-normal"
        style={{ height: 56, paddingHorizontal: 20, marginTop: insets.top }}
      >
        <Text className="text-label-normal typo-headline-1-semi-bold">
          마이페이지
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 프로필 카드 */}
        <View className="bg-fill-normal">
          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-5"
            activeOpacity={0.6}
            onPress={() => router.push("/mypage/info")}
          >
            <View className="flex-row items-center gap-3">
              <ProfileAvatar url={profile?.profileUrl} size={60} />
              <View className="gap-[4px]">
                <View className="flex-row items-center gap-[4px]">
                  <Text className="text-label-normal typo-heading-1-semi-bold">
                    {nickname}
                  </Text>
                  <View className="items-center justify-center rounded bg-secondary-subtle px-[4px] py-0.5">
                    {profile?.hikingLevel && (
                      <Text className="text-secondary-strong typo-caption-1-semi-bold">
                        {HIKING_LEVEL_LABEL[profile.hikingLevel]}
                      </Text>
                    )}
                  </View>
                </View>
                {profile?.email && (
                  <Text className="text-label-subtler typo-body-2-normal-regular">
                    {profile.email}
                  </Text>
                )}
              </View>
            </View>

            <MenuChevronIcon />
          </TouchableOpacity>
        </View>

        {/* 내 활동 */}
        <SectionDivider />
        <View className="bg-fill-normal">
          <Text
            className="px-4 pb-2 pt-5 text-label-subtler typo-body-2-normal-semi-bold"
            style={{ letterSpacing: -0.14 }}
          >
            내 활동
          </Text>
          {activityItems.map((item) => (
            <MenuRow key={item.label} {...item} />
          ))}
        </View>

        {/* 서비스 */}
        <SectionDivider />
        <View className="bg-fill-normal">
          <Text
            className="px-4 pb-2 pt-5 text-label-subtler typo-body-2-normal-semi-bold"
            style={{ letterSpacing: -0.14 }}
          >
            서비스
          </Text>
          {serviceItems.map((item) => (
            <MenuRow key={item.label} {...item} />
          ))}
        </View>

        {/* 로그아웃 / 탈퇴하기 */}
        <SectionDivider />
        <View className="bg-fill-normal">
          {accountItems.map((item) => (
            <MenuRow key={item.label} {...item} />
          ))}
        </View>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}
