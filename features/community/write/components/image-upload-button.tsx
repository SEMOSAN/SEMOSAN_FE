import { CameraIcon } from "@/components/icons/camera-icon";
import { Pressable, Text } from "react-native";

export function ImageUploadButton() {
  return (
    <Pressable
      onPress={() => {
        // TODO : 이미지업로드 기능 구현
      }}
      className="h-16 w-16 items-center justify-center gap-1 rounded-lg border border-line-subtle bg-fill-normal"
    >
      <CameraIcon color="#73798c" />
      <Text className="text-label-subtler typo-body-2-normal-medium">
        업로드
      </Text>
    </Pressable>
  );
}
