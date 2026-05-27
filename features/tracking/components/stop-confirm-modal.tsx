import { Modal, Text, TouchableOpacity, View } from 'react-native';

const MODAL_BORDER_RADIUS = 16;
const MODAL_MAX_WIDTH = 320;
// 배경 오버레이 투명도
const OVERLAY_COLOR = 'rgba(0,0,0,0.4)';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function StopConfirmModal({ visible, onCancel, onConfirm }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* 어두운 오버레이 */}
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: OVERLAY_COLOR }}
      >
        {/* 모달 본체 */}
        <View
          className="bg-fill-normal w-full"
          style={{
            maxWidth: MODAL_MAX_WIDTH,
            borderRadius: MODAL_BORDER_RADIUS,
            marginHorizontal: 16,
          }}
        >
          {/* 타이틀 */}
          <View className="px-5 pt-5 pb-4">
            <Text className="typo-heading-1-semi-bold text-label-normal">
              기록을 종료할까요?
            </Text>
          </View>

          {/* 버튼 행 */}
          <View className="flex-row gap-2 px-4 pb-4">
            {/* 취소 */}
            <TouchableOpacity
              className="flex-1 bg-fill-stronger rounded-[10px] items-center justify-center"
              style={{ height: 48 }}
              onPress={onCancel}
            >
              <Text className="typo-label-large text-label-subtle">취소</Text>
            </TouchableOpacity>

            {/* 종료 */}
            <TouchableOpacity
              className="flex-1 bg-label-normal rounded-[10px] items-center justify-center"
              style={{ height: 48 }}
              onPress={onConfirm}
            >
              <Text className="typo-label-large text-common-100">종료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
