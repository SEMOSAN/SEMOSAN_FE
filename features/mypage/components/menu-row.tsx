import { Text, TouchableOpacity, View } from 'react-native';
import { MenuChevronIcon } from './menu-chevron-icon';

type Props = {
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
};

export function MenuRow({ label, value, onPress, danger }: Props) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4"
      style={{ height: 52 }}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text
        className={`typo-body-1-normal-medium ${
          danger ? 'text-status-negative-normal' : 'text-label-normal'
        }`}
        style={{ letterSpacing: -0.16 }}
      >
        {label}
      </Text>
      <View className="flex-row items-center gap-1">
        {value && (
          <Text className="typo-body-1-normal-regular text-label-alternative">
            {value}
          </Text>
        )}
        <MenuChevronIcon color={danger ? '#ff5249' : '#73798C'} />
      </View>
    </TouchableOpacity>
  );
}
