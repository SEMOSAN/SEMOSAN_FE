import { BookmarkIcon } from "@/components/icons/bookmark-icon";
import { useMountainBookmark } from "@/features/mountains/hooks/use-mountain-bookmark";
import { LikedMountainResponse } from "@/types/api.generated";
import { Pressable } from "react-native";

type Props = {
  mountainId: number;
  mountainData?: LikedMountainResponse;
};

export function MountainBookmarkButton({ mountainId, mountainData }: Props) {
  const { isBookmarked, isPending, toggle } = useMountainBookmark(mountainId, mountainData);

  return (
    <Pressable hitSlop={8} onPress={toggle} disabled={isPending}>
      <BookmarkIcon color={"#1A1B1F"} filled={isBookmarked} />
    </Pressable>
  );
}
