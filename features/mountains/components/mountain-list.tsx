import { MountainCard } from "@/features/mountains/components/mountain-card";
import { useRouter } from "expo-router";
import { LoadingSpinner } from "@/components/loading-spinner";
import { FlatList, TouchableOpacity } from "react-native";
import { useMountains } from "../hooks/use-mountains";
import {
  Coordinates,
  filterByDifficulty,
  filterByDuration,
  filterByRegions,
  sortMountains,
} from "../modules/sort-mountains";
import { DifficultyOption } from "./difficulty-bottom-sheet";
import { Selection } from "./region-filter-content";
import { SortOption } from "./sort-bottom-sheet";

const MOUNTAIN_LIST_PAGE_SIZE = 1000;

type Props = {
  sortOption: SortOption;
  userLocation: Coordinates | undefined;
  regionSelections: Selection[];
  difficultyOptions: DifficultyOption[];
  durationRange: [number, number];
};

export function MountainList({
  sortOption,
  userLocation,
  regionSelections,
  difficultyOptions,
  durationRange,
}: Props) {
  const router = useRouter();

  const { data, isPending, isError } = useMountains({
    size: MOUNTAIN_LIST_PAGE_SIZE,
  });

  if (isPending) return <LoadingSpinner fullScreen />;
  if (isError) return null;
  if (!data?.content) return null;

  const mountains = sortMountains(
    data?.content ?? [],
    sortOption,
    userLocation,
  );

  const filteredMountains = filterByDifficulty(
    filterByDuration(
      filterByRegions(mountains, regionSelections),
      durationRange,
    ),
    difficultyOptions,
  );

  return (
    <FlatList
      className="flex-1"
      showsVerticalScrollIndicator={false}
      data={filteredMountains}
      keyExtractor={(mountain) => String(mountain.mountainId)}
      contentContainerClassName="gap-5 px-5 py-3"
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/mountains/${item.mountainId}`)}
          activeOpacity={0.7}
        >
          <MountainCard mountain={item} />
        </TouchableOpacity>
      )}
      windowSize={7}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
    />
  );
}
