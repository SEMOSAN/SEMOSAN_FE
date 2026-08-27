import { Modal, Text, TouchableOpacity, View } from "react-native";

const MODAL_BORDER_RADIUS = 16;
const MODAL_MAX_WIDTH = 320;
// 배경 오버레이 투명도
const OVERLAY_COLOR = "rgba(0,0,0,0.4)";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function NoNearbyMountainModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 어두운 오버레이 */}
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: OVERLAY_COLOR }}
      >
        {/* 모달 본체 */}
        <View
          className="w-full bg-fill-normal"
          style={{
            maxWidth: MODAL_MAX_WIDTH,
            borderRadius: MODAL_BORDER_RADIUS,
            marginHorizontal: 16,
          }}
        >
          {/* 타이틀 + 설명 */}
          <View className="gap-2 px-5 pb-4 pt-5">
            <Text className="typo-heading-1-semi-bold text-label-normal">
              근처에 산이 없어요
            </Text>
            <Text className="typo-body-1-normal-regular text-label-normal">
              자유 기록은 산 근처에서만 시작할 수 있어요. 산으로 이동한 뒤 다시
              시도해 주세요.
            </Text>
          </View>

          {/* 확인 */}
          <View className="px-4 pb-4">
            <TouchableOpacity
              className="items-center justify-center rounded-[10px] bg-label-normal"
              style={{ height: 48 }}
              onPress={onClose}
            >
              <Text className="typo-label-large text-common-100">확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
