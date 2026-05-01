import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
} & Omit<TouchableOpacityProps, 'onPress'>;

export function LongButton({ label, onPress, ...rest }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="h-12 w-full items-center justify-center rounded-[10px] bg-primary-normal"
      {...rest}
    >
      <Text className="typo-label-large-semi-bold text-white">{label}</Text>
    </TouchableOpacity>
  );
}
