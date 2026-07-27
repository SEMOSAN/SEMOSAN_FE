import { AvatarIcon } from "@/components/icons/avatar-icon";
import { Image } from "react-native";

type Props = {
  url?: string | null;
  size?: number;
};

export function ProfileAvatar({ url, size = 100 }: Props) {
  if (url?.startsWith("http")) {
    return (
      <Image
        source={{ uri: url }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  // 프로필 이미지 미설정(온보딩 건너뛰기 포함) 시 기본 아바타 표시
  return <AvatarIcon size={size} />;
}
