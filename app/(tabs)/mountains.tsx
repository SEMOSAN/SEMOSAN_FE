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
import { MountainCard, MOCK_MOUNTAINS } from "@/features/mountains/components/mountain-card";
import {
  RegionFilterContent,
  Selection,
} from "@/features/mountains/components/region-filter-content";
import {
  SortBottomSheet,
  SortOption,
} from "@/features/mountains/components/sort-bottom-sheet";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";

function SearchIcon(): React.JSX.Element {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
        stroke="#1A1B1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ResetIcon(): React.JSX.Element {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C5.92286 2 4.07719 3.05771 3 4.66667"
        stroke="#1A1B1F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M3 2V5H6"
        stroke="#1A1B1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type FilterKey = "인기순" | "지역" | "소요시간" | "난이도";

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
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [difficultyOptions, setDifficultyOptions] = useState<DifficultyOption[]>([]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 7]);
  const [regionSelections, setRegionSelections] = useState<Selection[]>([]);

  const resetFilters = (): void => {
    setSortOption("popularity");
    setDifficultyOptions([]);
    setDurationRange([0, 7]);
    setRegionSelections([]);
  };

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
          contentContainerStyle={{ alignItems: "center", gap: 8, paddingHorizontal: 20, height: 52 }}
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
            ] as { key: FilterKey; label: string; isActive?: boolean; count?: number }[]
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-5 px-5 py-3">
          {MOCK_MOUNTAINS.map((mountain) => (
            <MountainCard key={mountain.id} mountain={mountain} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
