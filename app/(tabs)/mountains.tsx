import { ResetIcon } from "@/components/icons/reset-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import {
  DifficultyBottomSheet,
  DifficultyOption,
} from "@/features/mountains/components/difficulty-bottom-sheet";
import {
  DurationBottomSheet,
  formatDuration,
} from "@/features/mountains/components/duration-bottom-sheet";
import { FilterBottomSheet } from "@/features/mountains/components/filter-bottom-sheet";
import { FilterChip } from "@/features/mountains/components/filter-chip";
import {
  Difficulty,
  MountainCard,
} from "@/features/mountains/components/mountain-card";
import {
  RegionFilterContent,
  Selection,
} from "@/features/mountains/components/region-filter-content";
import {
  SortBottomSheet,
  SortOption,
} from "@/features/mountains/components/sort-bottom-sheet";
import {
  MountainDifficulty,
  useMountains,
} from "@/features/mountains/hooks/use-mountains";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilterKey = "인기순" | "지역" | "소요시간" | "난이도";

const API_DIFFICULTY_MAP: Record<MountainDifficulty, Difficulty> = {
  EASY: "하",
  NORMAL: "중",
  HARD: "상",
};

const SORT_LABELS: Record<SortOption, string> = {
  popularity: "인기순",
  nearby: "가까운순",
  height: "높이순",
};

function getDurationLabel(range: [number, number]): string {
  if (range[0] === 0 && range[1] === 7) return "소요시간";
  return `${formatDuration(range[0], true)}~${formatDuration(range[1], false)}`;
}

export default function MountainsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [difficultyOptions, setDifficultyOptions] = useState<
    DifficultyOption[]
  >([]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 7]);
  const [regionSelections, setRegionSelections] = useState<Selection[]>([]);

  const { data, isLoading } = useMountains();

  const resetFilters = (): void => {
    setSortOption("popularity");
    setDifficultyOptions([]);
    setDurationRange([0, 7]);
    setRegionSelections([]);
  };

  const DIFFICULTY_MAP: Record<DifficultyOption, Difficulty> = {
    high: "상",
    medium: "중",
    low: "하",
  };

  const mountains = (data?.content ?? []).map((item) => ({
    id: item.mountainId,
    name: item.name,
    location: item.address,
    altitude: item.altitude,
    difficulty: API_DIFFICULTY_MAP[item.difficulty],
    imageUrl: item.imageUrl,
  }));

  const filteredMountains =
    difficultyOptions.length === 0
      ? mountains
      : mountains.filter((m) =>
          difficultyOptions.some((opt) => DIFFICULTY_MAP[opt] === m.difficulty),
        );

  const hasActiveFilter =
    sortOption !== "popularity" ||
    difficultyOptions.length > 0 ||
    durationRange[0] !== 0 ||
    durationRange[1] !== 7 ||
    regionSelections.length > 0;

  return (
    <View className="flex-1 bg-fill-normal" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-5">
        <Text className="flex-1 text-label-normal typo-headline-1-semi-bold">
          산 목록
        </Text>
        <SearchIcon />
      </View>

      {/* Filter bar */}
      <View style={{ height: 52 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 20,
            height: 52,
          }}
        >
          {hasActiveFilter && (
            <TouchableOpacity
              onPress={resetFilters}
              className="size-8 items-center justify-center rounded-full border border-line-subtle bg-fill-normal"
            >
              <ResetIcon />
            </TouchableOpacity>
          )}

          {(
            [
              { key: "인기순", label: SORT_LABELS[sortOption] },
              {
                key: "지역",
                label: "지역",
                isActive: regionSelections.length > 0,
                count: regionSelections.length,
              },
              {
                key: "소요시간",
                label: getDurationLabel(durationRange),
                isActive: durationRange[0] !== 0 || durationRange[1] !== 7,
              },
              {
                key: "난이도",
                label: "난이도",
                isActive: difficultyOptions.length > 0,
                count: difficultyOptions.length,
              },
            ] as {
              key: FilterKey;
              label: string;
              isActive?: boolean;
              count?: number;
            }[]
          )
            .slice()
            .sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0))
            .map(({ key, label, isActive, count }) => (
              <FilterChip
                key={key}
                label={label}
                isOpen={openFilter === key}
                isActive={isActive}
                count={count}
                onPress={() => setOpenFilter(key)}
              />
            ))}
        </ScrollView>
      </View>

      {/* 정렬 바텀시트 */}
      <SortBottomSheet
        visible={openFilter === "인기순"}
        onClose={() => setOpenFilter(null)}
        selected={sortOption}
        onSelect={setSortOption}
      />

      {/* 난이도 필터 바텀시트 */}
      <DifficultyBottomSheet
        visible={openFilter === "난이도"}
        onClose={() => setOpenFilter(null)}
        selected={difficultyOptions}
        onApply={(options) => {
          setDifficultyOptions(options);
          setOpenFilter(null);
        }}
      />

      {/* 소요시간 필터 바텀시트 */}
      <DurationBottomSheet
        visible={openFilter === "소요시간"}
        onClose={() => setOpenFilter(null)}
        low={durationRange[0]}
        high={durationRange[1]}
        onApply={(l, h) => {
          setDurationRange([l, h]);
          setOpenFilter(null);
        }}
      />

      {/* 지역 필터 바텀시트 */}
      <FilterBottomSheet
        visible={openFilter === "지역"}
        onClose={() => setOpenFilter(null)}
        title="지역"
      >
        <RegionFilterContent
          initialSelections={regionSelections}
          onApply={(selections) => {
            setRegionSelections(selections);
            setOpenFilter(null);
          }}
        />
      </FilterBottomSheet>

      {/* Mountain list */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-5 px-5 py-3">
            {filteredMountains.map((mountain) => (
              <TouchableOpacity
                key={mountain.id}
                onPress={() => router.push(`/mountains/${mountain.id}`)}
                activeOpacity={0.7}
              >
                <MountainCard mountain={mountain} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
