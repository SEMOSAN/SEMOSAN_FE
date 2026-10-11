import { BookmarkIcon } from "@/components/icons/bookmark-icon";
import { useMountainBookmark } from "@/features/mountains/hooks/use-mountain-bookmark";
import { LikedMountainResponse } from "@/types/api.generated";
import { Pressable } from "react-native";

type Props = {
  mountainId: number;
  /** 화면이 받은 서버 응답의 likedByMe */
  liked: boolean;
  mountainData?: LikedMountainResponse;
};

export function MountainBookmarkButton({
  mountainId,
  liked,
  mountainData,
}: Props) {
  const { isBookmarked, isPending, toggle } = useMountainBookmark(
    mountainId,
    liked,
    mountainData,
  );

  return (
    <Pressable
      className="h-6 w-6"
      hitSlop={8}
      onPress={toggle}
      disabled={isPending}
    >
      <BookmarkIcon color={"#1A1B1F"} filled={isBookmarked} />
    </Pressable>
  );
}
