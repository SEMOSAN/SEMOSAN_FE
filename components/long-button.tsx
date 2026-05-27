import { ActivityIndicator, Pressable, Text } from "react-native";

/**
 * 온보딩·공통 CTA 버튼 컴포넌트.
 *
 * @see https://www.figma.com/design/I78fKhsoWJN2zdZFKFrGTZ/-%EC%84%B8%EB%AA%A8%EC%82%B0--%EB%94%94%EC%9E%90%EC%9D%B8-%EA%B3%B5%EC%9E%91%EC%86%8C?node-id=223-12063
 */
type LongButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function LongButton({
  label,
  onPress,
  disabled,
  loading,
}: LongButtonProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="h-12 w-full items-center justify-center rounded-[10px] bg-primary-normal"
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="typo-label-large-semi-bold text-white">{label}</Text>
      )}
    </Pressable>
  );
}
