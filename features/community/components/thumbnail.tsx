import { Image } from "expo-image";
import { View } from "react-native";

export function Thumbnail({ imageUrl }: { imageUrl: string }) {
  return (
    <View className="size-[68px] overflow-hidden rounded-[4px] bg-fill-neutral">
      <Image
        source={{ uri: imageUrl }}
        style={{ flex: 1 }}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={100}
      />
    </View>
  );
}
