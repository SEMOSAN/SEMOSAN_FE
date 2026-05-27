import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Gender = '여성' | '남성';

type Props = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: Gender) => void;
};

export function GenderBottomSheet({ visible, initialValue, onClose, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Gender>(initialValue as Gender);

  useEffect(() => {
    if (visible) setSelected(initialValue as Gender);
  }, [visible, initialValue]);

  const isChanged = selected !== initialValue;

  const options: Gender[] = ['여성', '남성'];

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
              성별
            </Text>

            {/* 선택 버튼 */}
            <View className="flex-row gap-3">
              {options.map((option) => {
                const isSelected = selected === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setSelected(option)}
                    activeOpacity={0.7}
                    className={`flex-1 items-center justify-center ${
                      isSelected ? 'bg-interaction-subtle border-line-primary' : 'bg-fill-normal border-line-subtle'
                    } border`}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      gap: 10,
                    }}
                  >
                    <Text
                      className={`typo-body-1-normal-medium ${
                        isSelected ? 'text-label-normal' : 'text-label-alternative'
                      }`}
                      style={{ letterSpacing: -0.16 }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
                onSave(selected);
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
