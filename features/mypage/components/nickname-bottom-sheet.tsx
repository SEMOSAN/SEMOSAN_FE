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
import { Path, Svg } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

export function NicknameBottomSheet({ visible, initialValue, onClose, onSave }: Props) {
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
            닉네임
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
              maxLength={10}
              autoFocus
              style={{ letterSpacing: -0.16, lineHeight: 20 }}
            />
            {value.length > 0 && (
              <TouchableOpacity
                onPress={() => setValue('')}
                activeOpacity={0.6}
                className="bg-fill-neutral items-center justify-center"
                style={{ width: 20, height: 20, borderRadius: 16, transform: [{ rotate: '90deg' }] }}
              >
                <Svg width={8} height={8} viewBox="0 0 8 8" fill="none">
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.96883 0.176743C7.20456 -0.0589707 7.58655 -0.0588578 7.82235 0.176743C8.05813 0.412526 8.05812 0.794469 7.82235 1.03026L4.85262 3.99901L7.82333 6.96971C8.05866 7.20549 8.05884 7.58756 7.82333 7.82323C7.58754 8.05902 7.20462 8.05902 6.96883 7.82323L3.99911 4.8535L1.03036 7.82323C0.79467 8.0589 0.412649 8.05871 0.176841 7.82323C-0.0589471 7.58744 -0.0589471 7.20452 0.176841 6.96873L3.14559 3.99901L0.176841 1.03026C-0.0588405 0.794461 -0.0589114 0.412496 0.176841 0.176743C0.412605 -0.0588726 0.794606 -0.0588935 1.03036 0.176743L3.99911 3.14549L6.96883 0.176743Z"
                    fill="#33363D"
                  />
                </Svg>
              </TouchableOpacity>
            )}
          </View>

          {/* 안내 텍스트 */}
          <Text
            className="typo-caption-1-regular text-label-subtler"
            style={{ marginTop: 8 }}
          >
            10글자 이내의 한글, 영문, 숫자만 가능해요
          </Text>

          {/* 저장하기 버튼 */}
          <TouchableOpacity
            className={`items-center justify-center mt-9 mb-9 ${isChanged ? 'bg-label-normal' : 'bg-fill-disabled'}`}
            style={{ height: 56, borderRadius: 16 }}
            activeOpacity={0.8}
            disabled={!isChanged}
            onPress={() => {
              onSave(value.trim());
              onClose();
            }}
          >
            <Text
              className={`typo-body-1-normal-semi-bold ${isChanged ? 'text-common-100' : 'text-label-disabled'}`}
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
