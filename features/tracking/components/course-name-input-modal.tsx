import { RECORD_NAME_MAX_LENGTH } from "@/features/tracking/constants";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MODAL_BORDER_RADIUS = 16;
const MODAL_MAX_WIDTH = 320;
// 배경 오버레이 투명도 — StopConfirmModal과 동일
const OVERLAY_COLOR = "rgba(0,0,0,0.4)";
// 비워두면 서버가 채우는 기본 이름 형식 — 입력 없이 저장해도 된다는 힌트
const DEFAULT_NAME_HINT = "260723_닉네임의코스1";

type Props = {
  visible: boolean;
  /** 수정 진입 시 기존 이름, 새로 입력하는 경우 빈 문자열 */
  initialValue?: string;
  /** 비우고 저장하면 빈 문자열이 넘어온다 (서버 기본 이름으로 저장) */
  onSubmit: (name: string) => void;
  /** 하드웨어 back 등으로 닫힌 경우 — 이름 없이 저장과 동일하게 처리 */
  onDismiss: () => void;
};

export function CourseNameInputModal({
  visible,
  initialValue = "",
  onSubmit,
  onDismiss,
}: Props) {
  const [value, setValue] = useState(initialValue);

  // 열릴 때마다 기존 이름으로 초기화 (이전 입력값 잔류 방지)
  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      {/* 어두운 오버레이 */}
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: OVERLAY_COLOR }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full items-center"
        >
          {/* 모달 본체 */}
          <View
            className="w-full gap-3 bg-fill-normal px-5 py-5"
            style={{
              maxWidth: MODAL_MAX_WIDTH,
              borderRadius: MODAL_BORDER_RADIUS,
              marginHorizontal: 16,
            }}
          >
            {/* 타이틀 */}
            <Text className="text-center text-label-normal typo-body-1-normal-semi-bold">
              자유기록 이름을 정해주세요
            </Text>

            {/* 입력 필드 */}
            <View className="h-12 justify-center rounded-[10px] border border-line-subtle bg-fill-strong px-3">
              <TextInput
                className="text-label-normal typo-body-1-reading-regular"
                value={value}
                onChangeText={setValue}
                placeholder={DEFAULT_NAME_HINT}
                placeholderTextColor="#8b92a6"
                maxLength={RECORD_NAME_MAX_LENGTH}
                returnKeyType="done"
                autoFocus
                onSubmitEditing={() => onSubmit(value.trim())}
              />
            </View>

            {/* 저장하기 — 비워둬도 저장 가능(서버 기본 이름) */}
            <TouchableOpacity
              className="h-12 items-center justify-center rounded-[10px] bg-label-normal"
              activeOpacity={0.8}
              onPress={() => onSubmit(value.trim())}
            >
              <Text className="text-common-100 typo-label-large">저장하기</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
