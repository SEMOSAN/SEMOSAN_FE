import { BookmarkIcon } from "@/components/icons/bookmark-icon";
import { useMountainBookmark } from "@/features/mountains/hooks/use-mountain-bookmark";
import { TouchableOpacity } from "react-native";

type Props = {
  mountainId: number;
};

export function MountainBookmarkButton({ mountainId }: Props) {
  const { isBookmarked, like, unlike } = useMountainBookmark(mountainId);

  function handlePress() {
    if (isBookmarked) {
      unlike.mutate();
    } else {
      like.mutate();
    }
  }

  return (
    <TouchableOpacity
      hitSlop={8}
      onPress={handlePress}
      disabled={like.isPending || unlike.isPending}
    >
      <BookmarkIcon color={isBookmarked ? "#507EF4" : "#1A1B1F"} />
    </TouchableOpacity>
  );
}
