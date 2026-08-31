import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

export function BirthDateBottomSheet({ visible, initialValue, onClose, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const isChanged = value.trim().length > 0 && value !== initialValue;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {/* 배경 딤 */}
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          className="bg-black/40"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* 바텀시트 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            className="bg-fill-normal"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: insets.bottom + 16,
            }}
          >
            {/* 핸들 바 */}
            <View className="items-center mb-5">
              <View className="bg-fill-stronger" style={{ width: 36, height: 4, borderRadius: 2 }} />
            </View>

            {/* 제목 */}
            <Text
              className="typo-body-2-normal-semi-bold text-label-subtle"
              style={{ marginBottom: 12, letterSpacing: -0.14 }}
            >
              생년월일
            </Text>

            {/* 입력 필드 */}
            <View
              className="flex-row items-center bg-fill-normal border border-line-subtle"
              style={{
                height: 48,
                minHeight: 48,
                maxHeight: 48,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 10,
                gap: 8,
              }}
            >
              <TextInput
                className="flex-1 typo-body-1-reading-regular text-label-normal"
                value={value}
                onChangeText={setValue}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#8b92a6"
                keyboardType="numbers-and-punctuation"
                autoFocus
                style={{ letterSpacing: -0.16, lineHeight: 20 }}
              />
            </View>

            {/* 저장하기 버튼 */}
            <TouchableOpacity
              className={`items-center justify-center mt-9 mb-9 ${
                isChanged ? 'bg-label-normal' : 'bg-fill-disabled'
              }`}
              style={{ height: 56, borderRadius: 16 }}
              activeOpacity={0.8}
              disabled={!isChanged}
              onPress={() => {
                onSave(value.trim());
                onClose();
              }}
            >
              <Text
                className={`typo-body-1-normal-semi-bold ${
                  isChanged ? 'text-common-100' : 'text-label-disabled'
                }`}
              >
                저장하기
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
