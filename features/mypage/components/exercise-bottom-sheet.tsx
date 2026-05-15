import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SHEET_HEIGHT = 640;
const SAVE_BUTTON_BOTTOM_PADDING = 34;

const EXERCISE_TYPES = [
  '걷기', '등산', '러닝', '헬스', '수영',
  '홈트레이닝', '필라테스/요가', '스포츠 (배드민턴, 테니스, 축구 등)', '크로스핏', '운동 안 함',
];
const EXERCISE_FREQUENCIES = ['거의 매일', '주 3~4회', '주 1~2회', '월 1~2회', '연 1~2회'];
const EXERCISE_DURATIONS = ['4시간 이상', '2~4시간', '1~2시간', '1시간 미만'];

type OpenDropdown = 'type' | 'frequency' | 'duration' | null;

export type ExerciseData = {
  type: string;
  frequency: string;
  duration: string;
};

type Props = {
  visible: boolean;
  initialValue: ExerciseData;
  onClose: () => void;
  onSave: (value: ExerciseData) => void;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d={open
          ? 'M13 10L8 5L3 10'
          : 'M3 6L8 11L13 6'}
        stroke="#73798C"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Dropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 16, zIndex: isOpen ? 100 : 1 }}>
      <Text
        className="typo-body-1-normal-semi-bold text-label-subtle"
        style={{ marginBottom: 8, letterSpacing: -0.16 }}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        className={`flex-row items-center justify-between bg-fill-normal ${
          isOpen ? 'border-line-primary' : 'border-line-subtle'
        } border`}
        style={{ height: 48, paddingHorizontal: 12, borderRadius: 10 }}
      >
        <Text
          className="typo-body-1-normal-regular text-label-normal"
          style={{ letterSpacing: -0.16 }}
        >
          {value}
        </Text>
        <ChevronIcon open={isOpen} />
      </TouchableOpacity>

      {isOpen && (
        <View
          className="bg-fill-normal border border-line-subtle"
          style={{ borderRadius: 10, marginTop: 4, maxHeight: 200, overflow: 'hidden' }}
        >
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {options.map((option, idx) => (
              <TouchableOpacity
                key={option}
                onPress={() => onSelect(option)}
                activeOpacity={0.6}
                className={`flex-row items-center ${option === value ? 'bg-fill-strong' : ''}`}
                style={{ height: 48, paddingHorizontal: 16 }}
              >
                <Text
                  className={`typo-body-1-reading-regular ${
                    option === value ? 'text-label-normal' : 'text-label-subtler'
                  }`}
                  style={{ letterSpacing: -0.16 }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export function ExerciseBottomSheet({ visible, initialValue, onClose, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<ExerciseData>(initialValue);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  useEffect(() => {
    if (visible) {
      setData(initialValue);
      setOpenDropdown(null);
    }
  }, [visible, initialValue]);

  const isChanged =
    data.type !== initialValue.type ||
    data.frequency !== initialValue.frequency ||
    data.duration !== initialValue.duration;

  const toggle = (key: OpenDropdown) =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  const select = (key: keyof ExerciseData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

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

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            className="bg-fill-normal"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: SHEET_HEIGHT,
            }}
          >
            {/* 핸들 바 */}
            <View className="items-center" style={{ paddingTop: 12, marginBottom: 20 }}>
              <View className="bg-fill-stronger" style={{ width: 36, height: 4, borderRadius: 2 }} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}
            >
              {/* 제목 */}
              <Text
                className="typo-body-2-normal-semi-bold text-label-subtle"
                style={{ marginBottom: 16, letterSpacing: -0.14 }}
              >
                운동 경험
              </Text>

              <Dropdown
                label="가장 즐겨하는 운동은 무엇인가요?"
                value={data.type}
                options={EXERCISE_TYPES}
                isOpen={openDropdown === 'type'}
                onToggle={() => toggle('type')}
                onSelect={(v) => select('type', v)}
              />

              <Dropdown
                label="운동 빈도는 어떻게 되시나요?"
                value={data.frequency}
                options={EXERCISE_FREQUENCIES}
                isOpen={openDropdown === 'frequency'}
                onToggle={() => toggle('frequency')}
                onSelect={(v) => select('frequency', v)}
              />

              <Dropdown
                label="운동 시간은 얼마나 되시나요?"
                value={data.duration}
                options={EXERCISE_DURATIONS}
                isOpen={openDropdown === 'duration'}
                onToggle={() => toggle('duration')}
                onSelect={(v) => select('duration', v)}
              />
            </ScrollView>

            {/* 저장하기 버튼 */}
            <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + SAVE_BUTTON_BOTTOM_PADDING }}>
              <TouchableOpacity
                className={`items-center justify-center ${
                  isChanged ? 'bg-label-normal' : 'bg-fill-disabled'
                }`}
                style={{
                  height: 48,
                  borderRadius: 10,
                  paddingVertical: 11,
                  paddingHorizontal: 20,
                  gap: 8,
                }}
                activeOpacity={0.8}
                disabled={!isChanged}
                onPress={() => {
                  onSave(data);
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
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
