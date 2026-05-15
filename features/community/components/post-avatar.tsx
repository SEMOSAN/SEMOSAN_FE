import { UserIcon } from "@/components/icons/user-icon";
import React from "react";
import { View } from "react-native";

type AvatarSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<AvatarSize, { container: number; icon: number }> = {
  sm: { container: 24, icon: 17 },
  md: { container: 32, icon: 22 },
  lg: { container: 40, icon: 28 },
};

export function PostAvatar({ size = "md" }: { size?: AvatarSize }) {
  const { container, icon } = SIZE_MAP[size];
  return (
    <View
      className="rounded-full bg-fill-strongest items-center justify-center"
      style={{ width: container, height: container }}
    >
      <UserIcon size={icon} color="#A4ABC0" />
    </View>
  );
}
