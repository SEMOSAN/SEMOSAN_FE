import { UserIcon } from "@/components/icons/user-icon";
import { Image, View } from "react-native";

type AvatarSize = "sm" | "md" | "lg";

type PostAvatarProps = {
  size?: AvatarSize;
  imageUrl?: string;
};

const SIZE_MAP: Record<AvatarSize, { container: number; icon: number }> = {
  sm: { container: 24, icon: 17 },
  md: { container: 32, icon: 22 },
  lg: { container: 40, icon: 28 },
};

export function PostAvatar({ size = "md", imageUrl }: PostAvatarProps) {
  const { container, icon } = SIZE_MAP[size];
  return (
    <View
      className="items-center justify-center overflow-hidden rounded-full bg-fill-strongest"
      style={{ width: container, height: container }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: container, height: container }}
        />
      ) : (
        <UserIcon size={icon} color="#A4ABC0" />
      )}
    </View>
  );
}
