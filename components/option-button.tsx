import { Pressable, Text } from "react-native";

type OptionButtonProps = {
  label: string;
  selected?: boolean;
  align?: "left" | "center";
  onPress?: () => void;
  disabled?: boolean;
};

export function OptionButton({
  label,
  selected = false,
  align = "left",
  onPress,
  disabled,
}: OptionButtonProps): React.ReactNode {
  return (
    <Pressable
      className={`rounded-[12px] border p-4 ${
        selected
          ? "border-line-primary bg-interaction-subtle"
          : "border-line-subtle"
      } ${align === "center" ? "items-center" : "items-start"}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-label-normal typo-body-1-normal-medium">{label}</Text>
    </Pressable>
  );
}
