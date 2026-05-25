import { CameraIcon } from "@/components/icons/camera-icon";
import { CloseSmallIcon } from "@/components/icons/close-small-icon";
import { uploadImage } from "@/hooks/use-upload-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const MAX_IMAGES = 10;

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function ImageUploadButton({ value, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  async function handlePress(): Promise<void> {
    if (isUploading || value.length >= MAX_IMAGES) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - value.length,
      quality: 0.8,
    });

    if (result.canceled) return;

    setIsUploading(true);
    try {
      const urls = await Promise.all(
        result.assets.map((asset) => {
          const filename = asset.uri.split("/").pop() ?? "image.jpg";
          return uploadImage(asset.uri, filename);
        }),
      );
      onChange([...value, ...urls]);
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove(index: number): void {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2">
        {value.map((url, index) => (
          <View key={url} className="relative size-16">
            <Image
              source={{ uri: url }}
              className="size-16 rounded-lg"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => handleRemove(index)}
              className="absolute -right-1 -top-1 size-5 items-center justify-center rounded-full bg-label-normal"
            >
              <CloseSmallIcon size={12} color="#ffffff" />
            </Pressable>
          </View>
        ))}

        {value.length < MAX_IMAGES && (
          <Pressable
            onPress={handlePress}
            disabled={isUploading}
            className="size-16 items-center justify-center gap-1 rounded-lg border border-line-subtle bg-fill-normal"
          >
            {isUploading ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <CameraIcon color="#73798c" />
                <Text className="text-label-subtler typo-caption-1-regular">
                  {value.length}/{MAX_IMAGES}
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}
