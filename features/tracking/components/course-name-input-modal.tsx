import { XIcon } from "@/components/icons/x-icon";
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

type Props = {
  visible: boolean;
  /** 수정 진입 시 기존 이름, 새로 입력하는 경우 빈 문자열 */
  initialValue?: string;
  /** placeholder 기본값 생성용 */
  mountainName?: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
};

export function CourseNameInputModal({
  visible,
  initialValue = "",
  mountainName,
  onCancel,
  onSubmit,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // 열릴 때마다 기존 이름으로 초기화 (이전 입력값 잔류 방지)
  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const isEditing = initialValue.length > 0;
  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0 && trimmed !== initialValue;

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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full items-center"
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
              <Text className="text-label-normal typo-heading-1-semi-bold">
                {isEditing
                  ? "코스 이름을 수정할까요?"
                  : "코스 이름을 정할까요?"}
              </Text>
              <Text className="text-label-subtle typo-body-1-normal-regular">
                입력한 이름으로 홈의 다녀온 코스에 표시돼요.
                {!isEditing && " 건너뛰면 기본 이름으로 저장돼요."}
              </Text>
            </View>

            {/* 입력 필드 */}
            <View className="gap-2 px-5 pb-1">
              <View
                className={`h-12 flex-row items-center gap-2 rounded-[10px] border bg-fill-normal px-3 ${
                  isFocused ? "border-line-primary" : "border-line-subtle"
                }`}
              >
                <TextInput
                  className="flex-1 text-label-normal typo-body-1-reading-regular"
                  value={value}
                  onChangeText={setValue}
                  placeholder={
                    mountainName ? `${mountainName} 자유 기록` : "자유 기록"
                  }
                  placeholderTextColor="#73798c"
                  maxLength={RECORD_NAME_MAX_LENGTH}
                  returnKeyType="done"
                  autoFocus
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onSubmitEditing={() => canSubmit && onSubmit(trimmed)}
                  style={{ paddingVertical: 0 }}
                />
                {value.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setValue("")}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <XIcon size={20} color="#1a1b1f" />
                  </TouchableOpacity>
                )}
              </View>
              <Text className="text-label-subtler typo-caption-1-regular">
                {RECORD_NAME_MAX_LENGTH}글자까지 입력할 수 있어요
              </Text>
            </View>

            {/* 버튼 행 */}
            <View className="flex-row gap-2 px-4 pb-4 pt-4">
              {/* 건너뛰기 / 취소 */}
              <TouchableOpacity
                className="flex-1 items-center justify-center rounded-[10px] bg-fill-stronger"
                style={{ height: 48 }}
                onPress={onCancel}
              >
                <Text className="text-label-subtle typo-label-large">
                  {isEditing ? "취소" : "건너뛰기"}
                </Text>
              </TouchableOpacity>

              {/* 저장 */}
              <TouchableOpacity
                className={`flex-1 items-center justify-center rounded-[10px] ${
                  canSubmit ? "bg-label-normal" : "bg-fill-disabled"
                }`}
                style={{ height: 48 }}
                disabled={!canSubmit}
                onPress={() => onSubmit(trimmed)}
              >
                <Text
                  className={`typo-label-large ${
                    canSubmit ? "text-common-100" : "text-label-disabled"
                  }`}
                >
                  저장
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
