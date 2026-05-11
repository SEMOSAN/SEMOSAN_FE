import { ArrowDownToLineIcon } from "@/components/icons/arrow-down-to-line-icon";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

type SupportedPlatform = "ios" | "android" | "all";

type Props = {
  nativeID: string;
  platform?: SupportedPlatform;
};

export function KeyboardAccessoryToolbar({
  nativeID,
  platform = "ios",
}: Props) {
  const shouldRender =
    platform === "all" ||
    (platform === "ios" && Platform.OS === "ios") ||
    (platform === "android" && Platform.OS === "android");

  if (!shouldRender) return null;

  return (
    <InputAccessoryView nativeID={nativeID}>
      <View className="flex-row items-center justify-end border-t border-line-subtle bg-fill-normal px-4 py-2">
        <TouchableOpacity onPress={() => Keyboard.dismiss()} hitSlop={8}>
          <ArrowDownToLineIcon size={20} color="#73798c" />
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );
}
