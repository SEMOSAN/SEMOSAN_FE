import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";

/**
 * 온보딩 단계 공용 헤더. 이전 단계로 돌아가는 버튼만 둔다.
 *
 * 루트 Stack이 headerShown: false라 네이티브 뒤로가기가 없고, iOS는 하드웨어
 * 백도 없어서 이 버튼이 없으면 앞으로만 갈 수 있다(이전 답을 고칠 수 없다).
 */
export function OnboardingHeader(): React.JSX.Element {
  return (
    <View className="h-14 justify-center px-5">
      <TouchableOpacity
        onPress={() => {
          // 딥링크로 바로 진입하면 돌아갈 스택이 없다
          if (router.canGoBack()) router.back();
        }}
        activeOpacity={0.6}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="이전 단계로"
      >
        <ChevronLeftIcon size={24} />
      </TouchableOpacity>
    </View>
  );
}
