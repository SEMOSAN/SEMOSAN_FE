import { MountainIcon } from "@/components/icons/mountain-icon";
import { colors } from "@/constants/colors";
import { Text, View, ViewStyle } from "react-native";
import { SHADOW } from "../constants";

type Props = {
  name?: string;
  style?: ViewStyle;
};

/** 우상단 현재 산 이름 칩. 근처 산이 여러 개 오게 되면 드롭다운으로 확장한다 */
export function MountainNameChip({ name, style }: Props) {
  if (!name) return null;
  return (
    <View
      className="absolute right-4 flex-row items-center gap-1.5 rounded-full bg-fill-normal py-2 pl-3 pr-3.5"
      style={[SHADOW, style]}
    >
      <MountainIcon size={18} color={colors.secondary.normal} />
      <Text className="typo-label-normal text-label-normal">{name}</Text>
    </View>
  );
}
