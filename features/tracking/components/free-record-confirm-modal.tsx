import { Modal, Text, TouchableOpacity, View } from 'react-native';

const MODAL_BORDER_RADIUS = 16;
const MODAL_MAX_WIDTH = 320;
const OVERLAY_COLOR = 'rgba(0,0,0,0.4)';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function FreeRecordConfirmModal({ visible, onCancel, onConfirm }: Props) {
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
          {/* 타이틀 + 설명 */}
          <View className="px-5 pt-5 pb-4 gap-2">
            <Text className="typo-heading-1-semi-bold text-label-normal">
              자유 기록을 시작할까요?
            </Text>
            <Text className="typo-body-1-normal-regular text-label-normal">
              코스 없이 자유롭게 걷고, 이동 경로를 기록할 수 있어요.
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

            {/* 시작하기 */}
            <TouchableOpacity
              className="flex-1 bg-label-normal rounded-[10px] items-center justify-center"
              style={{ height: 48 }}
              onPress={onConfirm}
            >
              <Text className="typo-label-large text-common-100">시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
