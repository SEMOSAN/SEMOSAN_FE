import { CloseIcon } from '@/components/icons/close-icon';
import { Text, TouchableOpacity, View } from 'react-native';
import { COUNTDOWN_NUMBER_STYLE } from '../constants';

type Props = {
  countdown: number;
  onClose: () => void;
};

export function CountdownOverlay({ countdown, onClose }: Props) {
  return (
    <View
      className="absolute bg-label-normal items-center justify-center"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* 닫기 버튼 */}
      <TouchableOpacity
        className="absolute right-4 w-10 h-10 items-center justify-center"
        style={{ top: 56 }}
        onPress={onClose}
      >
        <CloseIcon />
      </TouchableOpacity>

      {/* 숫자 */}
      <Text className="text-common-100 text-center" style={COUNTDOWN_NUMBER_STYLE}>
        {countdown}
      </Text>

      {/* 하단 인디케이터 */}
      <View className="absolute bottom-2 w-32 h-1 rounded-full bg-fill-neutral" />
    </View>
  );
}
