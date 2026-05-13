import { MountainCard } from "@/features/mountains/components/mountain-card";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useMountains } from "../hooks/use-mountains";
import {
  Coordinates,
  filterByDifficulty,
  filterByRegions,
  sortMountains,
} from "../modules/sort-mountains";
import { DifficultyOption } from "./difficulty-bottom-sheet";
import { Selection } from "./region-filter-content";
import { SortOption } from "./sort-bottom-sheet";

type Props = {
  sortOption: SortOption;
  userLocation: Coordinates | undefined;
  regionSelections: Selection[];
  difficultyOptions: DifficultyOption[];
};

export function MountainList({
  sortOption,
  userLocation,
  regionSelections,
  difficultyOptions,
}: Props) {
  const router = useRouter();

  const { data, isPending, isError } = useMountains({ size: 100 });

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) return null;
  if (!data?.content) return null;

  const mountains = sortMountains(
    data?.content ?? [],
    sortOption,
    userLocation,
  );

  const filteredMountains = filterByDifficulty(
    filterByRegions(mountains, regionSelections),
    difficultyOptions,
  );

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-5 px-5 py-3">
        {filteredMountains.map((mountain) => (
          <TouchableOpacity
            key={mountain.mountainId}
            onPress={() => router.push(`/mountains/${mountain.mountainId}`)}
            activeOpacity={0.7}
          >
            <MountainCard mountain={mountain} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
