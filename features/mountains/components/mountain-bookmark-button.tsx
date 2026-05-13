import { BookmarkIcon } from "@/components/icons/bookmark-icon";
import { useMountainBookmark } from "@/features/mountains/hooks/use-mountain-bookmark";
import { TouchableOpacity } from "react-native";

type Props = {
  mountainId: number;
};

export function MountainBookmarkButton({ mountainId }: Props) {
  const { isBookmarked, isPending, toggle } = useMountainBookmark(mountainId);

  return (
    <TouchableOpacity hitSlop={8} onPress={toggle} disabled={isPending}>
      <BookmarkIcon color={"#1A1B1F"} filled={isBookmarked} />
    </TouchableOpacity>
  );
}
