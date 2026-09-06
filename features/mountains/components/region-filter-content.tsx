import { CheckIcon } from "@/components/icons/check-icon";
import { LongButton } from "@/components/long-button";
import { DISTRICTS, REGIONS } from "@/features/mountains/constants/regions";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";

function XIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Path
        d="M11 3L3 11M3 3L11 11"
        stroke="#8b92a6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export type Selection = { region: string; district: string };

type Props = {
  initialSelections?: Selection[];
  onApply: (selections: Selection[]) => void;
};

function SearchIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
        stroke="#464A57"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function RegionFilterContent({ initialSelections = [], onApply }: Props) {
  const [selectedRegion, setSelectedRegion] = useState("서울");
  const [selectedDistricts, setSelectedDistricts] = useState<Selection[]>(initialSelections);
  const [searchQuery, setSearchQuery] = useState("");

  const districts = DISTRICTS[selectedRegion] ?? [];
  const listItems: Selection[] = searchQuery
    ? Object.entries(DISTRICTS).flatMap(([region, dists]) =>
        dists
          .filter((d) => d.includes(searchQuery))
          .map((d) => ({ region, district: d })),
      )
    : districts.map((d) => ({ region: selectedRegion, district: d }));

  const handleDistrictPress = (region: string, district: string) => {
    Keyboard.dismiss();
    const current: Selection = { region, district };
    const isAll = district.endsWith("전체");

    setSelectedDistricts((prev) => {
      const alreadySelected = prev.some(
        (s) => s.region === region && s.district === district,
      );
      if (alreadySelected) {
        return prev.filter(
          (s) => !(s.region === region && s.district === district),
        );
      }
      if (isAll) {
        return [...prev.filter((s) => s.region !== region), current];
      }
      return [
        ...prev.filter(
          (s) => !(s.region === region && s.district.endsWith("전체")),
        ),
        current,
      ];
    });
  };

  const handleApply = () => {
    Keyboard.dismiss();
    onApply(selectedDistricts);
  };

  return (
    <View className="flex-col" style={{ height: 440 }}>
      {/* 검색 */}
      <View className="px-5 pt-3">
        <View className="h-12 flex-row items-center gap-2 rounded-full bg-fill-strong px-4">
          <TextInput
            className="flex-1 text-label-normal typo-body-1-reading-regular"
            placeholder="지역명 검색"
            placeholderTextColor="#8b92a6"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ lineHeight: 20 }}
          />
          <SearchIcon />
        </View>
      </View>

      {/* 시/도 탭 */}
      {!searchQuery && (
        <View style={{ flexShrink: 0 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            className="pb-2 pt-3"
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          >
            {REGIONS.map((region) => {
              const isSelected = region === selectedRegion;
              return (
                <Pressable
                  key={region}
                  onPress={() => {
                    Keyboard.dismiss();
                    setSelectedRegion(region);
                  }}
                  className={`rounded-full px-3 py-1.5 ${
                    isSelected
                      ? "bg-primary-subtle"
                      : "border border-line-subtle"
                  }`}
                >
                  <Text
                    className={`typo-body-2-normal-medium ${
                      isSelected ? "text-common-100" : "text-label-normal"
                    }`}
                  >
                    {region}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* 구/군 목록 + 선택됨 플로팅 */}
      <View className="relative flex-1">
        <ScrollView
          className="pt-3"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            selectedDistricts.length > 0 ? { paddingBottom: 80 } : undefined
          }
        >
          {listItems.map((item) => {
            const isSelected = selectedDistricts.some(
              (s) => s.region === item.region && s.district === item.district,
            );
            return (
              <Pressable
                key={`${item.region}-${item.district}`}
                onPress={() => handleDistrictPress(item.region, item.district)}
                className="flex-row items-center px-5 py-3"
              >
                <View>
                  <Text
                    className={`typo-body-2-normal-medium ${
                      isSelected ? "text-label-normal" : "text-label-subtler"
                    }`}
                  >
                    {item.district}
                  </Text>
                  {searchQuery && (
                    <Text className="text-label-subtler typo-body-3-medium">
                      {item.region}
                    </Text>
                  )}
                </View>
                {isSelected && (
                  <View className="ml-[6px]">
                    <CheckIcon size={16} color="#00D864" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 선택됨 */}
        {selectedDistricts.length > 0 && (
          <View
            className="absolute bottom-0 left-0 right-0 bg-fill-normal px-5 pb-3 pt-3"
            style={{
              zIndex: 10,
              boxShadow: '0px -12px 20px 0px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Text className="text-label-subtler typo-body-3-medium">
              선택됨
            </Text>
            <View className="flex-row flex-wrap gap-2 pt-3">
              {selectedDistricts.map((s) => (
                <View
                  key={`${s.region}-${s.district}`}
                  className="flex-row items-center gap-1 rounded-[4px] bg-fill-stronger px-[6px] py-[3px]"
                >
                  <Text className="text-label-subtle typo-body-3-medium">
                    {s.district}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setSelectedDistricts((prev) =>
                        prev.filter(
                          (d) =>
                            !(
                              d.region === s.region && d.district === s.district
                            ),
                        ),
                      );
                    }}
                  >
                    <XIcon />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* 적용하기 버튼 */}
      <View className="px-5 pb-2 pt-4">
        <LongButton label="적용하기" onPress={handleApply} />
      </View>
    </View>
  );
}
