import { ArrowDownToLineIcon } from "@/components/icons/arrow-down-to-line-icon";
import {
  InputAccessoryView,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  nativeID: string;
};

export function IOSKeyboardAccessoryToolbar({
  nativeID,
}: Props): React.ReactElement | null {
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
