import { Image, View } from "react-native";

export function Thumbnail({ imageUrl }: { imageUrl: string }) {
  return (
    <View className="size-[68px] overflow-hidden rounded-[4px] bg-fill-neutral">
      <Image source={{ uri: imageUrl }} className="size-[68px]" />
    </View>
  );
}
