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

type ImageUploadButtonProps = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function ImageUploadButton({ value, onChange }: ImageUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  async function handlePress(): Promise<void> {
    if (isUploading || value.length >= MAX_IMAGES) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setIsUploading(true);
    try {
      const filename = asset.uri.split("/").pop() ?? "image.jpg";
      const url = await uploadImage(asset.uri, filename);
      onChange([...value, url]);
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove(index: number): void {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <ScrollView
      className="pt-4"
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex-row items-center gap-2">
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
                <Text className="text-label-subtler typo-caption-1-medium">
                  업로드
                </Text>
              </>
            )}
          </Pressable>
        )}

        {value.map((url, index) => (
          <View key={url} className="relative size-16">
            <Image
              source={{ uri: url }}
              className="size-16 rounded-lg"
              resizeMode="cover"
            />
            {index === 0 && (
              <View
                className="absolute bottom-0 left-0 right-0 items-center justify-center rounded-b-lg py-0.5"
                style={{ backgroundColor: "#2f323a" }}
              >
                <Text className="text-label-normal-inverse typo-caption-1-medium">
                  대표 사진
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => handleRemove(index)}
              className="absolute -right-1 -top-2 size-5 items-center justify-center rounded-full bg-label-normal"
            >
              <CloseSmallIcon size={10} color="#ffffff" />
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
