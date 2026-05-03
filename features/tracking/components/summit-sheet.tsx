import { Text, TouchableOpacity, View } from 'react-native';

// Figma 미토큰 색상
const GRAPHIC_BG = '#E0E0E0';
const GRAPHIC_WIDTH = 121;
const GRAPHIC_HEIGHT = 120;

type Props = {
  /** 정상 인증하기 */
  onCertify: () => void;
  /** 아직이에요 — 일정 시간 후 재표시 */
  onNotYet: () => void;
};

export function SummitSheet({ onCertify, onNotYet }: Props) {
  return (
    <View
      className="w-full bg-fill-normal"
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      {/* 핸들 */}
      <View className="items-center pt-3 pb-4">
        <View className="w-10 h-1 rounded-full bg-fill-neutral" />
      </View>

      {/* 텍스트 + 이미지 영역 */}
      <View className="px-4 gap-2">
        <Text className="typo-headline-1-semi-bold text-label-normal">
          정상에 도착했나요?
        </Text>
        <Text className="typo-body-1-normal-regular text-label-subtle">
          도착하셨다면 정상에서의 순간을 사진으로 남겨보세요.
        </Text>

        {/* 그래픽(사진) 영역 */}
        <View
          className="mt-2 items-center justify-center self-center"
          style={{ width: GRAPHIC_WIDTH, height: GRAPHIC_HEIGHT, backgroundColor: GRAPHIC_BG, gap: 10 }}
        >
          <Text className="typo-body-2-normal-medium text-label-disabled">그래픽 영역</Text>
        </View>
      </View>

      {/* 버튼 영역: gap-2(8px) */}
      <View className="px-4 pt-4 pb-4 gap-2">
        {/* 정상 인증하기 */}
        <TouchableOpacity
          className="bg-label-normal rounded-[10px] items-center justify-center"
          style={{ height: 48 }}
          onPress={onCertify}
        >
          <Text className="typo-label-large text-common-100">정상 인증하기</Text>
        </TouchableOpacity>

        {/* 아직이에요 */}
        <TouchableOpacity
          className="bg-fill-stronger rounded-[10px] items-center justify-center"
          style={{ minHeight: 48, maxHeight: 48, paddingVertical: 11, paddingHorizontal: 20 }}
          onPress={onNotYet}
        >
          <Text className="typo-label-large text-label-normal">아직이에요</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
