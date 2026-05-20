import { useLogout } from "@/features/auth/hooks/use-logout";
import { MenuChevronIcon } from "@/features/mypage/components/menu-chevron-icon";
import { MenuRow } from "@/features/mypage/components/menu-row";
import { ProfileAvatar } from "@/features/mypage/components/profile-avatar";
import { SectionDivider } from "@/features/mypage/components/section-divider";
import { APP_VERSION } from "@/features/mypage/constants";
import {
  HIKING_LEVEL_LABEL,
  useProfile,
} from "@/features/mypage/hooks/use-profile";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyPageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { mutate: logout } = useLogout();

  const activityItems = [
    {
      label: "저장한 산 목록",
      onPress: () => router.push("/mypage/saved-mountains"),
    },
    { label: "내 게시글", onPress: () => {} },
    { label: "내 반응", onPress: () => {} },
    { label: "차단 목록", onPress: () => {} },
  ];

  const serviceItems = [
    { label: "권한 관리", onPress: () => router.push("/mypage/permissions") },
    { label: "이용약관", onPress: () => router.push("/mypage/terms") },
    { label: "버전 정보", value: `v ${APP_VERSION}`, onPress: () => {}, hideChevron: true },
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
          { text: "탈퇴", style: "destructive", onPress: () => {} },
        ]),
    },
  ];

  const nickname = profile?.nickname ?? "-";
  const grade = profile?.hikingLevel
    ? HIKING_LEVEL_LABEL[profile.hikingLevel]
    : "-";

  return (
    <View className="flex-1 bg-fill-stronger">
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
            className="flex-row items-center justify-between gap-3 self-stretch px-4 py-5"
            activeOpacity={0.6}
            onPress={() => router.push("/mypage/info")}
          >
            <ProfileAvatar url={profile?.profileUrl} />

            <View className="flex-1 gap-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-label-normal typo-body-1-normal-semi-bold">
                  {nickname}
                </Text>
                <View className="rounded bg-secondary-subtle px-2 py-0.5">
                  <Text className="text-secondary-strong typo-caption-1-semi-bold">
                    {grade}
                  </Text>
                </View>
              </View>
            </View>

            <MenuChevronIcon />
          </TouchableOpacity>
        </View>

        {/* 서비스 */}
        <SectionDivider />
        <View className="bg-fill-normal">
          <Text
            className="text-label-alternative px-4 pb-2 pt-5 typo-body-2-normal-semi-bold"
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
